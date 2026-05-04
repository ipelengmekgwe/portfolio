"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

/**
 * Closed-book hero. As the user scrolls the first viewport, the front cover
 * rotates open along its left edge (Y axis) and fades. By 60% scroll progress
 * the cover is fully open and the book transitions seamlessly into the
 * Prologue spread below.
 *
 * Respects prefers-reduced-motion: when reduced, we skip the rotation and
 * just fade the cover out.
 */
export function Cover() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.6], [0, -180]);
  const coverOpacity = useTransform(scrollYProgress, [0.4, 0.7], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Cover"
      className="relative h-[180vh]"
      style={{ perspective: "2200px" }}
    >
      {/* Sticky stage. Flex column lets the hint sit naturally below the
          book with explicit gap, so it never crowds the cover edge. */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-12 md:gap-16 px-6 py-10">
        <div
          className="relative w-[min(78vw,380px)] aspect-[3/4]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Inner pages — visible as the cover swings open */}
          <div
            className="absolute inset-0 paper-page flex flex-col items-center justify-center text-center px-8"
            aria-hidden="true"
          >
            <p className="font-mono text-[0.65rem] small-caps text-ink-faint mb-3">
              Mekgwe &amp; Co.
            </p>
            <p className="font-display italic text-base text-ink-soft">Volume I</p>
          </div>

          {/* The cover itself — pivots from its left edge */}
          <motion.div
            style={
              reduced
                ? { opacity: coverOpacity }
                : {
                    rotateY,
                    opacity: coverOpacity,
                    transformOrigin: "left center",
                    backfaceVisibility: "hidden",
                  }
            }
            className="absolute inset-0 rounded-page shadow-deep"
          >
            <CoverArt />
          </motion.div>
        </div>

        <motion.div style={{ opacity: reduced ? 1 : hintOpacity }} className="text-center shrink-0">
          <p className="font-mono text-xs small-caps text-ink-faint mb-2">Scroll to open</p>
          <ArrowDown aria-hidden="true" className="mx-auto size-4 text-ink-faint animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * The closed front cover artwork — ivory paper, gold rule frames, rust title.
 */
function CoverArt() {
  return (
    <div
      className="absolute inset-0 rounded-page flex flex-col items-center justify-between px-8 py-12 text-center"
      style={{
        background:
          "linear-gradient(160deg, var(--color-paper) 0%, var(--color-paper-shadow) 100%)",
        boxShadow: "inset 0 0 0 1px oklch(0.8 0.04 75 / 0.4)",
      }}
    >
      <div className="w-full">
        <div className="ink-rule mb-2 bg-gold" />
        <p className="font-mono text-[0.65rem] tracking-[0.4em] uppercase text-ink-faint">
          Volume I
        </p>
        <div className="ink-rule mt-2 bg-gold" />
      </div>

      <div>
        <h1 className="font-display text-[clamp(2.25rem,7vw,3.5rem)] leading-[0.95] text-rust mb-4">
          Ipeleng
          <br />
          Mekgwe
        </h1>
        <p className="font-display italic text-lg text-ink-soft">
          A portfolio in
          <br />
          five chapters
        </p>
      </div>

      <div className="w-full">
        <div className="ink-rule mb-2 bg-gold" />
        <p className="font-mono text-[0.65rem] tracking-[0.4em] uppercase text-ink-faint">
          Cape Town · Est. 2016
        </p>
      </div>
    </div>
  );
}
