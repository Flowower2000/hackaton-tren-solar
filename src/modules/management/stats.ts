import type { EnvironmentalReport, Intervention, Priority, ReportCategory, ReportStatus } from '../../shared/types'
import { categories, priorities, statuses } from './labels'

export interface ReportFilters {
  status: ReportStatus | 'all'
  priority: Priority | 'all'
  category: ReportCategory | 'all'
  search: string
}

export const emptyFilters: ReportFilters = { status: 'all', priority: 'all', category: 'all', search: '' }

const priorityRank: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 }

export function filterReports(reports: EnvironmentalReport[], filters: ReportFilters): EnvironmentalReport[] {
  const search = filters.search.trim().toLowerCase()
  return reports.filter(report =>
    (filters.status === 'all' || report.status === filters.status) &&
    (filters.priority === 'all' || report.priority === filters.priority) &&
    (filters.category === 'all' || report.category === filters.category) &&
    (search === '' || [report.title, report.description, report.location.label ?? '']
      .some(text => text.toLowerCase().includes(search))),
  )
}

export function sortByUrgency(reports: EnvironmentalReport[]): EnvironmentalReport[] {
  return [...reports].sort((a, b) =>
    priorityRank[a.priority] - priorityRank[b.priority] || b.createdAt.localeCompare(a.createdAt))
}

function countBy<K extends string>(keys: K[], values: K[]): Record<K, number> {
  const counts = Object.fromEntries(keys.map(key => [key, 0])) as Record<K, number>
  values.forEach(value => { counts[value] += 1 })
  return counts
}

export interface ReportStats {
  total: number
  open: number
  urgentOpen: number
  resolvedRate: number
  interventions: number
  byStatus: Record<ReportStatus, number>
  byPriority: Record<Priority, number>
  byCategory: Record<ReportCategory, number>
}

export function computeStats(reports: EnvironmentalReport[], interventions: Intervention[]): ReportStats {
  const ids = new Set(reports.map(report => report.id))
  const open = reports.filter(report => report.status !== 'resolved')
  const resolved = reports.length - open.length
  return {
    total: reports.length,
    open: open.length,
    urgentOpen: open.filter(report => report.priority === 'high' || report.priority === 'critical').length,
    resolvedRate: reports.length === 0 ? 0 : Math.round((resolved / reports.length) * 100),
    interventions: interventions.filter(intervention => ids.has(intervention.reportId)).length,
    byStatus: countBy(statuses, reports.map(report => report.status)),
    byPriority: countBy(priorities, reports.map(report => report.priority)),
    byCategory: countBy(categories, reports.map(report => report.category)),
  }
}
