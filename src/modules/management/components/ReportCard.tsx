import type { EnvironmentalReport, Priority, ReportStatus } from '../../../shared/types'
import { categoryLabels, formatDate, priorities, priorityLabels, priorityStyles, statuses, statusLabels, statusStyles } from '../labels'

interface Props {
  report: EnvironmentalReport
  interventionCount: number
  selected: boolean
  onSelect: () => void
  onChange: (changes: { status?: ReportStatus; priority?: Priority }) => void
}

export function ReportCard({ report, interventionCount, selected, onSelect, onChange }: Props) {
  return (
    <li className={`rounded-lg border bg-white p-4 ${selected ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{report.title}</h3>
          <p className="text-xs text-slate-500">
            {categoryLabels[report.category]} · {report.location.label ?? `${report.location.lat.toFixed(3)}, ${report.location.lng.toFixed(3)}`} · {formatDate(report.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 ${priorityStyles[report.priority]}`}>{priorityLabels[report.priority]}</span>
          <span className={`rounded-full px-2 py-0.5 ${statusStyles[report.status]}`}>{statusLabels[report.status]}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-700">{report.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1">
          Estado
          <select className="rounded-md border border-slate-300 px-2 py-1" value={report.status}
            onChange={event => onChange({ status: event.target.value as ReportStatus })}>
            {statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1">
          Prioridad
          <select className="rounded-md border border-slate-300 px-2 py-1" value={report.priority}
            onChange={event => onChange({ priority: event.target.value as Priority })}>
            {priorities.map(priority => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
          </select>
        </label>
        <button type="button" className="ml-auto rounded-md bg-slate-800 px-3 py-1 text-white hover:bg-slate-700" onClick={onSelect}>
          Intervenciones ({interventionCount})
        </button>
      </div>
    </li>
  )
}
