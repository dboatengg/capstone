import Link from 'next/link';
import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${plexSans.variable} font-sans`}>
        <header className="border-b border-[var(--color-stone-line)] bg-white">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl text-[var(--color-ink)]">
              Capstone
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-[var(--color-ink)]/70 hover:text-[var(--color-forest)] transition-colors"
            >
              Properties
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}