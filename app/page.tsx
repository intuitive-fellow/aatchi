'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import TimelineSlider, { YEAR_MIN, YEAR_MAX } from '@/components/TimelineSlider'
import GovernmentCard from '@/components/GovernmentCard'
import CabinetPanel from '@/components/CabinetPanel'
import PartyLegend from '@/components/PartyLegend'
import {
  getGovernmentForYear,
  getCabinetForGovernment,
  getAllianceColour,
  getAlliances,
  getAllParties,
  getColourForYear,
} from '@/lib/data'
import MapBackground from '@/components/MapBackground'

const KeralaMap = dynamic(() => import('@/components/KeralaMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: 180,
        height: 420,
        background: '#E0E0E0',
        borderRadius: 8,
        opacity: 0.5,
      }}
    />
  ),
})

const alliances = getAlliances()
const parties = getAllParties()

const trackSegments = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => ({
  year: YEAR_MIN + i,
  colour: getColourForYear(YEAR_MIN + i, 'KL'),
}))

export default function Home() {
  const [year, setYear] = useState(2021)
  const [cabinetOpen, setCabinetOpen] = useState(false)

  const government = useMemo(() => getGovernmentForYear(year, 'KL'), [year])
  const cabinet = useMemo(
    () => (government ? getCabinetForGovernment(government.id) : null),
    [government],
  )
  const allianceColour = useMemo(
    () => (government ? getAllianceColour(government, parties, alliances) : '#E0E0E0'),
    [government],
  )
  const allianceName = useMemo(() => {
    if (!government) return '—'
    if (government.type === 'presidents_rule') return "President's Rule"
    if (government.ruling_alliance_id === 'NONE') return 'Pre-alliance'
    return alliances.find(a => a.id === government.ruling_alliance_id)?.short_name ?? '—'
  }, [government])

  return (
    <>
      {/* Desktop two-column layout */}
      <main
        className="hidden md:grid"
        style={{
          gridTemplateColumns: '1fr 1fr',
          height: 'calc(100vh - 96px)',
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
          borderLeft: '0.5px solid #E0E0E0',
          borderRight: '0.5px solid #E0E0E0',
        }}
      >
        {/* Left — map */}
        <div
          style={{
            background: '#FAFAFA',
            borderRight: '0.5px solid #E0E0E0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            overflow: 'visible',
          }}
        >
          <MapBackground />
          <KeralaMap
            year={year}
            government={government}
            allianceColour={allianceColour}
            allianceName={allianceName}
          />
        </div>

        {/* Right — slider + card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 24,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {/* Fixed top section — never scrolls away */}
          <div style={{ flexShrink: 0 }}>
            <TimelineSlider
              year={year}
              onChange={setYear}
              allianceColour={allianceColour}
              trackSegments={trackSegments}
            />
            <PartyLegend />
            <div style={{ marginBottom: 20 }} />
          </div>

          {/* Card fills remaining height; button is always visible at its bottom */}
          {government && (
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <GovernmentCard
                government={government}
                allianceColour={allianceColour}
                allianceName={allianceName}
                parties={parties}
                hasCabinet={cabinet !== null}
                onOpenCabinet={() => setCabinetOpen(true)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile stacked layout */}
      <main className="md:hidden" style={{ maxWidth: 1440, width: '100%', margin: '0 auto' }}>
        <div
          style={{
            background: '#FAFAFA',
            borderBottom: '0.5px solid #E0E0E0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            padding: '12px 16px 16px',
          }}
        >
          <MapBackground />
          <div
            style={{
              position: 'absolute', top: 12, left: 14,
              background: '#111', color: '#fff', fontSize: 11,
              fontFamily: 'ui-monospace, monospace',
              padding: '3px 8px', borderRadius: 4, letterSpacing: '1px',
            }}
          >
            {year}
          </div>
          <div
            style={{
              position: 'absolute', top: 12, right: 14,
              fontSize: 11, color: '#999',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}
          >
            
          </div>
          <KeralaMap
            year={year}
            government={government}
            allianceColour={allianceColour}
            allianceName={allianceName}
          />
        </div>

        <div style={{ padding: 16, background: '#fff', borderBottom: '0.5px solid #F0F0F0' }}>
          <TimelineSlider
            year={year}
            onChange={setYear}
            allianceColour={allianceColour}
            trackSegments={trackSegments}
          />
          <PartyLegend />
        </div>

        <div style={{ padding: 16, background: '#fff' }}>
          {government && (
            <GovernmentCard
              government={government}
              allianceColour={allianceColour}
              allianceName={allianceName}
              parties={parties}
              hasCabinet={cabinet !== null}
              onOpenCabinet={() => setCabinetOpen(true)}
            />
          )}
        </div>
      </main>

      <CabinetPanel
        open={cabinetOpen}
        onClose={() => setCabinetOpen(false)}
        government={government}
        cabinet={cabinet}
        allianceColour={allianceColour}
        allianceName={allianceName}
        parties={parties}
      />
    </>
  )
}
