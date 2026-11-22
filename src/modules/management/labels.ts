import type { Priority, ReportCategory, ReportStatus } from '../../shared/types'

export const statusLabels: Record<ReportStatus, string> = {
  new: 'Nuevo',
  reviewing: 'En revisión',
  in_progress: 'En intervención',
  resolved: 'Resuelto',
}

export const priorityLabels: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}

export const categoryLabels: Record<ReportCategory, string> = {
  fire: 'Incendio',
  waste: 'Residuos',
  water: 'Agua',
  deforestation: 'Deforestación',
  other: 'Otro',
}

export const statuses = Object.keys(statusLabels) as ReportStatus[]
export const priorities = Object.keys(priorityLabels) as Priority[]
export const categories = Object.keys(categoryLabels) as ReportCategory[]

export const priorityStyles: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}

export const statusStyles: Record<ReportStatus, string> = {
  new: 'bg-sky-100 text-sky-800',
  reviewing: 'bg-violet-100 text-violet-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-emerald-100 text-emerald-800',
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}
