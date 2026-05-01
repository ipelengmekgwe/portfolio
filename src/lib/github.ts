import featuredData from "@/content/featured.json";

type Featured = {
  pinned?: string[];
  exclude?: string[];
  /** Map of owner/repo (lowercase) to a friendlier display name. */
  displayNames?: Record<string, string>;
  /** Map of owner/repo (lowercase) to a custom description that overrides
   *  whatever GitHub returns — single source of truth from the portfolio repo. */
  descriptions?: Record<string, string>;
};
const featured = featuredData as Featured;

/* ────────────────────────────────────────────────────────────────────────────
   GitHub fetcher for the Selected Works chapter.
   - Server-side only (the function is async and reads env vars).
   - Uses Next.js fetch caching (revalidate: 3600) so we don't hammer the API
     and the page stays snappy.
   - Filters: env exclude list (e.g. EAMS-Technologies, FTSI-Web), forks of
     excluded owners, archived/disabled repos, and an explicit user-curated
     exclude list in content/featured.json.
   - Pin order: anything listed in featured.json's `pinned` array sits at the
     top in that order; everything else follows, sorted by pushed_at desc.
   ──────────────────────────────────────────────────────────────────────────── */

export type Project = {
  id: number;
  /** Original GitHub repo name (e.g. "meditation-expo-react-native"). */
  name: string;
  /** Friendlier portfolio label (e.g. "Meditation App") — falls back to name. */
  displayName: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
  archived: boolean;
};

type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  private: boolean;
  owner: { login: string };
  parent?: { owner: { login: string }; full_name: string };
};

const REVALIDATE_SECONDS = 60 * 60; // 1 hour

/**
 * Fetch and shape the list of public projects to feature on the site.
 *
 * Returns an empty array on any failure — the chapter renders a graceful
 * "in press" state in that case rather than crashing the page.
 */
export async function fetchProjects({ limit = 6 }: { limit?: number } = {}): Promise<Project[]> {
  const user = process.env.NEXT_PUBLIC_GITHUB_USER ?? "ipelengmekgwe";
  const token = process.env.GITHUB_TOKEN;
  const excludeOwners = (process.env.GITHUB_EXCLUDE_OWNERS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": `${user}-portfolio`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let repos: GithubRepo[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed&type=owner`,
      {
        headers,
        next: { revalidate: REVALIDATE_SECONDS, tags: ["projects"] },
      },
    );
    if (!res.ok) {
      console.warn(`[github] ${res.status} ${res.statusText} — falling back to empty list`);
      return [];
    }
    repos = (await res.json()) as GithubRepo[];
  } catch (err) {
    console.warn("[github] fetch failed — falling back to empty list", err);
    return [];
  }

  const explicitExclude = new Set(
    (featured.exclude ?? []).map((s) => s.toLowerCase()),
  );

  const filtered = repos.filter((r) => {
    if (r.private || r.archived || r.disabled) return false;

    // Owner / fork-parent in the env exclude list (defensive — these orgs
    // shouldn't surface even if the user forks one of their repos).
    if (excludeOwners.includes(r.owner.login.toLowerCase())) return false;
    if (r.parent && excludeOwners.includes(r.parent.owner.login.toLowerCase())) {
      return false;
    }

    if (explicitExclude.has(r.full_name.toLowerCase())) return false;

    // Empty repos with no description, language, and no stars are noise.
    const hasSignal = r.description || r.language || r.stargazers_count > 0;
    return Boolean(hasSignal);
  });

  // Pin order: featured.pinned first (in their listed order), then the rest.
  const pinnedOrder = (featured.pinned ?? []).map((s) => s.toLowerCase());
  const pinIndex = (r: GithubRepo) =>
    pinnedOrder.indexOf(r.full_name.toLowerCase());

  filtered.sort((a, b) => {
    const ai = pinIndex(a);
    const bi = pinIndex(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });

  return filtered.slice(0, limit).map(toProject);
}

function toProject(r: GithubRepo): Project {
  const key = r.full_name.toLowerCase();
  const displayName = featured.displayNames?.[key] ?? r.name;
  const description = featured.descriptions?.[key] ?? r.description;
  return {
    id: r.id,
    name: r.name,
    displayName,
    fullName: r.full_name,
    description,
    url: r.html_url,
    homepage: r.homepage,
    language: r.language,
    topics: r.topics ?? [],
    stars: r.stargazers_count,
    forks: r.forks_count,
    pushedAt: r.pushed_at,
    archived: r.archived,
  };
}

/**
 * Format a timestamp as a humanised "X ago" string for the project card.
 *
 * @example formatPushed("2026-04-15T...")  // "2 weeks ago"
 */
export function formatPushed(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diff = now.getTime() - then.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "a month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  if (years === 1) return "a year ago";
  return `${years} years ago`;
}

/**
 * Approximate language → swatch colour for the dot on each project card.
 * Uses GitHub's own colours where possible; falls back to the gold accent.
 */
export function languageColor(language: string | null): string {
  if (!language) return "var(--color-gold)";
  return LANGUAGE_COLORS[language] ?? "var(--color-gold)";
}

const LANGUAGE_COLORS: Record<string, string> = {
  "C#": "#178600",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  PowerShell: "#012456",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
  SQL: "#dad8d8",
  TSQL: "#e38c00",
  Dockerfile: "#384d54",
  MDX: "#fcb32c",
};
