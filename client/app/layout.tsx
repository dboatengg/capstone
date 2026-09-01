import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Nav from '@/components/Nav';
import ColdStartNotice from '@/components/ColdStartNotice';
import Footer from '@/components/Footer';
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
        <AuthProvider>
          <Nav />
          {children}
          <ColdStartNotice />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}