import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">

        <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-ink)] mb-4">
          Page not found
        </h1>

        <p className="text-[var(--color-ink)]/60 max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist, may have been moved, or the link might be incorrect.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--color-forest)] text-white text-sm font-medium px-6 py-3 hover:bg-[var(--color-ink)] transition-colors"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 96% 100%, 0 100%)' }}
          >
            Go home
          </Link>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-[var(--color-ink)]/20 text-[var(--color-ink)] text-sm font-medium px-6 py-3 hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] transition-colors"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </div>
  );
}