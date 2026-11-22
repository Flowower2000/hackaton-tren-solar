import type { ReportStats } from '../stats'
import { statusLabels, statusStyles, statuses } from '../labels'

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}

export function StatsPanel({ stats }: { stats: ReportStats }) {
  return (
    <section aria-label="Estadísticas" className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label="Reportes" value={stats.total} />
        <Metric label="Abiertos" value={stats.open} />
        <Metric label="Urgentes abiertos" value={stats.urgentOpen} />
        <Metric label="Resueltos" value={`${stats.resolvedRate}%`} />
        <Metric label="Intervenciones" value={stats.interventions} />
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200" title="Reportes por estado">
        {statuses.map(status => stats.byStatus[status] > 0 && (
          <div key={status} className={statusStyles[status].split(' ')[0]} style={{ width: `${(stats.byStatus[status] / stats.total) * 100}%` }} />
        ))}
      </div>
      <ul className="flex flex-wrap gap-2 text-xs">
        {statuses.map(status => (
          <li key={status} className={`rounded-full px-2 py-0.5 ${statusStyles[status]}`}>
            {statusLabels[status]}: {stats.byStatus[status]}
          </li>
        ))}
      </ul>
    </section>
  )
}
