import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LushFonts | Cool & Aesthetic Text Generator for Social Media',
  description: 'Generate fancy, stylish, and aesthetic fonts for Instagram, TikTok, Twitter bios & posts. Copy & paste cool text in seconds!',
  keywords: [
    'fancy fonts',
    'font generator',
    'instagram fonts',
    'tiktok fonts',
    'aesthetic text',
    'social media fonts',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://www.lushfonts.site'),
  openGraph: {
    title: 'LushFonts | Cool & Aesthetic Text Generator',
    description: 'Generate fancy fonts for Instagram, TikTok, Twitter bios & posts. Copy & paste cool text in seconds!',
    url: 'https://www.lushfonts.site',
    siteName: 'LushFonts',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LushFonts OG Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LushFonts | Cool & Aesthetic Text Generator',
    description: 'Generate stylish fonts for Instagram, TikTok, Twitter bios & posts. Copy & paste in 1 click!',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'P1agJpKdlCXnnX75eeU2mqPvIghhBRzRHSV1SG5SjME',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <link rel="preconnect" href="https://pwxejnelixbqnuwovqvp.supabase.co" />
    <link rel="dns-prefetch" href="https://pwxejnelixbqnuwovqvp.supabase.co" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EKT0752WRY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EKT0752WRY');
          `}
        </Script>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}