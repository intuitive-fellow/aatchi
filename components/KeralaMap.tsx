'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Government } from '@/schemas'
import type { GeoPermissibleObjects } from 'd3-geo'

interface Props {
  year: number
  government: Government | null
  allianceColour: string
  allianceName: string
}

interface TooltipState {
  x: number
  y: number
  visible: boolean
}

// Thiruvananthapuram coordinates [lon, lat]
const CAPITAL_COORD: [number, number] = [76.9366, 8.5241]

// SVG viewport dimensions
const W = 200
const H = 500

export default function KeralaMap({ year, government, allianceColour, allianceName }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({ x: 0, y: 0, visible: false })
  const [paths, setPaths] = useState<{ d: string; district: string }[]>([])
  const [capitalPt, setCapitalPt] = useState<[number, number] | null>(null)

  const isPR = government?.type === 'presidents_rule'
  const cmName = isPR ? "President's Rule" : (government?.cm?.name ?? '—')
  const termStart = government ? new Date(government.start_date).getFullYear() : '—'
  const termEnd = government?.end_date ? new Date(government.end_date).getFullYear() : 'Present'

  // Load GeoJSON and build D3 paths once
  useEffect(() => {
    fetch('/data/maps/kerala-districts.geojson')
      .then(r => r.json())
      .then(geojson => {
        // Fit projection to our viewport with padding
        const projection = d3.geoMercator().fitExtent(
          [[8, 8], [W - 8, H - 8]],
          geojson as GeoPermissibleObjects,
        )
        const pathGen = d3.geoPath().projection(projection)

        const built = (geojson.features as GeoJSON.Feature[]).map(f => ({
          d: pathGen(f as GeoPermissibleObjects) ?? '',
          district: (f.properties as { district: string }).district,
        }))
        setPaths(built)

        const pt = projection(CAPITAL_COORD)
        if (pt) setCapitalPt(pt as [number, number])
      })
  }, [])

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full h-auto md:h-full">
      {/* Kerala · year label */}
      <div
        style={{
          position: 'absolute', top: 16, left: 20,
          fontSize: 11, color: '#999', letterSpacing: '0.05em',
          textTransform: 'uppercase', fontVariantNumeric: 'tabular-nums',
        }}
      >
        Kerala · {year}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="block max-h-[72vh] max-w-[160px] md:max-w-[240px]"
        role="img"
        aria-label={`Kerala map — ${year}, governed by ${allianceName}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
      >
        <title>Kerala governance map {year}</title>
        <desc>Kerala state map coloured by ruling alliance in {year}</desc>

        {paths.length === 0 && (
          // Loading skeleton — grey rectangle roughly shaped like Kerala
          <rect x={60} y={10} width={80} height={480} rx={8} fill="#E0E0E0" />
        )}

        {/* All district paths share the same alliance fill */}
        {paths.map(({ d, district }) => (
          <path
            key={district}
            d={d}
            fill={allianceColour}
            stroke="#FFFFFF"
            strokeWidth={0.8}
            strokeOpacity={0.4}
            style={{ transition: 'fill 200ms ease' }}
          />
        ))}

        {/* Capital dot — Thiruvananthapuram */}
        {capitalPt && (
          <>
            <circle cx={capitalPt[0]} cy={capitalPt[1]} r={4} fill="#FFFFFF" opacity={0.9} />
            <circle cx={capitalPt[0]} cy={capitalPt[1]} r={7} fill="none" stroke="#FFFFFF" strokeWidth={0.6} opacity={0.5} />
          </>
        )}
      </svg>

      {/* Hover tooltip */}
      {tooltip.visible && paths.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(tooltip.x + 16, (containerRef.current?.clientWidth ?? 400) - 190),
            top: Math.max(tooltip.y - 10, 8),
            background: '#fff',
            border: '0.5px solid #E0E0E0',
            borderRadius: 8,
            padding: '10px 12px',
            minWidth: 160,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 4 }}>
            {cmName}
          </div>
          <div
            style={{
              fontSize: 11, fontWeight: 500, color: '#fff',
              background: allianceColour, display: 'inline-block',
              padding: '2px 7px', borderRadius: 3, marginBottom: 5,
              transition: 'background 200ms ease',
            }}
          >
            {allianceName}
          </div>
          <div style={{ fontSize: 11, color: '#999', fontVariantNumeric: 'tabular-nums' }}>
            {termStart} – {termEnd}
          </div>
        </div>
      )}
    </div>
  )
}
