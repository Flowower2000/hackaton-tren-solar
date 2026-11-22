import type { EnvironmentalReport, Intervention } from '../../../shared/types'
import {
  categories, categoryLabels, formatDate, priorities, priorityLabels, statuses, statusLabels,
} from '../labels'
import { computeStats, sortByUrgency } from '../stats'

interface Props { reports: EnvironmentalReport[]; interventions: Intervention[]; filtered: boolean }

function CountTable<K extends string>({ title, keys, labels, counts }: {
  title: string; keys: K[]; labels: Record<K, string>; counts: Record<K, number>
}) {
  return (
    <table className="w-full text-sm">
      <caption className="mb-1 text-left font-semibold">{title}</caption>
      <tbody>
        {keys.map(key => (
          <tr key={key} className="border-t border-slate-100">
            <td className="py-1">{labels[key]}</td>
            <td className="py-1 text-right tabular-nums">{counts[key]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ReportSummary({ reports, interventions, filtered }: Props) {
  const stats = computeStats(reports, interventions)
  const ids = new Set(reports.map(report => report.id))
  const titles = new Map(reports.map(report => [report.id, report.title]))
  const pending = sortByUrgency(reports.filter(report => report.status !== 'resolved'))
  const recent = interventions.filter(intervention => ids.has(intervention.reportId)).slice(-5).reverse()

  return (
    <article className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Informe de gestión ambiental</h2>
          <p className="text-sm text-slate-500">
            Generado el {formatDate(new Date().toISOString())} · {stats.total} reportes{filtered ? ' (según filtros aplicados)' : ''} · datos demostrativos
          </p>
        </div>
        <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 print:hidden" onClick={() => window.print()}>
          Imprimir
        </button>
      </header>
      <p className="text-sm">
        Hay <strong>{stats.open}</strong> reportes abiertos, de los cuales <strong>{stats.urgentOpen}</strong> tienen prioridad alta o crítica.
        Se resolvió el <strong>{stats.resolvedRate}%</strong> de los casos y se registraron <strong>{stats.interventions}</strong> intervenciones.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        <CountTable title="Por estado" keys={statuses} labels={statusLabels} counts={stats.byStatus} />
        <CountTable title="Por prioridad" keys={priorities} labels={priorityLabels} counts={stats.byPriority} />
        <CountTable title="Por categoría" keys={categories} labels={categoryLabels} counts={stats.byCategory} />
      </div>
      <section>
        <h3 className="mb-1 font-semibold">Pendientes por urgencia</h3>
        {pending.length === 0
          ? <p className="text-sm text-slate-500">No hay reportes pendientes.</p>
          : (
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {pending.map(report => (
                <li key={report.id}>
                  {report.title} — {priorityLabels[report.priority]}, {statusLabels[report.status].toLowerCase()} ({categoryLabels[report.category]})
                </li>
              ))}
            </ol>
          )}
      </section>
      <section>
        <h3 className="mb-1 font-semibold">Últimas intervenciones</h3>
        {recent.length === 0
          ? <p className="text-sm text-slate-500">Todavía no hay intervenciones.</p>
          : (
            <ul className="space-y-1 text-sm">
              {recent.map(intervention => (
                <li key={intervention.id}>
                  {formatDate(intervention.createdAt)} · {titles.get(intervention.reportId)}: {intervention.action}
                </li>
              ))}
            </ul>
          )}
      </section>
    </article>
  )
}
