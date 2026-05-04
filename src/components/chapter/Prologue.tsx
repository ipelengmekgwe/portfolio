import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { cv } from "@/lib/cv";

/**
 * Prologue — the unnumbered opening chapter. First-person introduction
 * adapted from the CV summary, plus the table of contents on the facing page.
 */
export function Prologue() {
  return (
    <PageSpread id="prologue" ariaLabel="Prologue">
      <ChapterHeading
        eyebrow="Prologue"
        title="Hello — I'm Ipeleng."
        subtitle="A short introduction, before the chapters begin."
      />

      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="chapter-prose space-y-5 text-lg leading-relaxed">
          <p>
            I'm a Software Engineering Lead based in Cape Town. For the past decade I've been
            quietly stitching together fintech ledgers, marketing platforms, courier systems, and
            retail back-offices — mostly in C# and SQL, with whichever front end the job called for.
          </p>
          <p>
            Today I lead a team at FinChoice, where I'm equal parts engineer, mentor, and translator
            between business problems and technical solutions. I'm also studying part-time toward a
            BSc in Information Technology — because there's always more to learn, and I like the
            discipline of doing it on paper as well as on the keyboard.
          </p>
          <p>
            This site is the longer version of my CV. Five chapters, no recruiter dust. Read in
            order, or skip ahead from the table of contents.
          </p>
        </div>

        <aside className="md:border-l md:border-ink-faint/30 md:pl-12">
          <p className="font-mono text-xs small-caps text-ink-faint mb-6">Table of contents</p>
          <ol className="space-y-4">
            {TOC.map((entry) => (
              <li key={entry.id} className="flex items-baseline justify-between gap-4">
                <a
                  href={`#${entry.id}`}
                  className="group flex items-baseline gap-3 hover:text-rust transition-colors"
                >
                  <span className="font-display text-sm text-ink-faint w-6">
                    {entry.numeral ?? "·"}
                  </span>
                  <span className="font-display text-lg leading-tight group-hover:underline decoration-gold decoration-2 underline-offset-4">
                    {entry.title}
                  </span>
                </a>
                <span
                  className="hidden md:block flex-1 border-b border-dotted border-ink-faint/40 mx-2 translate-y-[-3px]"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs text-ink-faint">{entry.page}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 font-mono text-[0.7rem] text-ink-faint space-y-1">
            <p>
              <span className="small-caps">Author</span> · {cv.person.name}
            </p>
            <p>
              <span className="small-caps">Edition</span> · I · {new Date().getFullYear()}
            </p>
            <p>
              <span className="small-caps">Set in</span> · Fraunces &amp; Garamond
            </p>
          </div>
        </aside>
      </div>
    </PageSpread>
  );
}

const TOC = [
  { id: "chapter-1", numeral: "I", title: "How We Got Here", page: "01" },
  { id: "chapter-2", numeral: "II", title: "The Toolkit", page: "02" },
  { id: "chapter-3", numeral: "III", title: "Selected Works", page: "03" },
  { id: "chapter-4", numeral: "IV", title: "Credentials & Honours", page: "04" },
  { id: "epilogue", numeral: undefined, title: "Epilogue", page: "—" },
];
