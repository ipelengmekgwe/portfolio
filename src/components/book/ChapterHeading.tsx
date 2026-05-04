type ChapterHeadingProps = {
  numeral?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

/**
 * The title block at the top of a chapter — Roman numeral / eyebrow on top,
 * large rust serif heading, optional italic subtitle, gold ink rule beneath.
 */
export function ChapterHeading({ numeral, eyebrow, title, subtitle }: ChapterHeadingProps) {
  const label = numeral ? `Chapter ${numeral}` : eyebrow;

  return (
    <header className="text-center mb-12">
      {label ? <p className="font-mono text-xs small-caps text-ink-faint mb-3">{label}</p> : null}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-rust leading-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="font-display italic text-lg md:text-xl text-ink-soft mt-3">{subtitle}</p>
      ) : null}
      <div className="ink-rule w-1/3 mx-auto mt-6 bg-gold" />
    </header>
  );
}
