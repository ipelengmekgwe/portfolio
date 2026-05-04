import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { cv } from "@/lib/cv";

/**
 * Chapter II — The Toolkit.
 * Skills laid out as a glossary / index, grouped by category. Each term sits
 * inline as a small-caps mono tag. The bucket order is preserved from the
 * source so we can curate the reading order in cv.json.
 */
export function ChapterGlossary() {
  return (
    <PageSpread id="chapter-2" ariaLabel="Chapter II — The Toolkit">
      <ChapterHeading
        numeral="II"
        title="The Toolkit"
        subtitle="A working glossary — what I reach for, and why."
      />

      <p className="chapter-prose text-lg leading-relaxed mb-10">
        The list is honest, not exhaustive. Things I've shipped to production in the past few years
        sit in bold; things I'm currently sharpening or revisiting are in the same drawer but used
        less often. If a tool isn't on this page, I haven't earned the right to claim it.
      </p>

      <div className="space-y-10">
        {Object.entries(cv.skills).map(([bucket, items]) => (
          <section key={bucket}>
            <h3 className="font-display text-2xl md:text-3xl text-ink mb-4">{bucket}</h3>
            <div className="ink-rule mb-5 w-24 bg-ink-faint/40" />
            <ul className="flex flex-wrap gap-x-3 gap-y-2 list-none p-0">
              {items.map((item) => (
                <li
                  key={item}
                  className="font-mono text-sm small-caps text-ink-soft px-3 py-1 rounded-full bg-paper-shadow/60 border border-ink-faint/15"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 font-display italic text-ink-soft text-center">
        — and quietly curious about whatever's next.
      </p>

      <ul className="mt-6 flex flex-wrap justify-center gap-3 list-none p-0">
        {cv.interests.map((interest) => (
          <li
            key={interest}
            className="font-mono text-xs small-caps text-rust px-3 py-1 border border-rust/30 rounded-full"
          >
            {interest}
          </li>
        ))}
      </ul>
    </PageSpread>
  );
}
