import type { Alliance, Cabinet, Government, Party, State } from '@/schemas'

import rawAlliances from '@/public/data/alliances.json'
import rawCabinets from '@/public/data/cabinets.json'
import rawGovernments from '@/public/data/governments.json'
import rawParties from '@/public/data/parties.json'
import rawStates from '@/public/data/states.json'

const alliances = rawAlliances as Alliance[]
const cabinets = rawCabinets as Cabinet[]
const governments = rawGovernments as Government[]
const parties = rawParties as Party[]
const states = rawStates as State[]

export function getAllGovernments(stateId: string): Government[] {
  return governments.filter(g => g.state_id === stateId)
}

export function getGovernmentForYear(year: number, stateId: string): Government | null {
  const stateGovs = getAllGovernments(stateId)
  const currentYear = new Date().getFullYear()

  // Find the government whose term contains this year.
  // If two governments share a boundary year, prefer the one whose start_date year matches.
  const matches = stateGovs.filter(g => {
    const startYear = new Date(g.start_date).getFullYear()
    const endYear = g.end_date ? new Date(g.end_date).getFullYear() : currentYear
    return startYear <= year && year <= endYear
  })

  if (matches.length === 0) return null
  if (matches.length === 1) return matches[0]

  // Multiple matches (boundary year) — prefer the one whose start_date year equals the slider year
  const exact = matches.find(g => new Date(g.start_date).getFullYear() === year)
  return exact ?? matches[matches.length - 1]
}

export function getCabinetForGovernment(governmentId: string): Cabinet | null {
  return cabinets.find(c => c.government_id === governmentId) ?? null
}

export function getPartyById(partyId: string): Party | null {
  return parties.find(p => p.id === partyId) ?? null
}

export function getAllianceById(allianceId: string): Alliance | null {
  return alliances.find(a => a.id === allianceId) ?? null
}

export function getStateById(stateId: string): State | null {
  return states.find(s => s.id === stateId) ?? null
}

export function getYearRange(stateId: string): { min: number; max: number } {
  const govs = getAllGovernments(stateId)
  if (govs.length === 0) return { min: 1957, max: new Date().getFullYear() }
  const min = Math.min(...govs.map(g => new Date(g.start_date).getFullYear()))
  const max = new Date().getFullYear()
  return { min, max }
}

export function getAllianceColour(
  government: Government,
  partiesList: Party[],
  alliancesList: Alliance[],
): string {
  if (government.type === 'presidents_rule') return '#757575'
  if (government.ruling_alliance_id === 'NONE') {
    const party = partiesList.find(p => p.id === government.ruling_party_id)
    return party?.color ?? '#B0BEC5'
  }
  const alliance = alliancesList.find(a => a.id === government.ruling_alliance_id)
  return alliance?.color ?? '#B0BEC5'
}

export function getAlliances(): Alliance[] {
  return alliances
}

export function getAllParties(): Party[] {
  return parties
}

// Pre-computed colour for a year — used by the slider track segments
export function getColourForYear(year: number, stateId: string): string {
  const gov = getGovernmentForYear(year, stateId)
  if (!gov) return '#E0E0E0'
  return getAllianceColour(gov, parties, alliances)
}

// Format a date string as "D Mon YYYY" (e.g. "25 May 2021")
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Duration between two dates as a human string
export function formatDuration(startStr: string, endStr: string | null): string {
  const start = new Date(startStr)
  const end = endStr ? new Date(endStr) : new Date()
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (years === 0) return `${rem} month${rem !== 1 ? 's' : ''}`
  if (rem === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years} year${years !== 1 ? 's' : ''}, ${rem} month${rem !== 1 ? 's' : ''}`
}
