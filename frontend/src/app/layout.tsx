import type { Metadata } from 'next'
import { Inter, Space_Grotesk, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'

// Body text, headings (brand display face), and Arabic script
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' })
const display = Space_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-display', display: 'swap' })
const arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], variable: '--font-arabic', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://hilyoon.com'),
  title: 'Hilyoon - AI-Powered SaaS Solutions',
  description: 'Revolutionize your business with AI-powered automation and intelligent solutions.',
  keywords: 'AI, SaaS, automation, business solutions, artificial intelligence',
  authors: [{ name: 'Hilyoon Team' }],
  openGraph: {
    title: 'Hilyoon - AI-Powered SaaS Solutions',
    description: 'Revolutionize your business with AI-powered automation and intelligent solutions.',
    url: 'https://hilyoon.com',
    siteName: 'Hilyoon',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hilyoon - AI-Powered SaaS Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hilyoon - AI-Powered SaaS Solutions',
    description: 'Revolutionize your business with AI-powered automation and intelligent solutions.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`dark ${inter.variable} ${display.variable} ${arabic.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
