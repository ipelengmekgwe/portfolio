import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { cv } from "@/lib/cv";

/**
 * Chapter IV — Credentials & Honours.
 * Education (Richfield BSc IT 2026–2028 leads), certifications, awards.
 */
export function ChapterCredentials() {
  return (
    <PageSpread id="chapter-4" ariaLabel="Chapter IV — Credentials and Honours">
      <ChapterHeading
        numeral="IV"
        title="Credentials & Honours"
        subtitle="Stamped, signed, and on the wall."
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <section aria-labelledby="education-heading">
          <h3
            id="education-heading"
            className="font-display text-2xl md:text-3xl text-ink mb-4"
          >
            Education
          </h3>
          <div className="ink-rule mb-6 w-24 bg-ink-faint/40" />
          <ol className="space-y-6">
            {cv.education.map((entry) => (
              <li key={`${entry.year}-${entry.institution}`}>
                <p className="font-mono text-xs small-caps text-ink-faint">
                  {entry.year}
                  {entry.status === "in-progress" ? (
                    <span className="ml-2 text-rust">· in progress</span>
                  ) : null}
                </p>
                <p className="font-display text-lg md:text-xl text-ink leading-snug mt-1">
                  {entry.credential}
                </p>
                <p className="font-display italic text-ink-soft">
                  {entry.institution}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-12">
          <section aria-labelledby="certifications-heading">
            <h3
              id="certifications-heading"
              className="font-display text-2xl md:text-3xl text-ink mb-4"
            >
              Certifications
            </h3>
            <div className="ink-rule mb-6 w-24 bg-ink-faint/40" />
            <ul className="space-y-5 list-none p-0">
              {cv.certifications.map((cert) => (
                <li key={cert.name}>
                  <p className="font-display text-lg md:text-xl text-ink leading-snug">
                    {cert.name}
                  </p>
                  <p className="font-display italic text-ink-soft">
                    Issued by {cert.issuer}
                  </p>
                  {cert.note ? (
                    <p className="text-sm text-ink-soft mt-1 leading-relaxed">
                      {cert.note}
                    </p>
                  ) : null}
                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 font-mono text-xs small-caps text-rust hover:underline decoration-gold decoration-2 underline-offset-4"
                    >
                      Verify credential ↗
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="awards-heading">
            <h3
              id="awards-heading"
              className="font-display text-2xl md:text-3xl text-ink mb-4"
            >
              Awards
            </h3>
            <div className="ink-rule mb-6 w-24 bg-ink-faint/40" />
            <ul className="space-y-6 list-none p-0">
              {cv.awards.map((award) => (
                <li key={award.title}>
                  <p className="font-mono text-xs small-caps text-ink-faint">
                    {award.year}
                    {award.status === "nominated" ? (
                      <span className="ml-2 text-rust">· nominated</span>
                    ) : null}
                    {award.status === "won" ? (
                      <span className="ml-2 text-rust">· winner</span>
                    ) : null}
                  </p>
                  <p className="font-display text-lg md:text-xl text-ink leading-snug mt-1">
                    {award.title}
                  </p>
                  <p className="text-base leading-relaxed text-ink-soft mt-2">
                    {award.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageSpread>
  );
}
