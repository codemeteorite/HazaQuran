// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Amiri, Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import GlobalAudioEngine from '@/components/GlobalAudioEngine';
import AudioPlayer from '@/components/AudioPlayer';

const inter = Inter({ subsets: ['latin'] });

// Arabic font setup - THIS IS CRITICAL
const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'HazaQuran - Premium Quran Experience',
  description: 'Read, listen, and reflect upon the Noble Quran',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.className} ${amiri.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload Arabic fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@200;300;400;600;700&display=swap" rel="stylesheet" />

        {/* Uthmani font for Quran text */}
        <link href="https://fonts.maateen.me/alkatib/alkatib-2.css" rel="stylesheet" />

        {/* Font Awesome for icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 min-h-screen">
        <Providers>
          <div className="relative">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
              <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10">
              {children}
            </main>

            <GlobalAudioEngine />
            <AudioPlayer />
          </div>
        </Providers>
      </body>
    </html>
  );
}