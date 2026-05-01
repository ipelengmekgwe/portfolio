"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type BookmarkLink = {
  id: string;
  label: string;
  numeral?: string;
};

const LINKS: BookmarkLink[] = [
  { id: "prologue", label: "Prologue" },
  { id: "chapter-1", label: "How We Got Here", numeral: "I" },
  { id: "chapter-2", label: "The Toolkit", numeral: "II" },
  { id: "chapter-3", label: "Selected Works", numeral: "III" },
  { id: "chapter-4", label: "Credentials & Honours", numeral: "IV" },
  { id: "epilogue", label: "Epilogue" },
];

/**
 * Sticky vertical bookmark on the right edge — shows current chapter and
 * lets the reader jump between them. Hidden on small screens to preserve
 * the page-as-reading-surface feel.
 */
export function Bookmark() {
  const [activeId, setActiveId] = useState<string>("prologue");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      // The chapter is "active" when its top is in the upper third of the viewport.
      { rootMargin: "-30% 0% -60% 0%", threshold: 0 },
    );

    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Table of contents"
      className="hidden lg:flex fixed top-1/2 right-6 -translate-y-1/2 z-30 flex-col gap-3"
    >
      {LINKS.map((link) => {
        const isActive = activeId === link.id;
        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={cn(
              "group flex items-center justify-end gap-3 font-mono text-xs uppercase tracking-widest transition-colors",
              isActive ? "text-rust" : "text-ink-faint hover:text-ink-soft",
            )}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity small-caps text-[0.7rem]">
              {link.label}
            </span>
            <span
              className={cn(
                "inline-block transition-all",
                isActive
                  ? "h-px w-10 bg-rust"
                  : "h-px w-5 bg-ink-faint group-hover:w-8",
              )}
              aria-hidden="true"
            />
            <span className="font-display text-sm w-5 text-right">
              {link.numeral ?? "·"}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
