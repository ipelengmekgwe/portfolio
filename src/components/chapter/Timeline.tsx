import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { cv, formatRange } from "@/lib/cv";

/**
 * Chapter I — How We Got Here.
 * Career timeline, newest first. Each role is a numbered entry with role +
 * company, date range, a one-line summary, the highlights as a bulleted
 * recap, and the stack as small-caps tags.
 */
export function ChapterTimeline() {
  return (
    <PageSpread id="chapter-1" ariaLabel="Chapter I — How We Got Here">
      <ChapterHeading
        numeral="I"
        title="How We Got Here"
        subtitle="A decade, in chronological reverse."
      />

      <ol className="relative space-y-14">
        {/* Vertical ink rule running through the timeline */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute left-[7.5rem] top-2 bottom-2 w-px bg-ink-faint/30"
        />

        {cv.experience.map((role, idx) => (
          <li
            key={`${role.company}-${role.start}`}
            className="md:grid md:grid-cols-[8rem_1fr] md:gap-12"
          >
            <div className="md:text-right pr-0 md:pr-4 mb-3 md:mb-0">
              <p className="font-display text-3xl md:text-4xl text-rust leading-none">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <p className="font-mono text-[0.7rem] small-caps text-ink-faint mt-2">
                {formatRange(role.start, role.end)}
              </p>
            </div>

            <div className="relative md:pl-8">
              {/* Bullet on the rule */}
              <span
                aria-hidden="true"
                className="hidden md:block absolute -left-[0.4rem] top-2 size-2 rounded-full bg-gold ring-4 ring-paper"
              />

              <h3 className="font-display text-2xl md:text-3xl text-ink leading-tight">
                {role.role}
                <span className="font-display italic text-ink-soft text-xl md:text-2xl">
                  {" "}
                  · {role.company}
                </span>
              </h3>

              <p className="mt-3 text-lg leading-relaxed text-ink-soft">{role.summary}</p>

              <ul className="mt-5 space-y-2 list-disc list-outside pl-5 text-base leading-relaxed">
                {role.highlights.slice(0, 4).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              {role.stack.length > 0 ? (
                <p className="mt-5 font-mono text-[0.7rem] small-caps text-ink-faint">
                  <span className="opacity-70">Stack · </span>
                  {role.stack.join(" · ")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </PageSpread>
  );
}
