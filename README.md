# aatchi — ஆட்சி

An open-source civic data platform visualising state-wise political governance in India from 1957 to present. Kerala is the pilot state.

Live: coming soon

## What it does

Slide through years on a timeline, see the Kerala map coloured by the ruling alliance, and drill into cabinet details for any government since 1957.

## Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Map**: D3.js + GeoJSON (no tile servers, no API cost)
- **Data**: Static JSON in `/public/data/` — no database

## Run locally

Requires Node.js (via [nvm](https://github.com/nvm-sh/nvm)).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npx tsc --noEmit  # type check
```

## Data sources

- **[TCPD-CMID](https://tcpd.ashoka.edu.in/)** — Trivedi Centre for Political Data, Ashoka University (non-commercial use)
- **Election Commission of India** — election results
- **[GADM](https://gadm.org)** — district boundary GeoJSON (non-commercial use)

This project is not affiliated with any political party, government body, or the data sources cited above.

## Contributing

Data corrections and additions are welcome. See `DATA_CONTRIBUTING.md` (coming soon) for the schema and PR guidelines. Every data PR must include a source URL.

## Licence

Code: MIT. Data files in `/public/data/`: see `DATA_LICENSE.md` (coming soon) — licences vary by source.
