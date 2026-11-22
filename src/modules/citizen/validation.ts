import type { ReportCategory } from '../../shared/types'

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  fire: 'Incendio o quema',
  waste: 'Residuos',
  water: 'Agua (contaminación o escasez)',
  deforestation: 'Desmonte',
  other: 'Otro',
}

/** Caja aproximada de la provincia de Jujuy (WGS84), con un pequeño margen. */
export const JUJUY_BOUNDS = { minLat: -24.7, maxLat: -21.7, minLng: -67.3, maxLng: -64.1 }

export const TITLE_MIN = 5
export const TITLE_MAX = 80
export const DESCRIPTION_MIN = 15
export const DESCRIPTION_MAX = 600

export interface ReportDraft {
  title: string
  description: string
  category: ReportCategory | ''
  lat: string
  lng: string
  label: string
}

export type DraftErrors = Partial<Record<keyof ReportDraft | 'location', string>>

export const emptyDraft: ReportDraft = { title: '', description: '', category: '', lat: '', lng: '', label: '' }

function parseCoordinate(value: string): number | undefined {
  const trimmed = value.trim().replace(',', '.')
  if (trimmed === '') return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function isInsideJujuy(lat: number, lng: number): boolean {
  const b = JUJUY_BOUNDS
  return lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng
}

export function validateDraft(draft: ReportDraft): DraftErrors {
  const errors: DraftErrors = {}
  const title = draft.title.trim()
  const description = draft.description.trim()

  if (title.length === 0) errors.title = 'Ingresá un título.'
  else if (title.length < TITLE_MIN) errors.title = `El título debe tener al menos ${TITLE_MIN} caracteres.`
  else if (title.length > TITLE_MAX) errors.title = `El título no puede superar ${TITLE_MAX} caracteres.`

  if (description.length === 0) errors.description = 'Describí lo que observaste.'
  else if (description.length < DESCRIPTION_MIN) errors.description = `La descripción debe tener al menos ${DESCRIPTION_MIN} caracteres.`
  else if (description.length > DESCRIPTION_MAX) errors.description = `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`

  if (draft.category === '') errors.category = 'Elegí una categoría.'

  const lat = parseCoordinate(draft.lat)
  const lng = parseCoordinate(draft.lng)
  if (draft.lat.trim() === '' || draft.lng.trim() === '') errors.location = 'Indicá la ubicación: usá tu ubicación actual o cargá latitud y longitud.'
  else if (lat === undefined || lng === undefined) errors.location = 'Latitud y longitud deben ser números (por ejemplo -24.19 y -65.30).'
  else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) errors.location = 'Las coordenadas están fuera de rango.'
  else if (!isInsideJujuy(lat, lng)) errors.location = 'La ubicación está fuera de la provincia de Jujuy.'

  if (draft.label.trim().length > 80) errors.label = 'La referencia no puede superar 80 caracteres.'

  return errors
}

export function draftCoordinates(draft: ReportDraft): { lat: number; lng: number } {
  return { lat: parseCoordinate(draft.lat) as number, lng: parseCoordinate(draft.lng) as number }
}
