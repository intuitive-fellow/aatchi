'use client'

import { useCallback, useEffect, useRef } from 'react'

const YEAR_MIN = 1957
const YEAR_MAX = new Date().getFullYear()

const ELECTION_YEARS = [
  1957, 1960, 1965, 1967, 1970, 1977, 1980, 1982, 1987,
  1991, 1996, 2001, 2006, 2011, 2016, 2021,
]

const DESKTOP_LABELED = [1957, 1967, 1980, 1991, 2001, 2011, 2021]
const MOBILE_LABELED  = [1957, 1977, 1996, 2021]

interface Segment {
  year: number
  colour: string
}

interface Props {
  year: number
  onChange: (year: number) => void
  allianceColour: string
  trackSegments: Segment[]
}

export default function TimelineSlider({ year, onChange, allianceColour, trackSegments }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const pct = (year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)

  const yearFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    onChange(Math.round(YEAR_MIN + ratio * (YEAR_MAX - YEAR_MIN)))
  }, [onChange])

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      yearFromX(clientX)
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [yearFromX])

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Year display */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 500,
          color: '#111',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-1px',
          marginBottom: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {year}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onMouseDown={e => { dragging.current = true; yearFromX(e.clientX) }}
        onTouchStart={e => { dragging.current = true; yearFromX(e.touches[0].clientX) }}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          background: '#E0E0E0',
          position: 'relative',
          cursor: 'pointer',
          marginBottom: 10,
        }}
      >
        {/* Coloured segments to the left of thumb */}
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${pct * 100}%`,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {trackSegments.map((s, i) => (
            <div
              key={i}
              style={{ flex: '1 1 0', background: s.colour }}
            />
          ))}
        </div>

        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `${pct * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18,
            height: 18,
            background: '#fff',
            border: `2px solid ${allianceColour}`,
            borderRadius: '50%',
            transition: 'border-color 200ms ease',
            cursor: 'grab',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tick marks */}
      <div style={{ position: 'relative', height: 28, marginBottom: 4 }}>
        {ELECTION_YEARS.map(t => {
          const tp = (t - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)
          const isActive = Math.abs(t - year) < 1
          const isLabeled = DESKTOP_LABELED.includes(t)
          return (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: `${tp * 100}%`,
                transform: 'translateX(-50%)',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <div
                style={{
                  width: 3, height: 3, borderRadius: '50%',
                  background: isActive ? allianceColour : '#CCC',
                  transition: 'background 200ms ease',
                }}
              />
              {isLabeled && (
                <div
                  style={{
                    fontSize: 10,
                    color: isActive ? allianceColour : '#AAA',
                    fontWeight: isActive ? 600 : 400,
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'color 200ms ease',
                  }}
                >
                  {t}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { YEAR_MIN, YEAR_MAX, ELECTION_YEARS }
