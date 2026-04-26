import type { Government, Party, Alliance } from '@/schemas'
import { formatDate, formatDuration } from '@/lib/data'

interface Props {
  government: Government
  allianceColour: string
  allianceName: string
  parties: Party[]
  onOpenCabinet: () => void
}

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10, color: '#999', textTransform: 'uppercase',
          letterSpacing: '0.06em', fontWeight: 500, marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13, color: '#111', fontWeight: 500,
          fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default function GovernmentCard({
  government,
  allianceColour,
  allianceName,
  parties,
  onOpenCabinet,
}: Props) {
  const isPR = government.type === 'presidents_rule'

  if (isPR) {
    return (
      <div>
        <div
          style={{
            background: '#F5F5F5',
            padding: '14px 16px',
            borderTop: '0.5px solid #E0E0E0',
            borderBottom: '0.5px solid #E0E0E0',
            display: 'flex', alignItems: 'center', gap: 10,
            margin: '0 -24px 16px',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#757575', flexShrink: 0 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: '#555' }}>President's Rule</div>
        </div>

        <div
          style={{
            fontSize: 11, fontWeight: 500, color: '#fff', background: '#757575',
            padding: '3px 9px', borderRadius: 4, display: 'inline-block', marginBottom: 14,
          }}
        >
          Article 356 · Central rule
        </div>

        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 18 }}>
          Central government administration. The state legislature was suspended and the state
          was governed directly by the Governor on behalf of the President.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <MetaCell label="From"     value={formatDate(government.start_date)} mono />
          <MetaCell label="To"       value={formatDate(government.end_date)} mono />
          <MetaCell label="Duration" value={formatDuration(government.start_date, government.end_date)} />
          <MetaCell label="Article"  value="356 — Constitution of India" />
        </div>

        <div
          style={{
            border: '0.5px dashed #E0E0E0', borderRadius: 8, padding: 14,
            textAlign: 'center', color: '#BBB', fontSize: 12,
          }}
        >
          No cabinet — central rule in effect
        </div>
      </div>
    )
  }

  const seatsPct = government.seats_won != null
    ? Math.round((government.seats_won / government.total_seats) * 100)
    : 0

  const coalitionNames = government.coalition_party_ids.map(id => {
    const p = parties.find(p => p.id === id)
    return p?.short_name ?? id
  })

  const hasMidTermChange = government.cm_changes.length > 1

  return (
    <div>
      {/* Dismissed banner */}
      {government.dismissed && government.dismissal_reason && (
        <div
          style={{
            background: '#FFFBEB', border: '0.5px solid #FCD34D', borderRadius: 6,
            padding: '10px 12px', marginBottom: 14,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 14, height: 14, borderRadius: '50%', background: '#F59E0B',
              color: '#fff', fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}
          >
            !
          </div>
          <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
            {government.dismissal_reason}
          </div>
        </div>
      )}

      {/* CM name + alliance badge */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontSize: 22, fontWeight: 500, color: '#111',
            letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 6,
          }}
        >
          {government.cm}
        </div>
        <div
          style={{
            fontSize: 11, fontWeight: 500, color: '#fff',
            background: allianceColour, padding: '3px 9px', borderRadius: 4,
            display: 'inline-block', transition: 'background 200ms ease',
          }}
        >
          {allianceName}
        </div>
      </div>

      {/* Mid-term CM change note */}
      {hasMidTermChange && (
        <div
          style={{
            background: '#F0F7FF', border: '0.5px solid #BFDBFE', borderRadius: 6,
            padding: '10px 12px', marginBottom: 14, fontSize: 12, color: '#1E40AF',
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            This term had {government.cm_changes.length} Chief Ministers
          </div>
          {government.cm_changes.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '6px 0',
                borderTop: i === 0 ? 'none' : '0.5px solid #DBEAFE',
              }}
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#1E40AF', opacity: 1 - i * 0.35,
                  flexShrink: 0, marginTop: 5,
                }}
              />
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1E3A8A' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#3B6FB6', fontVariantNumeric: 'tabular-nums' }}>
                  {formatDate(c.from)} – {formatDate(c.to)}
                </div>
                {c.reason && (
                  <div style={{ fontSize: 11, color: '#5A7AAB', fontStyle: 'italic', marginTop: 2 }}>
                    {c.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <MetaCell
          label="Term"
          value={`${formatDate(government.start_date)} – ${formatDate(government.end_date)}`}
          mono
        />
        <MetaCell label="Government" value={`#${government.id.split('-')[1]} govt`} />
        <MetaCell label="Election" value={government.election_year?.toString() ?? '—'} />
        <MetaCell label="Duration" value={formatDuration(government.start_date, government.end_date)} />
      </div>

      {/* Seats bar */}
      {government.seats_won != null && (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 10, color: '#999', textTransform: 'uppercase',
              letterSpacing: '0.06em', fontWeight: 500, marginBottom: 6,
            }}
          >
            Seats won
          </div>
          <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%', width: `${seatsPct}%`,
                background: allianceColour,
                transition: 'width 200ms ease, background 200ms ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <div
              style={{
                fontSize: 12, fontWeight: 500, color: allianceColour,
                transition: 'color 200ms ease',
              }}
            >
              {government.seats_won} seats
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>of {government.total_seats}</div>
          </div>
        </div>
      )}

      {/* Coalition chips */}
      {coalitionNames.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10, color: '#999', textTransform: 'uppercase',
              letterSpacing: '0.06em', fontWeight: 500, marginBottom: 8,
            }}
          >
            Coalition partners
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {coalitionNames.map((name, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11, color: '#444',
                  background: '#F5F5F5', border: '0.5px solid #EAEAEA',
                  borderRadius: 3, padding: '3px 8px',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View cabinet button */}
      <button
        onClick={onOpenCabinet}
        style={{
          width: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          border: '0.5px solid #E0E0E0', background: '#fff',
          borderRadius: 8, padding: '12px 16px',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FAFAFA' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>View cabinet</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>See all ministers</div>
        </div>
        <span style={{ fontSize: 16, color: '#999' }}>→</span>
      </button>
    </div>
  )
}
