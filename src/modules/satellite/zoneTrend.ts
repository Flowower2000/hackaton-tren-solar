import type { MonitoredZone } from '../../shared/types'

export type Trend = 'up' | 'down' | 'stable'

export interface ZoneChange {
  delta: number
  percentChange: number | null
  trend: Trend
}

export function getZoneChange(zone: MonitoredZone): ZoneChange {
  const delta = zone.currentValue - zone.previousValue
  const percentChange = zone.previousValue === 0 ? null : (delta / zone.previousValue) * 100
  const trend: Trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable'
  return { delta, percentChange, trend }
}

export const trendLabel: Record<Trend, string> = { up: 'Aumentó', down: 'Disminuyó', stable: 'Sin cambios' }
export const trendSymbol: Record<Trend, string> = { up: '▲', down: '▼', stable: '■' }
export const trendColor: Record<Trend, string> = { up: '#059669', down: '#d97706', stable: '#64748b' }

const numberFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })
const dateFormat = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'America/Argentina/Jujuy' })

export function formatValue(value: number, unit: string): string {
  return `${numberFormat.format(value)} ${unit}`.trim()
}

export function formatDelta(change: ZoneChange, unit: string): string {
  const sign = change.delta > 0 ? '+' : ''
  const percent = change.percentChange === null ? '' : ` (${sign}${numberFormat.format(change.percentChange)} %)`
  return `${sign}${formatValue(change.delta, unit)}${percent}`
}

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso))
}
