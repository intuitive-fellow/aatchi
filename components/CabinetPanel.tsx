'use client'

import { useEffect, useRef, useState } from 'react'
import type { Cabinet, Government, Party } from '@/schemas'

const RANK_ORDER = [
  'Chief Minister',
  'Deputy Chief Minister',
  'Cabinet Minister',
  'Minister of State (Independent Charge)',
  'Minister of State',
]

interface Props {
  open: boolean
  onClose: () => void
  government: Government | null
  cabinet: Cabinet | null
  allianceColour: string
  allianceName: string
  parties: Party[]
}

export default function CabinetPanel({
  open,
  onClose,
  government,
  cabinet,
  allianceColour,
  allianceName,
  parties,
}: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isPR = government?.type === 'presidents_rule'

  // Reset search when drawer opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 160)
    }
  }, [open, government?.id])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!government) return null

  const ministers = cabinet?.ministers ?? []

  const grouped = RANK_ORDER.map(rank => ({
    rank,
    members: ministers
      .filter(m => m.rank === rank)
      .filter(m => {
        if (!query) return true
        const q = query.toLowerCase()
        return (
          m.name.toLowerCase().includes(q) ||
          m.party_id.toLowerCase().includes(q) ||
          m.constituency.toLowerCase().includes(q) ||
          m.portfolios.some(p => p.toLowerCase().includes(q))
        )
      }),
  })).filter(g => g.members.length > 0)

  const totalVisible = grouped.reduce((n, g) => n + g.members.length, 0)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          background: open ? 'rgba(0,0,0,0.18)' : 'transparent',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'background 150ms ease',
          zIndex: 40,
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cabinet details"
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(420px, 100vw)',
          background: '#fff',
          borderLeft: '0.5px solid #E0E0E0',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 150ms ease',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '0.5px solid #E0E0E0',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
              {isPR ? "President's Rule" : `${allianceName} cabinet`}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>
              {isPR
                ? `${government.start_date.slice(0, 4)} – ${government.end_date?.slice(0, 4) ?? 'Present'}`
                : `${government.cm} · ${ministers.length} ministers`}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cabinet panel"
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: '0.5px solid #E0E0E0', background: '#FAFAFA',
              color: '#555', fontSize: 16, lineHeight: 1, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {isPR ? (
          <div style={{ padding: 24, color: '#555', fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#757575', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 11, fontWeight: 500, color: '#fff', background: '#757575',
                  padding: '3px 9px', borderRadius: 4,
                }}
              >
                Article 356 · Central rule
              </span>
            </div>
            <p style={{ marginBottom: 16 }}>
              The state legislature was suspended during this period. The state was governed
              directly by the central government through the Governor.
            </p>
            <div
              style={{
                border: '0.5px dashed #E0E0E0', borderRadius: 8, padding: 14,
                textAlign: 'center', color: '#BBB', fontSize: 12,
              }}
            >
              No cabinet — central rule in effect
            </div>
          </div>
        ) : (
          <>
            {/* Search */}
            <div style={{ padding: '12px 20px', borderBottom: '0.5px solid #F0F0F0', flexShrink: 0 }}>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, party, or portfolio…"
                style={{
                  width: '100%',
                  border: '0.5px solid #E0E0E0',
                  borderRadius: 6,
                  padding: '8px 11px',
                  fontSize: 13, color: '#111',
                  background: '#FAFAFA',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Minister list */}
            <div style={{ overflowY: 'auto', padding: '6px 0 24px', flex: 1 }}>
              {grouped.map(({ rank, members }) => (
                <div key={rank} style={{ padding: '14px 20px 0' }}>
                  <div
                    style={{
                      fontSize: 10, fontWeight: 500, letterSpacing: '0.07em',
                      color: '#BBB', textTransform: 'uppercase', marginBottom: 8,
                    }}
                  >
                    {rank === 'Chief Minister' ? 'Chief Minister' : `${rank}s`}
                  </div>
                  {members.map((m, i) => {
                    const isCM = m.rank === 'Chief Minister'
                    const partyColour = parties.find(p => p.id === m.party_id)?.color ?? '#999'
                    const partyShort = parties.find(p => p.id === m.party_id)?.short_name ?? m.party_id

                    if (isCM) {
                      return (
                        <div
                          key={i}
                          style={{
                            background: allianceColour === '#C62828' ? '#FFF8F8' : '#F4F8FD',
                            borderLeft: `2px solid ${allianceColour}`,
                            padding: '11px 14px',
                            borderRadius: '0 6px 6px 0',
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10, fontWeight: 500, color: allianceColour,
                              letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4,
                            }}
                          >
                            Chief Minister
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: '#999', margin: '3px 0 6px' }}>
                            {partyShort} · {m.constituency}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {m.portfolios.map((p, j) => (
                              <span
                                key={j}
                                style={{
                                  fontSize: 10, color: '#444',
                                  background: '#fff', border: '0.5px solid #EAEAEA',
                                  borderRadius: 3, padding: '2px 6px',
                                }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '10px 0',
                          borderBottom: i === members.length - 1 ? 'none' : '0.5px solid #F5F5F5',
                        }}
                      >
                        <span
                          style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: partyColour,
                            flexShrink: 0, marginTop: 5,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#111', lineHeight: 1.3 }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>
                            {partyShort} · {m.constituency}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                            {m.portfolios.map((p, j) => (
                              <span
                                key={j}
                                style={{
                                  fontSize: 10, color: '#555',
                                  background: '#F5F5F5', border: '0.5px solid #EAEAEA',
                                  borderRadius: 3, padding: '2px 6px',
                                }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}

              {totalVisible === 0 && query && (
                <div style={{ padding: 32, textAlign: 'center', color: '#BBB', fontSize: 12 }}>
                  No ministers match "{query}"
                </div>
              )}

              {ministers.length === 0 && !query && (
                <div style={{ padding: 32, textAlign: 'center', color: '#BBB', fontSize: 12 }}>
                  Cabinet data not yet available for this government.
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
