import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aesthetic Font Generator Keyboard | Copy and Paste Text Styles',
  description: 'Type with your normal keyboard and instantly convert text into aesthetic fonts. Copy and paste styles for Instagram bios, TikTok captions, Discord names, and more.',
  keywords: [
    'aesthetic font generator keyboard',
    'cool aesthetic fonts',
    'aesthetic text layout',
    'aesthetic text styles',
    'aesthetic fonts for keyboard',
    'aesthetic text templates',
    'font generator',
    'instagram fonts',
    'tiktok fonts',
    'aesthetic text copy and paste',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://www.lushfonts.site'),
  openGraph: {
    title: 'Aesthetic Font Generator Keyboard | LushFonts',
    description: 'Generate cool aesthetic fonts, layouts, and text styles in one click. Copy and paste keyboard-friendly text for social apps.',
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
    title: 'Aesthetic Font Generator Keyboard | LushFonts',
    description: 'Copy and paste aesthetic text styles instantly. Keyboard-friendly fonts for bios, usernames, captions, and messages.',
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
      <head>
        {/* Preconnects */}
        <link rel="preconnect" href="https://pwxejnelixbqnuwovqvp.supabase.co" />
        <link rel="dns-prefetch" href="https://pwxejnelixbqnuwovqvp.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Inline critical CSS to improve first render */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}
          html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif}
          body{margin:0;line-height:inherit}
          :root{
            --background:0 0% 100%;
            --foreground:0 0% 0%;
            --card:0 0% 100%;
            --card-foreground:0 0% 0%;
            --primary:0 0% 0%;
            --primary-foreground:0 0% 100%;
          }
          body{background-color:hsl(var(--background));color:hsl(var(--foreground))}
        `}} />

        {/* Load render-blocking CSS non-blocking */}
       <link rel="stylesheet" href="https://www.lushfonts.site/_next/static/css/ce4ba38624950d33.css" />

        <noscript>
          <link
            rel="stylesheet"
            href="https://www.lushfonts.site/_next/static/css/ce4ba38624950d33.css"
          />
        </noscript>

        {/* Fallback if preload fails */}
        <Script id="non-blocking-css-loader" strategy="afterInteractive">
          {`
            (function() {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://www.lushfonts.site/_next/static/css/ce4ba38624950d33.css';
              link.media = 'print';
              link.onload = function() {
                link.media = 'all';
              };
              document.head.appendChild(link);
            })();
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <Script id="website-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LushFonts",
            "url": "https://lushfonts.site",
            "description":
              "Get stylish, aesthetic, and cool fonts for Instagram & more — 100% free at LushFonts. Copy and paste your favorite text styles in seconds.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://lushfonts.site/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>

        <Script id="software-app-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LushFonts Aesthetic Text Generator",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Web",
            "url": "https://lushfonts.site",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
            },
            "description": "Keyboard-friendly aesthetic font generator with instant copy and paste text styles, layouts, and templates.",
            "featureList": [
              "Aesthetic font generator keyboard workflow",
              "One-click copy and paste text",
              "Aesthetic text layouts and templates",
              "Unicode style library for social platforms"
            ]
          })}
        </Script>
      </head>
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
