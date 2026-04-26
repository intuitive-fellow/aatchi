const ITEMS = [
  { label: 'LDF',             colour: '#C62828' },
  { label: 'UDF',             colour: '#1565C0' },
  { label: "President's Rule", colour: '#757575' },
  { label: 'Pre-alliance',    colour: '#B0BEC5' },
]

export default function PartyLegend() {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 14 }}>
      {ITEMS.map(({ label, colour }) => (
        <div
          key={label}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#777' }}
        >
          <span
            style={{
              width: 10, height: 10,
              borderRadius: 2,
              background: colour,
              flexShrink: 0,
            }}
          />
          {label}
        </div>
      ))}
    </div>
  )
}
