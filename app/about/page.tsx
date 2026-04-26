import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About — Aatchi',
  description: "About Aatchi — India's open-source civic governance timeline. Data sources and attribution.",
}

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Hero — full logo PNG with tagline */}
      <div style={{ marginBottom: 56 }}>
        <Image
          src="/logo-full.png"
          alt="Aatchi — Rule. History. People."
          width={340}
          height={170}
          priority
          style={{ display: 'block', marginBottom: 24 }}
        />
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, margin: 0 }}>
          Aatchi (ஆட்சி) is an open-source civic data platform that visualises
          state-wise political governance in India from 1957 to the present.
          Kerala is the pilot state. All 28 states are the goal.
        </p>
      </div>

      <Divider />

      {/* What it is */}
      <Section title="What this is">
        <p>
          Users slide through years on a timeline, see the Kerala map coloured by the
          ruling alliance, and click through to see cabinet details for any government.
        </p>
        <ul style={{ paddingLeft: 20, marginTop: 12, lineHeight: 1.9 }}>
          <li>Not a commercial product — no revenue, no ads, no monetisation ever.</li>
          <li>Not opinionated — factual historical data only. No political commentary.</li>
          <li>A public data resource for students, researchers, and journalists.</li>
          <li>Pan-India in vision — Kerala is the pilot, all 28 states are the goal.</li>
        </ul>
      </Section>

      <Divider />

      {/* Data sources */}
      <div id="data">
        <Section title="Data sources">
          <DataSource
            name="TCPD Chief Ministers of India Dataset (TCPD-CMID)"
            org="Trivedi Centre for Political Data, Ashoka University"
            licence="Free for non-commercial use"
            note="Aatchi is not affiliated with, endorsed by, or sponsored by TCPD. The TCPD name and trademarks are not used in any way that implies endorsement."
          />
          <DataSource
            name="Election Commission of India — Statistical Reports"
            org="Election Commission of India"
            licence="Government open data, free to use"
            note="Historical election result data for Kerala Legislative Assembly elections."
          />
          <DataSource
            name="Kerala Districts GeoJSON"
            org="Datameet community"
            licence="Open Database Licence (ODbL)"
            note="Boundary data © Datameet community (ODbL). Derivatives must remain open under the same licence."
          />
        </Section>
      </div>

      <Divider />

      {/* Colour coding */}
      <Section title="How the map is coloured">
        <p style={{ marginBottom: 16 }}>
          The map is coloured by <strong>ruling alliance</strong>, not by the individual
          party of the Chief Minister. Four colours are used — one for each alliance.
          No colour means anything else.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { colour: '#C62828', label: 'LDF', desc: 'Left Democratic Front — dominant since 1980' },
            { colour: '#1565C0', label: 'UDF', desc: 'United Democratic Front — alternates with LDF' },
            { colour: '#757575', label: "President's Rule", desc: 'Article 356 — central government administration' },
            { colour: '#B0BEC5', label: 'Pre-alliance era', desc: 'Governments formed before the LDF/UDF system (pre-1980)' },
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

      {/* Contribute */}
      <Section title="Contribute">
        <p>
          Aatchi is open source. If you find a data error or want to add missing cabinet
          details, open a pull request on GitHub. Every data PR requires a source URL
          in the description.
        </p>
        <a
          href="https://github.com/aatchi-in/aatchi"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
            border: '0.5px solid #E0E0E0', borderRadius: 6, padding: '8px 14px',
            fontSize: 13, color: '#555', background: '#fff', textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View on GitHub
        </a>
      </Section>

      <Divider />

      {/* Footer disclaimer */}
      <p
        style={{
          fontSize: 12, color: '#999', lineHeight: 1.7,
          padding: '16px 0', borderTop: '0.5px solid #E0E0E0',
        }}
      >
        Aatchi is an independent civic project. Not affiliated with any political party,
        government body, or the data sources cited above. Data presented for informational
        purposes only.
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

function DataSource({ name, org, licence, note }: {
  name: string; org: string; licence: string; note: string
}) {
  return (
    <div
      style={{
        padding: '14px 16px',
        border: '0.5px solid #E0E0E0',
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{org}</div>
      <div
        style={{
          fontSize: 11, color: '#fff', background: '#555',
          display: 'inline-block', padding: '2px 7px', borderRadius: 3, marginBottom: 8,
        }}
      >
        {licence}
      </div>
      <div style={{ fontSize: 12, color: '#999', lineHeight: 1.6 }}>{note}</div>
    </div>
  )
}
