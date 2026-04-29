'use client'

import { useRef } from 'react'

const STATES = [
  { native: 'കേരളം',              label: 'KERALA',              active: true  },
  { native: 'தமிழ்நாடு',          label: 'TAMIL NADU',          active: false },
  { native: 'ಕರ್ನಾಟಕ',            label: 'KARNATAKA',           active: false },
  { native: 'महाराष्ट्र',          label: 'MAHARASHTRA',         active: false },
  { native: 'ఆంధ్రప్రదేశ్',       label: 'ANDHRA PRADESH',      active: false },
  { native: 'తెలంగాణ',            label: 'TELANGANA',           active: false },
  { native: 'ગુજરાત',              label: 'GUJARAT',             active: false },
  { native: 'পশ্চিমবঙ্গ',          label: 'WEST BENGAL',         active: false },
  { native: 'उत्तर प्रदेश',        label: 'UTTAR PRADESH',       active: false },
  { native: 'राजस्थान',            label: 'RAJASTHAN',           active: false },
  { native: 'मध्यप्रदेश',          label: 'MADHYA PRADESH',      active: false },
  { native: 'ਪੰਜਾਬ',              label: 'PUNJAB',              active: false },
  { native: 'हरियाणा',             label: 'HARYANA',             active: false },
  { native: 'बिहार',               label: 'BIHAR',               active: false },
  { native: 'ଓଡ଼ିଶା',              label: 'ODISHA',              active: false },
  { native: 'অসম',                 label: 'ASSAM',               active: false },
  { native: 'झारखंड',              label: 'JHARKHAND',           active: false },
  { native: 'छत्तीसगढ़',           label: 'CHHATTISGARH',        active: false },
  { native: 'उत्तराखण्ड',          label: 'UTTARAKHAND',         active: false },
  { native: 'हिमाचल प्रदेश',       label: 'HIMACHAL PRADESH',    active: false },
  { native: 'ত্রিপুরা',             label: 'TRIPURA',             active: false },
  { native: 'মণিপুর',              label: 'MANIPUR',             active: false },
  { native: 'सिक्किम',             label: 'SIKKIM',              active: false },
  { native: 'Meghalaya',           label: 'MEGHALAYA',           active: false },
  { native: 'Mizoram',             label: 'MIZORAM',             active: false },
  { native: 'Nagaland',            label: 'NAGALAND',            active: false },
  { native: 'Arunachal Pradesh',   label: 'ARUNACHAL PRADESH',   active: false },
  { native: 'गोवा',                label: 'GOA',                 active: false },
  { native: 'दिल्ली',              label: 'DELHI',               active: false },
  { native: 'पुदुच्चेरी',          label: 'PUDUCHERRY',          active: false },
  { native: 'ਚੰਡੀਗੜ੍ਹ',            label: 'CHANDIGARH',          active: false },
  { native: 'ലക്ഷദ്വീപ്',          label: 'LAKSHADWEEP',         active: false },
  { native: 'جموں کشمیر',          label: 'JAMMU & KASHMIR',     active: false },
  { native: 'ལ་དྭགས་',             label: 'LADAKH',              active: false },
  { native: 'Andaman & Nicobar',   label: 'ANDAMAN & NICOBAR',   active: false },
  { native: 'Daman & Diu',         label: 'DAMAN & DIU',         active: false },
]

function StateList({ 'aria-hidden': ariaHidden }: { 'aria-hidden'?: boolean }) {
  return (
    <span aria-hidden={ariaHidden} style={{ display: 'contents' }}>
      {STATES.map((s, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            marginRight: 24,
          }}
        >
          <span aria-hidden="true" style={{ color: '#111', opacity: 0.2, fontSize: 11, lineHeight: 1 }}>
            ·
          </span>

          <span
            style={{
              fontSize: 14,
              lineHeight: 1.4,
              color: s.active ? '#C62828' : '#444',
            }}
          >
            {s.native}
          </span>

          <span
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: s.active ? '#C62828' : '#AAA',
              lineHeight: 1,
            }}
          >
            {s.label}
          </span>
        </span>
      ))}
    </span>
  )
}

export default function StateNav() {
  const trackRef = useRef<HTMLDivElement>(null)

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'  }
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running' }

  return (
    <>
      <style>{`
        @keyframes aatchi-states {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div
        aria-label="All states of India"
        style={{
          height: 44,
          background: '#fff',
          borderBottom: '0.5px solid #E0E0E0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          ref={trackRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            willChange: 'transform',
            animation: 'aatchi-states 120s linear infinite',
            paddingLeft: 24,
          }}
        >
          <StateList />
          <StateList aria-hidden />
        </div>
      </div>
    </>
  )
}
