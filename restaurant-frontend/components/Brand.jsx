export default function Brand({ eyebrow, title, accentClass = "text-flame" }) {
  return (
    <div>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300 mb-1">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
        <span className={accentClass}>·</span> {title}
      </h1>
    </div>
  );
}
