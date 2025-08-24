import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Providers from './providers'
import ChatWidget from '@/components/ChatWidget'

const inter   = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600','700'], variable: '--font-poppins' })

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const title = 'Victorious EV Installs'
const desc  = 'Instant estimate for EV charger installation. Send photos, get transparent pricing and schedule with experienced pros.'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: desc,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: title,
    title,
    description: desc,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'EV charger installation estimate' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: desc,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  themeColor: '#208ff7',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-[var(--bg2)] text-slate-800`}>
        <Providers>
          <div className="mx-auto max-w-7xl px-4 py-8">
            {children}
          </div>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
