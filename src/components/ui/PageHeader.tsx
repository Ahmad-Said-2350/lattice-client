interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </header>
  );
}
