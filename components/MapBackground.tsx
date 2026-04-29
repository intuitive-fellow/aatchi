// Decorative radial intelligence-grid background for the map panel.
// All geometry is in a 0–100 viewBox; preserveAspectRatio="slice" fills the panel.
// Every element is intentionally faint — this is texture, not content.
export default function MapBackground() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Radial mask — full opacity at centre, fully transparent at edges */}
        <radialGradient id="mbg-fade" cx="50%" cy="50%" r="58%">
          <stop offset="0%"   stopColor="white" stopOpacity="1"   />
          <stop offset="40%"  stopColor="white" stopOpacity="0.8" />
          <stop offset="75%"  stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0"   />
        </radialGradient>

        <mask id="mbg-mask">
          <rect x="0" y="0" width="100" height="100" fill="url(#mbg-fade)" />
        </mask>

        {/* Vignette — dark brand colour creeps in from all edges */}
        <radialGradient id="mbg-vig" cx="50%" cy="50%" r="68%">
          <stop offset="0%"   stopColor="#1D2B4A" stopOpacity="0"    />
          <stop offset="100%" stopColor="#1D2B4A" stopOpacity="0.07" />
        </radialGradient>

        {/* Tiny dot grid: one dot per 5×5 unit cell */}
        <pattern id="mbg-dots" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.28" fill="#1D2B4A" fillOpacity="0.38" />
        </pattern>
      </defs>

      {/* ── Layer 1: dot grid faded radially ─────────────────────────── */}
      <rect x="0" y="0" width="100" height="100"
        fill="url(#mbg-dots)"
        mask="url(#mbg-mask)"
      />

      {/* ── Layer 2: concentric rings (radar / data-field) ────────────── */}
      <g mask="url(#mbg-mask)">
        {(
          [
            { r: 10, opacity: 0.13 },
            { r: 20, opacity: 0.10 },
            { r: 30, opacity: 0.08 },
            { r: 40, opacity: 0.07 },
            { r: 52, opacity: 0.05 },
            { r: 64, opacity: 0.04 },
            { r: 76, opacity: 0.03 },
          ] as const
        ).map(({ r, opacity }) => (
          <circle
            key={r}
            cx="50" cy="50" r={r}
            fill="none"
            stroke="#1D2B4A"
            strokeWidth="0.14"
            strokeOpacity={opacity}
          />
        ))}
      </g>

      {/* ── Layer 3: faint cardinal cross-hair at centre ──────────────── */}
      <g mask="url(#mbg-mask)">
        <line x1="50" y1="1"  x2="50" y2="99"
          stroke="#1D2B4A" strokeWidth="0.1" strokeOpacity="0.12" />
        <line x1="1"  y1="50" x2="99" y2="50"
          stroke="#1D2B4A" strokeWidth="0.1" strokeOpacity="0.12" />
        {/* Tick marks on the cross */}
        {[-30, -20, -10, 10, 20, 30].map(offset => (
          <g key={offset}>
            <line
              x1={50 + offset} y1="48.5"
              x2={50 + offset} y2="51.5"
              stroke="#1D2B4A" strokeWidth="0.1" strokeOpacity="0.14"
            />
            <line
              x1="48.5" y1={50 + offset}
              x2="51.5" y2={50 + offset}
              stroke="#1D2B4A" strokeWidth="0.1" strokeOpacity="0.14"
            />
          </g>
        ))}
      </g>

      {/* ── Layer 4: centre origin dot ────────────────────────────────── */}
      <circle cx="50" cy="50" r="0.5"
        fill="#1D2B4A" fillOpacity="0.12"
      />

      {/* ── Layer 5: edge vignette ────────────────────────────────────── */}
      <rect x="0" y="0" width="100" height="100" fill="url(#mbg-vig)" />
    </svg>
  )
}
