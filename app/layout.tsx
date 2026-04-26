import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Aatchi — Kerala governance timeline',
  description:
    "India's open-source civic governance timeline. Explore Kerala's political history from 1957 to the present — every government, every cabinet.",
  keywords: ['Kerala', 'governance', 'India', 'politics', 'history', 'LDF', 'UDF', 'Chief Minister'],
  openGraph: {
    title: 'Aatchi — Kerala governance timeline',
    description: "India's open-source civic governance timeline.",
    siteName: 'Aatchi',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#FAFAFA', color: '#111' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          background: '#FAFAFA',
          minHeight: '100vh',
        }}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
