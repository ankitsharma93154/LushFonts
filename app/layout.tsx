import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cool & Aesthetic Text Generator – Copy & Paste',
  description: 'Copy & paste cool text in seconds!. Generate fancy, stylish, and aesthetic fonts for Instagram, TikTok, Twitter bios & posts.',
  keywords: [
    'fancy fonts',
    'font generator',
    'instagram fonts',
    'tiktok fonts',
    'aesthetic text',
    'Copy and paste',
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
      <head>
        <link rel="preconnect" href="https://pwxejnelixbqnuwovqvp.supabase.co" />
        <link rel="dns-prefetch" href="https://pwxejnelixbqnuwovqvp.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Add cookie consent script */}
        <Script id="cookie-consent" strategy="beforeInteractive">
          {`
            function manageCookies() {
              // Basic cookie consent implementation
              const consentKey = "lushfonts_analytics_consent";
              
              // Only set cookies if user has consented
              if (localStorage.getItem(consentKey) === "true") {
                return true;
              }
              
              // Default to not allowing cookies until consent is given
              return false;
            }
            
            window.hasAnalyticsConsent = manageCookies();
          `}
        </Script>
        
        {/* Load analytics conditionally */}
        <Script id="analytics-loader" strategy="afterInteractive">
          {`
            // Only load GA if consent is given
            if (window.hasAnalyticsConsent) {
              const script = document.createElement('script');
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-EKT0752WRY';
              script.async = true;
              document.head.appendChild(script);
              
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EKT0752WRY', {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure',
                'cookie_expires': 60 * 60 * 24 * 30  // 30 days
              });
            }
          `}
        </Script>

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