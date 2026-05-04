import cvData from "@/content/cv.json";

/* ────────────────────────────────────────────────────────────────────────────
   Type definitions for content/cv.json — the single source of truth.
   Edit cv.json, run `npm run dev`, and the site + generated PDF update.
   ──────────────────────────────────────────────────────────────────────────── */

export type CV = {
  person: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    links: {
      github: string;
      linkedin: string;
      /** Optional — set once the deployed site URL is known. Shown on the CV PDF. */
      website?: string;
      [key: string]: string | undefined;
    };
  };
  summary: string;
  skills: Record<string, string[]>;
  experience: Array<{
    role: string;
    company: string;
    start: string; // YYYY-MM
    end: string | null; // null = present
    summary: string;
    highlights: string[];
    stack: string[];
  }>;
  education: Array<{
    year: string;
    institution: string;
    credential: string;
    status?: "in-progress" | "completed";
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    /** Optional public verification URL (e.g. Skilljar credential page). */
    verifyUrl?: string;
    /** Optional one-line supporting note rendered under the certification. */
    note?: string;
  }>;
  awards: Array<{
    year: number;
    title: string;
    description: string;
    /** Whether this was a win or a nomination — drives the eyebrow label. */
    status?: "won" | "nominated";
  }>;
  interests: string[];
};

/**
 * Strongly-typed access to the CV. Cast once at the boundary; everywhere else
 * stays type-safe.
 */
export const cv = cvData as CV;

/**
 * Format a YYYY-MM start/end pair as a human-readable date range.
 *
 * @example formatRange("2024-02", null)       // "Feb 2024 – Present"
 * @example formatRange("2021-03", "2024-01")  // "Mar 2021 – Jan 2024"
 */
export function formatRange(start: string, end: string | null): string {
  const [sy, sm] = start.split("-");
  const startLabel = monthLabel(sm) ? `${monthLabel(sm)} ${sy}` : (sy ?? "");
  if (!end) return `${startLabel} – Present`;
  const [ey, em] = end.split("-");
  const endLabel = monthLabel(em) ? `${monthLabel(em)} ${ey}` : (ey ?? "");
  return `${startLabel} – ${endLabel}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(mm: string | undefined): string | null {
  if (!mm) return null;
  const idx = Number.parseInt(mm, 10) - 1;
  return MONTHS[idx] ?? null;
}
