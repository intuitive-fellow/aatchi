import { z } from 'zod'

export const AllianceSchema = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  description: z.string(),
})

export const PartySchema = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  alliance_id: z.string(),
})

export const StateSchema = z.object({
  id: z.string().length(2),
  name: z.string(),
  capital: z.string(),
  formation_date: z.string(),
  legislature: z.string(),
  total_seats: z.number().int().positive(),
  region: z.string(),
})

export const CmChangeSchema = z.object({
  name: z.string(),
  party_id: z.string().nullable(),
  from: z.string(),
  to: z.string().nullable(),
  reason: z.string().nullable(),
})

export const GovernmentSchema = z.object({
  id: z.string(),
  state_id: z.string(),
  type: z.enum(['elected', 'presidents_rule']),
  cm: z.string().nullable(),
  cm_party_id: z.string().nullable(),
  cm_constituency: z.string().nullable(),
  ruling_alliance_id: z.string(),
  ruling_party_id: z.string().nullable(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  election_year: z.number().int().nullable(),
  seats_won: z.number().int().nullable(),
  total_seats: z.number().int(),
  dismissed: z.boolean(),
  dismissal_reason: z.string().nullable(),
  cm_changes: z.array(CmChangeSchema),
  coalition_party_ids: z.array(z.string()),
})

export const MinisterSchema = z.object({
  name: z.string(),
  party_id: z.string(),
  constituency: z.string(),
  rank: z.enum([
    'Chief Minister',
    'Deputy Chief Minister',
    'Cabinet Minister',
    'Minister of State (Independent Charge)',
    'Minister of State',
  ]),
  portfolios: z.array(z.string()),
})

export const CabinetSchema = z.object({
  government_id: z.string(),
  ministers: z.array(MinisterSchema),
})

export const ElectionResultSchema = z.object({
  party_id: z.string(),
  seats: z.number().int().nonnegative(),
})

export const ElectionSchema = z.object({
  id: z.string(),
  state_id: z.string(),
  year: z.number().int(),
  total_seats: z.number().int().positive(),
  results: z.array(ElectionResultSchema),
})

// TypeScript types derived from schemas
export type Alliance = z.infer<typeof AllianceSchema>
export type Party = z.infer<typeof PartySchema>
export type State = z.infer<typeof StateSchema>
export type CmChange = z.infer<typeof CmChangeSchema>
export type Government = z.infer<typeof GovernmentSchema>
export type Minister = z.infer<typeof MinisterSchema>
export type Cabinet = z.infer<typeof CabinetSchema>
export type Election = z.infer<typeof ElectionSchema>
