export default function AboutPage() {
  return (
    <div className="container-pad py-12">
      <div className="max-w-3xl">
        <p className="section-label">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Lattice is a quieter way to discover software
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          We built Lattice for operators tired of noisy directories. Every listing
          emphasizes clear pricing, practical specs, and honest reviews so teams
          can decide with less friction.
        </p>
      </div>

      <section id="mission" className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Clarity first",
            text: "Consistent cards, readable metadata, and detail pages that respect attention.",
          },
          {
            title: "Built for builders",
            text: "Publish your tools, manage listings, and learn from marketplace feedback.",
          },
          {
            title: "Governed marketplace",
            text: "Admins can block accounts, manage roles, and keep the catalog trustworthy.",
          },
        ].map((item) => (
          <article key={item.title} className="panel p-6">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
