import Link from "next/link";

export default function Footer() {
    return (
      <footer className="border-t border-[var(--color-stone-line)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="https://dicksonboateng.com" target="_blank" className="text-center text-xs text-[var(--color-ink)]/50">
            Built with much love by{' '}
            <span className="font-medium text-[var(--color-ink)]/70">
              Dickson Boateng
            </span>
            {' '}· {new Date().getFullYear()}
          </Link>
        </div>
      </footer>
    );
  }