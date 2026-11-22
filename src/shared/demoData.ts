import type { EnvironmentalReport, MonitoredZone } from './types'

export const demoReports: EnvironmentalReport[] = [
  { id: 'demo-1', title: 'Residuos en margen de río', description: 'Caso de ejemplo para la demostración.', category: 'waste', location: { lat: -24.191, lng: -65.297, label: 'San Salvador de Jujuy' }, priority: 'medium', status: 'new', createdAt: '2026-11-22T12:00:00.000Z' },
]
export const demoZones: MonitoredZone[] = [
  { id: 'zone-1', name: 'Yungas', location: { lat: -23.76, lng: -64.83 }, indicator: 'Cobertura vegetal (índice demo)', previousValue: 73, currentValue: 69, unit: '%', observedAt: '2026-11-22T12:00:00.000Z', simulated: true },
  { id: 'zone-2', name: 'Quebrada de Humahuaca', location: { lat: -23.2, lng: -65.35 }, indicator: 'Cobertura vegetal (índice demo)', previousValue: 48, currentValue: 51, unit: '%', observedAt: '2026-11-22T12:00:00.000Z', simulated: true },
]
