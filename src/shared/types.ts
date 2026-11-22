export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type ReportStatus = 'new' | 'reviewing' | 'in_progress' | 'resolved'
export type ReportCategory = 'fire' | 'waste' | 'water' | 'deforestation' | 'other'

export interface Location { lat: number; lng: number; label?: string }
export interface EnvironmentalReport {
  id: string
  title: string
  description: string
  category: ReportCategory
  location: Location
  priority: Priority
  status: ReportStatus
  photoDataUrl?: string
  createdAt: string
}
export interface MonitoredZone {
  id: string
  name: string
  location: Location
  indicator: string
  currentValue: number
  previousValue: number
  unit: string
  observedAt: string
  simulated: true
}
export interface Intervention { id: string; reportId: string; action: string; notes?: string; createdAt: string }
