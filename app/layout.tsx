import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://avanceinsights.in'),
  title: {
    default: 'Avance Insights | Market Research & Brand Solutions',
    template: '%s | Avance Insights',
  },
  description: 'One-stop research and brand solutions agency delivering actionable insights through market research, social research, and data-driven strategies.',
  keywords: ['market research', 'brand solutions', 'data analytics', 'consumer insights', 'social research', 'Delhi', 'India'],
  authors: [{ name: 'Avance Insights' }],
  creator: 'Avance Insights',
  publisher: 'Avance Insights',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://avanceinsights.in',
    siteName: 'Avance Insights',
    title: 'Avance Insights | Market Research & Brand Solutions',
    description: 'One-stop research and brand solutions agency delivering actionable insights.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Avance Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avance Insights | Market Research & Brand Solutions',
    description: 'One-stop research and brand solutions agency delivering actionable insights.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Avance Insights',
              url: 'https://avanceinsights.in',
              logo: 'https://avanceinsights.in/logo.png',
              description: 'One-stop research and brand solutions agency',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'New Delhi',
                addressLocality: 'Delhi',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-XXXXXXXXXX',
                contactType: 'customer service',
              },
              sameAs: [
                'https://www.linkedin.com/company/avance-insights',
                'https://twitter.com/avanceinsights',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
