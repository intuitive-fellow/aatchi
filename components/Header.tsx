import Image from 'next/image'
import Link from 'next/link'
import ScriptStrip from './ScriptStrip'

const DARK = '#1D2B4A'
const RED  = '#C62828'

// PNG logo mark — 448×420 RGBA, transparent background
export function LogoMark({ size = 28 }: { size?: number }) {
  const height = Math.round(size * (420 / 448))
  return (
    <Image
      src="/logo-mark.png"
      alt="Aatchi logo mark"
      width={size}
      height={height}
      priority
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}

// "aatchi" wordmark — serif font, red dot floating above the second 'a'
export function Wordmark({ size = 19 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
        fontSize: size,
        fontWeight: 400,
        color: DARK,
        letterSpacing: '-0.2px',
        lineHeight: 1,
      }}
    >
      a
      <span style={{ position: 'relative' }}>
        a
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            borderRadius: '50%',
            background: RED,
            display: 'block',
          }}
        />
      </span>
      tchi
    </span>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white">
      <nav
        style={{
          height: 48,
          borderBottom: '0.5px solid #E0E0E0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Logo mark + wordmark */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <LogoMark size={36} />
          <Wordmark size={24} />
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/about" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>
            About
          </Link>
          <Link href="/about#data" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>
            Data
          </Link>
          <a
            href="https://github.com/intuitive-fellow/aatchi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              border: '0.5px solid #E0E0E0', borderRadius: 6,
              padding: '4px 10px', fontSize: 12, color: '#555',
              background: '#fff', textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>
      <ScriptStrip />
    </header>
  )
}
