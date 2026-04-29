'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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

const CAPITAL_COORD: [number, number] = [76.9366, 8.5241]

const W = 200
const H = 500

const MIN_ZOOM = 1
const MAX_ZOOM = 8

const LEGEND_ITEMS = [
  { label: 'LDF',              colour: '#C62828' },
  { label: 'UDF',              colour: '#1565C0' },
  { label: "President's Rule", colour: '#757575' },
  { label: 'Pre-alliance era', colour: '#B0BEC5' },
]

const ZOOM_BTNS = [
  { label: '+', title: 'Zoom in'   },
  { label: '⊙', title: 'Reset zoom' },
  { label: '−', title: 'Zoom out'  },
] as const

export default function KeralaMap({ year, government, allianceColour, allianceName }: Props) {
  const svgRef       = useRef<SVGSVGElement>(null)
  const gRef         = useRef<SVGGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRef      = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [tooltip, setTooltip]               = useState<TooltipState>({ x: 0, y: 0, visible: false })
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)
  const [paths, setPaths]                   = useState<{ d: string; district: string }[]>([])
  const [capitalPt, setCapitalPt]           = useState<[number, number] | null>(null)
  const [isDragging, setIsDragging]         = useState(false)

  const ready = paths.length > 0

  const glowColour = allianceColour === '#E0E0E0' ? 'rgba(0,0,0,0)' : allianceColour

  useEffect(() => {
    fetch('/data/maps/kerala-districts.geojson')
      .then(r => r.json())
      .then(geojson => {
        const projection = d3.geoMercator().fitExtent(
          [[8, 8], [W - 8, H - 8]],
          geojson as GeoPermissibleObjects,
        )
        const pathGen = d3.geoPath().projection(projection)

        setPaths(
          (geojson.features as GeoJSON.Feature[]).map(f => ({
            d:        pathGen(f as GeoPermissibleObjects) ?? '',
            district: (f.properties as { district: string }).district,
          })),
        )

        const pt = projection(CAPITAL_COORD)
        if (pt) setCapitalPt(pt as [number, number])
      })
  }, [])

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const svg = d3.select(svgRef.current)
    const g   = d3.select(gRef.current)

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', event => { g.attr('transform', event.transform.toString()) })

    svg.call(zoom)
    svg.on('dblclick.zoom', null)
    zoomRef.current = zoom

    return () => { svg.on('.zoom', null) }
  }, [])

  const zoomIn    = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select(svgRef.current).transition().duration(200).call(zoomRef.current.scaleBy, 1.6)
  }, [])

  const zoomOut   = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select(svgRef.current).transition().duration(200).call(zoomRef.current.scaleBy, 1 / 1.6)
  }, [])

  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select(svgRef.current).transition().duration(200).call(zoomRef.current.transform, d3.zoomIdentity)
  }, [])

  const zoomActions = { 'Zoom in': zoomIn, 'Reset zoom': resetZoom, 'Zoom out': zoomOut }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-auto md:h-full"
    >
      {/* KERALA · year label */}
      <div
        style={{
          position: 'absolute', top: 20, left: 20,
          display: 'flex', alignItems: 'baseline', gap: 6,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1D2B4A', letterSpacing: '0.07em' }}>
          KERALA
        </span>
        <span style={{ fontSize: 13, color: '#AAA', fontVariantNumeric: 'tabular-nums' }}>
          · {year}
        </span>
      </div>

      {/* SVG map */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="kerala-svg"
        role="img"
        aria-label={`Kerala map — ${year}, governed by ${allianceName}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setTooltip(t => ({ ...t, visible: false }))
          setHoveredDistrict(null)
        }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'block',
          overflow: 'visible',
          filter: ready
            ? `drop-shadow(0 0 18px ${glowColour}90) drop-shadow(0 0 42px ${glowColour}45)`
            : 'none',
          transition: 'filter 200ms ease',
        }}
      >
        <title>Kerala governance map {year}</title>
        <desc>Kerala state map coloured by ruling alliance in {year}</desc>

        {!ready && <rect x={60} y={10} width={80} height={480} rx={8} fill="#E0E0E0" />}

        <defs>
          {/* Clips the D3-transformed group to the viewBox — prevents zoom bleed */}
          <clipPath id="kerala-viewport">
            <rect x={0} y={0} width={W} height={H} />
          </clipPath>
        </defs>

        <g clipPath="url(#kerala-viewport)">
          <g ref={gRef}>
            {paths.map(({ d, district }) => (
              <path
                key={district}
                d={d}
                fill={allianceColour}
                stroke="#FFFFFF"
                strokeWidth={0.8}
                strokeOpacity={hoveredDistrict === district ? 0.9 : 0.4}
                opacity={hoveredDistrict && hoveredDistrict !== district ? 0.82 : 1}
                style={{ transition: 'fill 200ms ease, opacity 150ms ease' }}
                onMouseEnter={() => setHoveredDistrict(district)}
                onMouseLeave={() => setHoveredDistrict(null)}
              />
            ))}

            {capitalPt && (
              <>
                <circle cx={capitalPt[0]} cy={capitalPt[1]} r={4} fill="#FFFFFF" opacity={0.9} />
                <circle cx={capitalPt[0]} cy={capitalPt[1]} r={7} fill="none" stroke="#FFFFFF" strokeWidth={0.6} opacity={0.5} />
              </>
            )}
          </g>
        </g>
      </svg>

      {/* Zoom controls — anchored to containerRef bottom-right, not the SVG wrapper */}
      {ready && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            zIndex: 3,
          }}
        >
          {ZOOM_BTNS.map(btn => (
            <button
              key={btn.title}
              onClick={zoomActions[btn.title]}
              aria-label={btn.title}
              title={btn.title}
              style={{
                width: 26, height: 26,
                border: '0.5px solid #E0E0E0',
                borderRadius: 6,
                background: '#FFFFFF',
                color: '#555',
                fontSize: btn.label === '⊙' ? 13 : 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                padding: 0,
                userSelect: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Legend — bottom left, anchored to containerRef */}
      {ready && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            background: '#fff',
            border: '0.5px solid #E8E8E8',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            zIndex: 2,
          }}
        >
          {LEGEND_ITEMS.map(({ label, colour }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#555' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 2, background: colour, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Hover tooltip — district name only */}
      {tooltip.visible && ready && hoveredDistrict && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(tooltip.x + 14, (containerRef.current?.clientWidth ?? 400) - 140),
            top: Math.max(tooltip.y - 10, 8),
            background: 'rgba(18, 18, 28, 0.88)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 7,
            padding: '6px 11px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '-0.1px', whiteSpace: 'nowrap' }}>
            {hoveredDistrict}
          </span>
        </div>
      )}
    </div>
  )
}
