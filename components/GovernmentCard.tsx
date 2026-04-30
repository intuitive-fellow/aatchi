import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Government, Party } from '@/schemas'
import { formatDate, formatDuration, getActiveCmForYear } from '@/lib/data'

interface Props {
  government: Government
  year: number
  allianceColour: string
  allianceName: string
  parties: Party[]
  hasCabinet: boolean
  onOpenCabinet: () => void
}

// ─── Inline SVG icons ────────────────────────────────────────────────────────

function IconCalendar() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x={1} y={2} width={11} height={10} rx={1.5} stroke="#BBB" strokeWidth={1} />
      <line x1={4} y1={1} x2={4} y2={4} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
      <line x1={9} y1={1} x2={9} y2={4} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
      <line x1={1} y1={6} x2={12} y2={6} stroke="#BBB" strokeWidth={1} />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx={6.5} cy={6.5} r={5.5} stroke="#BBB" strokeWidth={1} />
      <line x1={6.5} y1={3.5} x2={6.5} y2={6.5} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
      <line x1={6.5} y1={6.5} x2={9} y2={8.5} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
    </svg>
  )
}

function IconBallot() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x={1.5} y={1.5} width={10} height={10} rx={1.5} stroke="#BBB" strokeWidth={1} />
      <line x1={4} y1={5} x2={9} y2={5} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
      <line x1={4} y1={7.5} x2={9} y2={7.5} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
    </svg>
  )
}

function IconGovt() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <line x1={1.5} y1={10.5} x2={11.5} y2={10.5} stroke="#BBB" strokeWidth={1} strokeLinecap="round" />
      <line x1={3} y1={5} x2={3} y2={10.5} stroke="#BBB" strokeWidth={1} />
      <line x1={6.5} y1={5} x2={6.5} y2={10.5} stroke="#BBB" strokeWidth={1} />
      <line x1={10} y1={5} x2={10} y2={10.5} stroke="#BBB" strokeWidth={1} />
      <polyline points="1,5 6.5,2 12,5" stroke="#BBB" strokeWidth={1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
      <circle cx={6} cy={4} r={2.5} stroke="#555" strokeWidth={1.2} />
      <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#555" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={12} cy={4} r={2} stroke="#888" strokeWidth={1} />
      <path d="M15 13c0-2.21-1.34-4.1-3.2-4.77" stroke="#888" strokeWidth={1} strokeLinecap="round" />
    </svg>
  )
}

// ─── MetaCell ────────────────────────────────────────────────────────────────

function MetaCell({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        {icon}
        <span
          style={{
            fontSize: 10.5, fontWeight: 500, color: '#AAA',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>
        {value}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: '0.5px', background: '#F0F0F0', margin: '16px 0' }} />
}

function CoalitionChip({ shortName, fullName, color }: {
  shortName: string
  fullName: string
  color: string
}) {
  const [hovered, setHovered] = useState(false)
  const hasTooltip = fullName !== shortName

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip — appears above the chip */}
      {hovered && hasTooltip && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            border: '0.5px solid #E0E0E0',
            borderRadius: 6,
            padding: '5px 10px',
            whiteSpace: 'nowrap',
            zIndex: 20,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#222' }}>{fullName}</span>
        </span>
      )}

      {/* Chip */}
      <span
        style={{
          fontSize: 11, fontWeight: 500,
          color: hovered ? '#111' : '#444',
          background: hovered ? '#EFEFEF' : '#F5F5F5',
          border: `0.5px solid ${hovered ? '#D8D8D8' : '#E8E8E8'}`,
          borderRadius: 4, padding: '4px 9px',
          cursor: 'default',
          display: 'inline-block',
          transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
        }}
      >
        {shortName}
      </span>
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function GovernmentCard({
  government,
  year,
  allianceColour,
  allianceName,
  parties,
  hasCabinet,
  onOpenCabinet,
}: Props) {
  const isPR = government.type === 'presidents_rule'

  // ── President's Rule ──────────────────────────────────────────────────────
  if (isPR) {
    return (
      <div
        style={{
          border: '0.5px solid #E8E8E8', borderRadius: 12, overflow: 'hidden',
        }}
      >
        <div style={{ background: '#F5F5F5', padding: '16px 20px', borderBottom: '0.5px solid #E8E8E8', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#757575', flexShrink: 0 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>President's Rule</div>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#fff', background: '#757575', padding: '3px 9px', borderRadius: 4, display: 'inline-block', marginBottom: 14 }}>
            Article 356 · Central rule
          </div>
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 18 }}>
            Central government administration. The state legislature was suspended and the state was governed directly by the Governor on behalf of the President.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <MetaCell icon={<IconCalendar />} label="From"     value={formatDate(government.start_date)} />
            <MetaCell icon={<IconCalendar />} label="To"       value={formatDate(government.end_date)} />
            <MetaCell icon={<IconClock />}    label="Duration" value={formatDuration(government.start_date, government.end_date)} />
            <MetaCell icon={<IconGovt />}     label="Article"  value="356 — Constitution" />
          </div>
          <div style={{ border: '0.5px dashed #E0E0E0', borderRadius: 8, padding: 14, textAlign: 'center', color: '#CCC', fontSize: 12 }}>
            No cabinet — central rule in effect
          </div>
        </div>
      </div>
    )
  }

  // ── Elected government ────────────────────────────────────────────────────

  const totalSeats = government.total_seats ?? 140
  const seatsWon   = government.seats_won   ?? 0

  const seatBlocks = useMemo(() =>
    Array.from({ length: totalSeats }, (_, i) => i < seatsWon),
    [totalSeats, seatsWon],
  )

  const coalitionParties = government.coalition_partners.map(id => {
    const p = parties.find(p => p.id === id)
    return { id, shortName: p?.short_name ?? id, fullName: p?.name ?? id, color: p?.color ?? '#999' }
  })

  const active = useMemo(
    () => getActiveCmForYear(government, year),
    [government, year],
  )

  const hasMidTermChange = (government.cm_changes?.length ?? 0) > 1

  return (
    <div style={{ border: '0.5px solid #E8E8E8', borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', minHeight: 0 }}>

        {/* Dismissed banner */}
        {government.dismissed && government.dismissal_reason && (
          <div
            style={{
              background: '#FFFBEB', border: '0.5px solid #FCD34D', borderRadius: 6,
              padding: '10px 12px', marginBottom: 16,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 14, height: 14, borderRadius: '50%', background: '#F59E0B',
                color: '#fff', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
              }}
            >
              !
            </div>
            <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
              {government.dismissal_reason}
            </div>
          </div>
        )}

        {/* CM header row: name + government number */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10, fontWeight: 600, color: '#AAA',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
              }}
            >
              Chief Minister
            </div>
            <div
              aria-label={
                active && !active.isFirst && active.predecessor
                  ? `Chief Minister ${active.cm.name}, took over from ${active.predecessor.name} on ${formatDate(active.cm.start_date)}`
                  : `Chief Minister ${active?.cm.name ?? government.cm?.name ?? ''}`
              }
              style={{
                fontSize: 24, fontWeight: 700, color: '#111',
                letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 8,
              }}
            >
              {active?.cm.name ?? government.cm?.name}
            </div>

            {active && !active.isFirst && active.predecessor && (
              <div
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 6,
                  margin: '-2px 0 10px 0',
                  fontSize: 11, color: '#888', letterSpacing: '0.01em',
                }}
              >
                <span style={{ color: '#BBB' }}>↳</span>
                <span>
                  Took over from {active.predecessor.name} · {formatDate(active.cm.start_date)}
                </span>
              </div>
            )}

            <div
              style={{
                fontSize: 11, fontWeight: 600, color: '#fff',
                background: allianceColour, padding: '3px 10px',
                borderRadius: 4, display: 'inline-block',
                transition: 'background 200ms ease',
              }}
            >
              {allianceName}
            </div>
          </div>

          {/* Government number */}
          <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 12 }}>
            <div style={{ fontSize: 10, color: '#AAA', marginBottom: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Government
            </div>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: allianceColour, transition: 'color 200ms ease' }}>#</span>
              <span
                style={{
                  fontSize: 30, fontWeight: 700, color: allianceColour,
                  letterSpacing: '-1.5px', transition: 'color 200ms ease',
                }}
              >
                {government.government_number}
              </span>
            </div>
          </div>
        </div>

        {/* Mid-term CM changes */}
        {hasMidTermChange && (
          <div
            style={{
              background: '#F0F7FF', border: '0.5px solid #BFDBFE', borderRadius: 8,
              padding: '10px 12px', marginBottom: 16, fontSize: 12, color: '#1E40AF',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              This term had {government.cm_changes?.length ?? 0} Chief Ministers
            </div>
            {(government.cm_changes ?? []).map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0',
                  borderTop: i === 0 ? 'none' : '0.5px solid #DBEAFE',
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1E40AF', opacity: 1 - i * 0.35, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1E3A8A' }}>{c.cm_name}</div>
                  <div style={{ fontSize: 11, color: '#3B6FB6', fontVariantNumeric: 'tabular-nums' }}>
                    {formatDate(c.start_date)} – {formatDate(c.end_date)}
                  </div>
                  {c.reason && <div style={{ fontSize: 11, color: '#5A7AAB', fontStyle: 'italic', marginTop: 2 }}>{c.reason}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <Divider />

        {/* Metadata 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
          <MetaCell
            icon={<IconCalendar />}
            label="Term"
            value={`${formatDate(government.start_date)} – ${formatDate(government.end_date)}`}
          />
          <MetaCell
            icon={<IconClock />}
            label="Duration"
            value={formatDuration(government.start_date, government.end_date)}
          />
          <MetaCell
            icon={<IconBallot />}
            label="Election"
            value={government.election_year?.toString() ?? '—'}
          />
          <MetaCell
            icon={<IconGovt />}
            label="Type"
            value="Elected Government"
          />
        </div>

        <Divider />

        {/* Seats won */}
        {government.seats_won != null && (
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Seats won</div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: allianceColour, transition: 'color 200ms ease' }}>
                  {seatsWon}
                </span>
                <span style={{ fontSize: 12, color: '#AAA' }}> of {totalSeats}</span>
              </div>
            </div>
            {/* Segmented block bar */}
            <div style={{ display: 'flex', gap: 1.5, overflow: 'hidden' }}>
              {seatBlocks.map((won, i) => (
                <div
                  key={i}
                  style={{
                    flex: '1 0 0',
                    height: 18,
                    borderRadius: 2,
                    background: won ? allianceColour : '#EAEAEA',
                    minWidth: 0,
                    transition: 'background 200ms ease',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Coalition chips */}
        {coalitionParties.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10.5, fontWeight: 500, color: '#AAA',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
              }}
            >
              Coalition partners
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {coalitionParties.map(({ id, shortName, fullName, color }) => (
                <CoalitionChip
                  key={id}
                  shortName={shortName}
                  fullName={fullName}
                  color={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* 16px breathing room before the button separator */}
        <div style={{ height: 16 }} />
      </div>

      {/* View full cabinet button — only shown when cabinet data exists */}
      {hasCabinet && <button
        onClick={onOpenCabinet}
        style={{
          width: '100%', display: 'flex',
          alignItems: 'center', gap: 14,
          border: 'none',
          borderTop: '0.5px solid #F0F0F0',
          borderRadius: 0,
          padding: '14px 20px',
          background: '#fff',
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 150ms ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FAFAFA' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconUsers />
        </div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>View full cabinet</div>
          <div style={{ fontSize: 11, color: '#AAA', marginTop: 1 }}>See all ministers and portfolios</div>
        </div>
        <span style={{ fontSize: 16, color: '#CCC', flexShrink: 0 }}>→</span>
      </button>}
    </div>
  )
}
