import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-[var(--color-paper)]">
      <main className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-medium uppercase tracking-wide text-[var(--color-forest)] mb-4">
            Accra · Kumasi
          </span>

          <h1 className="font-display text-5xl sm:text-6xl leading-[1.1] text-[var(--color-ink)]">
            Find your next home, wherever you&apos;re rooted.
          </h1>

          <p className="text-lg text-[var(--color-ink)]/70 mt-6 leading-relaxed max-w-lg">
            Capstone connects you directly with trusted agents across Ghana.
            Browse verified listings for rent or sale. No Middlemen.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[var(--color-forest)] text-white text-sm font-medium px-6 py-3 hover:bg-[var(--color-ink)] transition-colors"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 96% 100%, 0 100%)' }}
            >
              Browse properties →
            </Link>
          </div>
        </div>

        {/* Signature strip — echoes the price badge motif from the cards, used here as pure texture */}
        <div className="flex gap-1.5 mt-24">
          <div className="h-1.5 w-16 bg-[var(--color-forest)]" />
          <div className="h-1.5 w-16 bg-[var(--color-brass)]" />
          <div className="h-1.5 w-16 bg-[var(--color-clay)]" />
        </div>
      </main>
    </div>
  );
}