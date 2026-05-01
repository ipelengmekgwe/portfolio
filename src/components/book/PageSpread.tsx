import { cn } from "@/lib/cn";

type PageSpreadProps = {
  id: string;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * A "page spread" — the visible double-page that each chapter occupies.
 * Renders as a single ivory paper-page on small screens and a wider, deeper
 * spread on large screens. Provides the consistent vertical rhythm and
 * scroll anchor for in-page navigation.
 */
export function PageSpread({ id, ariaLabel, className, children }: PageSpreadProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className="relative z-10 px-6 py-16 md:py-24 scroll-mt-12"
    >
      <article
        className={cn(
          "paper-page mx-auto w-full max-w-4xl px-6 py-12 md:px-16 md:py-20",
          className,
        )}
      >
        {children}
      </article>
    </section>
  );
}
