import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";

import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { ContactForm } from "@/components/chapter/ContactForm";
import { cv } from "@/lib/cv";

/**
 * Epilogue — the back cover. Two halves: a working contact form on the left,
 * direct-link sidebar + downloadable CV on the right. Footer carries the
 * colophon.
 */
export function Epilogue() {
  return (
    <PageSpread id="epilogue" ariaLabel="Epilogue">
      <ChapterHeading
        eyebrow="Epilogue"
        title="Stay in touch."
        subtitle="The back cover — drop a line, take the CV."
      />

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-start">
        <section aria-labelledby="contact-heading">
          <h3 id="contact-heading" className="font-display text-2xl md:text-3xl text-ink mb-4">
            Send a message
          </h3>
          <div className="ink-rule mb-6 w-24 bg-ink-faint/40" />
          <ContactForm />
        </section>

        <aside className="space-y-10">
          <div>
            <p className="font-mono text-xs small-caps text-ink-faint mb-4">Or reach me directly</p>
            <ul className="space-y-3 list-none p-0">
              <li>
                <a
                  href={`mailto:${cv.person.email}`}
                  className="flex items-center gap-3 hover:text-rust transition-colors"
                >
                  <Mail aria-hidden="true" className="size-4" />
                  <span className="font-display text-lg">{cv.person.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={cv.person.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-rust transition-colors"
                >
                  <Github aria-hidden="true" className="size-4" />
                  <span className="font-display text-lg">github.com/ipelengmekgwe</span>
                </a>
              </li>
              <li>
                <a
                  href={cv.person.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-rust transition-colors"
                >
                  <Linkedin aria-hidden="true" className="size-4" />
                  <span className="font-display text-lg">LinkedIn — Ipeleng Mekgwe</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-ink-soft">
                <MapPin aria-hidden="true" className="size-4" />
                <span className="font-display text-lg">{cv.person.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs small-caps text-ink-faint mb-4">The traditional CV</p>
            <a
              href="/cv"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-page border border-ink-faint/30 hover:border-rust hover:text-rust transition-colors font-display text-lg"
            >
              <Download aria-hidden="true" className="size-4" />
              Download CV (PDF)
            </a>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              Generated from <code className="font-mono text-xs">content/cv.json</code> at build
              time — always matches what you see in the chapters.
            </p>
          </div>
        </aside>
      </div>

      <footer className="mt-16 pt-8 border-t border-ink-faint/20 font-mono text-[0.7rem] small-caps text-ink-faint text-center space-y-1">
        <p>Set in Fraunces &amp; EB Garamond · Built with Next.js 15 · Deployed on Vercel</p>
        <p>
          Apps &amp; games:{" "}
          <a
            href="https://ipeleng.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-rust transition-colors"
          >
            ipeleng.dev
          </a>
        </p>
        <p>
          © {new Date().getFullYear()} {cv.person.name} · All rights reserved
        </p>
      </footer>
    </PageSpread>
  );
}
