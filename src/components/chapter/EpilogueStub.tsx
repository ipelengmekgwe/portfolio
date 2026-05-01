import { Github, Linkedin, Mail, MapPin } from "lucide-react";

import { ChapterHeading } from "@/components/book/ChapterHeading";
import { PageSpread } from "@/components/book/PageSpread";
import { cv } from "@/lib/cv";

/**
 * Epilogue — back cover / colophon (placeholder).
 * The full contact form + CV download arrives in Task #6. Until then the
 * direct links are usable.
 */
export function EpilogueStub() {
  return (
    <PageSpread id="epilogue" ariaLabel="Epilogue">
      <ChapterHeading
        eyebrow="Epilogue"
        title="Stay in touch."
        subtitle="The back cover — and where to write to."
      />

      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="chapter-prose space-y-5 text-lg leading-relaxed">
          <p>
            Thanks for making it to the back cover. If anything in here landed
            for you — a role you're thinking about, a system you're stuck on,
            a coffee in Cape Town — I'd love to hear about it.
          </p>
          <p>
            A proper contact form is on its way. For now, the direct links
            on the right work the same.
          </p>
        </div>

        <aside>
          <p className="font-mono text-xs small-caps text-ink-faint mb-6">
            How to reach me
          </p>

          <ul className="space-y-4 list-none p-0">
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
                <span className="font-display text-lg">{prettyUrl(cv.person.links.github)}</span>
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
        </aside>
      </div>

      <footer className="mt-16 pt-8 border-t border-ink-faint/20 font-mono text-[0.7rem] small-caps text-ink-faint text-center space-y-1">
        <p>
          Set in Fraunces &amp; EB Garamond · Built with Next.js 15 ·
          Deployed on Vercel
        </p>
        <p>
          © {new Date().getFullYear()} {cv.person.name} · All rights reserved
        </p>
      </footer>
    </PageSpread>
  );
}

/** Strip protocol + trailing slash so a URL reads cleanly under an icon. */
function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
