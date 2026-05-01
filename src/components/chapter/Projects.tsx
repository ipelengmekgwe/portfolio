import { ExternalLink, GitFork, Star } from "lucide-react";

import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { fetchProjects, formatPushed, languageColor, type Project } from "@/lib/github";

/**
 * Chapter III — Selected Works.
 * Server component. Fetches the live GitHub feed at request time (cached for
 * one hour via Next's fetch cache) and renders the top projects as
 * illustrated cards. Falls back to a graceful "in press" panel if the API
 * is unreachable or returns nothing useful.
 */
export async function ChapterProjects() {
  const projects = await fetchProjects({ limit: 6 });

  return (
    <PageSpread id="chapter-3" ariaLabel="Chapter III — Selected Works">
      <ChapterHeading
        numeral="III"
        title="Selected Works"
        subtitle="A live shelf — pulled from GitHub, freshly dusted."
      />

      <p className="chapter-prose text-lg leading-relaxed mb-10 max-w-prose mx-auto text-center">
        These are my public repositories, sorted by recent activity. Anything
        client-confidential lives elsewhere by request. Hover any card to read
        the description and last-touched date; click through for the source.
      </p>

      {projects.length === 0 ? <EmptyShelf /> : <Shelf projects={projects} />}
    </PageSpread>
  );
}

function Shelf({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-6 list-none p-0">
      {projects.map((p) => (
        <li key={p.id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full p-6 bg-paper-shadow/40 border border-ink-faint/15 rounded-page transition-all hover:border-rust/40 hover:shadow-page hover:-translate-y-0.5"
    >
      <header className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="font-display text-xl md:text-2xl text-rust leading-tight group-hover:underline decoration-gold decoration-2 underline-offset-4">
          {project.displayName}
        </h3>
        <ExternalLink
          aria-hidden="true"
          className="size-4 shrink-0 text-ink-faint group-hover:text-rust transition-colors mt-1"
        />
      </header>
      {project.displayName !== project.name ? (
        <p className="font-mono text-[0.65rem] small-caps text-ink-faint mb-3">
          {project.fullName}
        </p>
      ) : null}

      <p className="text-base text-ink-soft leading-relaxed min-h-[3.5rem]">
        {project.description ?? <span className="italic text-ink-faint">No description.</span>}
      </p>

      {project.topics.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5 mt-4 list-none p-0">
          {project.topics.slice(0, 5).map((topic) => (
            <li
              key={topic}
              className="font-mono text-[0.65rem] small-caps text-ink-faint px-2 py-0.5 border border-ink-faint/20 rounded-full"
            >
              {topic}
            </li>
          ))}
        </ul>
      ) : null}

      <footer className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-ink-faint">
        {project.language ? (
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: languageColor(project.language) }}
            />
            {project.language}
          </span>
        ) : null}
        {project.stars > 0 ? (
          <span className="flex items-center gap-1">
            <Star aria-hidden="true" className="size-3" />
            {project.stars}
          </span>
        ) : null}
        {project.forks > 0 ? (
          <span className="flex items-center gap-1">
            <GitFork aria-hidden="true" className="size-3" />
            {project.forks}
          </span>
        ) : null}
        <span className="ml-auto small-caps">
          updated {formatPushed(project.pushedAt)}
        </span>
      </footer>
    </a>
  );
}

/**
 * Shown when the GitHub API is unreachable / rate-limited / returned nothing.
 * Friendly fallback so the page keeps the chapter feel even on a bad day.
 */
function EmptyShelf() {
  return (
    <div className="text-center max-w-prose mx-auto py-8">
      <p className="font-display italic text-ink-soft">
        The shelf is being restocked.
      </p>
      <div className="ink-rule w-1/3 mx-auto my-6 bg-gold" />
      <p className="font-mono text-xs small-caps text-ink-faint">
        ✦ couldn't reach github just now — try again in a moment ✦
      </p>
    </div>
  );
}
