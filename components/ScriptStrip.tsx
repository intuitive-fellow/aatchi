'use client'

import { useRef } from 'react'

// All 22 languages from India's 8th Constitutional Schedule.
// Each shows the native word speakers actually use for "governance/rule" —
// not a transliteration of "aatchi". Tamil ஆட்சி is the project name → brand red.
const WORDS = [
  { lang: 'Sindhi',    script: 'حڪومت',       meaning: 'Government, governance',           brand: false, rtl: true  },
  { lang: 'Maithili',  script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Marathi',   script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Assamese',  script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Malayalam', script: 'ഭരണം',        meaning: 'Governance, administration',       brand: false, rtl: false },
  { lang: 'Bodo',      script: "बर' फोरिन",   meaning: 'Governance, administration',       brand: false, rtl: false },
  { lang: 'Santali',   script: 'ᱥᱟᱥᱚᱱ',      meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Punjabi',   script: 'ਰਾਜ',         meaning: 'Rule, reign',                      brand: false, rtl: false },
  { lang: 'Gujarati',  script: 'શાસન',        meaning: 'Governance, rule',                 brand: false, rtl: false },
  { lang: 'Konkani',   script: 'शासन',        meaning: 'Governance, rule',                 brand: false, rtl: false },
  { lang: 'Nepali',    script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Hindi',     script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Odia',      script: 'ଶାସନ',        meaning: 'Rule, administration',             brand: false, rtl: false },
  { lang: 'Kannada',   script: 'ಆಳ್ವಿಕೆ',     meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Bengali',   script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Sanskrit',  script: 'शासनम्',      meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Urdu',      script: 'حکومت',       meaning: 'Government, governance',           brand: false, rtl: true  },
  { lang: 'Meitei',    script: 'ꯆꯥꯎꯈꯨꯝ',      meaning: 'Governance, administration',       brand: false, rtl: false },
  { lang: 'Tamil',     script: 'ஆட்சி',      meaning: 'Rule, reign — the project name',  brand: true,  rtl: false },
  { lang: 'Dogri',     script: 'शासन',        meaning: 'Rule, governance',                 brand: false, rtl: false },
  { lang: 'Kashmiri',  script: 'حکومت',       meaning: 'Government, governance',           brand: false, rtl: true  },
  { lang: 'Telugu',    script: 'పాలన',        meaning: 'Governance, administration',       brand: false, rtl: false },
]

function WordList({ 'aria-hidden': ariaHidden }: { 'aria-hidden'?: boolean }) {
  return (
    <span aria-hidden={ariaHidden} style={{ display: 'contents' }}>
      {WORDS.map((w) => (
        <span
          key={w.lang}
          title={`${w.lang} — ${w.meaning}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            flexShrink: 0,
            marginRight: 20,
          }}
        >
          {/* separator dot before each item */}
          <span
            aria-hidden="true"
            style={{ color: '#111', opacity: 0.2, fontSize: 11, lineHeight: 1 }}
          >
            ·
          </span>

          {/* native script */}
          <span
            dir={w.rtl ? 'rtl' : undefined}
            style={{
              fontSize: 15,
              lineHeight: 1,
              color: w.brand ? '#C62828' : '#555',
              letterSpacing: w.rtl ? '0.02em' : undefined,
            }}
          >
            {w.script}
          </span>

          {/* language name */}
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: w.brand ? '#C62828' : '#AAA',
              lineHeight: 1,
              opacity: w.brand ? 0.85 : 1,
            }}
          >
            {w.lang}
          </span>
        </span>
      ))}
    </span>
  )
}

export default function ScriptStrip() {
  const trackRef = useRef<HTMLDivElement>(null)

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'  }
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running' }

  return (
    <>
      {/* Keyframes must live in a <style> tag — inline styles can't define @keyframes.
          Turbopack drops custom CSS classes from globals.css so we own this here. */}
      <style>{`
        @keyframes aatchi-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div
        aria-label="Governance in India's 22 scheduled languages"
        style={{
          height: 34,
          background: '#FAFAFA',
          borderBottom: '0.5px solid #E0E0E0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/*
          Two identical word lists side-by-side.
          Animation shifts the whole track by -50% (one copy width) then snaps
          back to 0, giving a seamless infinite loop with no visible jump.
          Pause/resume is handled via JS on mouse enter/leave.
        */}
        <div
          ref={trackRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            willChange: 'transform',
            animation: 'aatchi-marquee 60s linear infinite',
            paddingLeft: 24,
          }}
        >
          <WordList />
          <WordList aria-hidden />
        </div>
      </div>
    </>
  )
}
