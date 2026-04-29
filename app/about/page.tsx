import Link from 'next/link'

export const metadata = {
  title: 'About — Aatchi',
  description: "About Aatchi — India's open-source civic governance timeline.",
}

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
            fontSize: 32,
            fontWeight: 400,
            color: '#1D2B4A',
            letterSpacing: '-0.3px',
            marginBottom: 12,
          }}
        >
          aatchi
        </h1>
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, margin: 0 }}>
          Aatchi (ஆட்சி — "rule" in Tamil/Malayalam) is an open-source civic data
          platform that visualises India's state-wise political governance from 1957
          to the present. Kerala is live. All 28 states are the goal.
        </p>
      </div>

      <Divider />

      <Section title="What it does">
        <p>
          Slide through years on a timeline, see each state map coloured by the ruling
          alliance, and tap through to see who governed, when, and for how long.
        </p>
        <ul style={{ paddingLeft: 20, marginTop: 12, lineHeight: 1.9 }}>
          <li>No ads, no revenue, no monetisation — ever.</li>
          <li>Factual data only. No commentary, no opinion.</li>
          <li>Built for students, journalists, and anyone curious.</li>
        </ul>
      </Section>

      <Divider />

      <Section title="How the map is coloured">
        <p style={{ marginBottom: 16 }}>
          Each state is coloured by its <strong>ruling alliance</strong>, not the
          Chief Minister's individual party.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { colour: '#C62828', label: 'LDF', desc: 'Left Democratic Front' },
            { colour: '#1565C0', label: 'UDF', desc: 'United Democratic Front' },
            { colour: '#757575', label: "President's Rule", desc: 'Central government administration (Article 356)' },
            { colour: '#B0BEC5', label: 'Other / Pre-alliance', desc: 'Before the LDF/UDF system or other arrangements' },
          ].map(({ colour, label, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: colour, flexShrink: 0, marginTop: 3 }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{label}</span>
                <span style={{ fontSize: 13, color: '#777', marginLeft: 8 }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      <Section title="Data sources">
        <p style={{ marginBottom: 12 }}>
          All data comes from publicly available, verifiable sources.
        </p>
        {[
          {
            name: 'TCPD Chief Ministers Dataset',
            org: 'Trivedi Centre for Political Data, Ashoka University',
          },
          {
            name: 'Election Commission of India',
            org: 'Statistical reports on assembly elections',
          },
          {
            name: 'Kerala Districts GeoJSON',
            org: 'Datameet community (ODbL)',
          },
        ].map(({ name, org }) => (
          <div
            key={name}
            style={{
              padding: '10px 14px',
              border: '0.5px solid #E0E0E0',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#777' }}>{org}</div>
          </div>
        ))}
      </Section>

      <Divider />

      {/* Built by — Dark Civic Seal */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 14,
          padding: '28px 28px 24px',
          marginBottom: 20,
          background: [
            'radial-gradient(ellipse 55% 140% at 18% 50%, rgba(198,40,40,0.32) 0%, transparent 100%)',
            'radial-gradient(ellipse 40% 160% at 88% 50%, rgba(255,255,255,0.03) 0%, transparent 100%)',
            '#1D2B4A',
          ].join(', '),
        }}
      >
        {/* SVG layer: dot grid + concentric rings */}
        <svg
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 0,
          }}
          aria-hidden="true"
        >
          <defs>
            <pattern id="by-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="11" cy="11" r="1" fill="white" fillOpacity="0.055" />
            </pattern>
          </defs>

          {/* Dot grid */}
          <rect width="100%" height="100%" fill="url(#by-dots)" />

          {/* Concentric rings anchored to the right side */}
          <circle cx="88%" cy="50%" r="55"  fill="none" stroke="white" strokeWidth="0.6" strokeOpacity="0.08" />
          <circle cx="88%" cy="50%" r="90"  fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.06" />
          <circle cx="88%" cy="50%" r="130" fill="none" stroke="white" strokeWidth="0.4" strokeOpacity="0.045" />
          <circle cx="88%" cy="50%" r="175" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.03" />

          {/* Faint cross-hair at glow origin */}
          <line x1="18%" y1="0" x2="18%" y2="100%" stroke="#C62828" strokeWidth="0.5" strokeOpacity="0.18" />
          <line x1="0"   y1="50%" x2="40%" y2="50%" stroke="#C62828" strokeWidth="0.5" strokeOpacity="0.12" />
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Built by
          </div>

          <a
            href="https://instagram.com/intuitive.fellow"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              fontSize: 22, fontWeight: 700, color: '#C62828',
              textDecoration: 'none', letterSpacing: '-0.4px', lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            Fadil Ameen V.M
          </a>

          <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
            <a
              href="https://instagram.com/intuitive.fellow"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: 11, fontWeight: 500,
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              ↗ Instagram
            </a>
            <a
              href="https://github.com/intuitive-fellow/aatchi"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: 11, fontWeight: 500,
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              ↗ GitHub
            </a>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: 12, color: '#AAA', lineHeight: 1.8, margin: 0,
          padding: '4px 0',
        }}
      >
        Aatchi is an independent civic project. Not affiliated with any political party,
        government body, or the data sources cited above. Data is presented for
        informational purposes only.
      </p>
    </main>
  )
}

function Divider() {
  return <div style={{ height: '0.5px', background: '#E0E0E0', margin: '36px 0' }} />
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 0 }}>
      <h2
        style={{
          fontSize: 11, fontWeight: 500, color: '#999',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  )
}
