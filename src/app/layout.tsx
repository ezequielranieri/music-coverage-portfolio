import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue, JetBrains_Mono } from 'next/font/google'
import { BackToTop } from '@/components/feed/back-to-top'
import { PageTransition } from '@/components/shared/page-transition'
import './globals.css'

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F0F12',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio',
  },
  description: 'Blog y portafolio de coberturas de eventos',
  openGraph: {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`dark ${sans.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" href="/logo.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-surface text-text-primary font-sans antialiased">
          <PageTransition>{children}</PageTransition>
          <BackToTop />
        </body>
      </html>
  )
}
