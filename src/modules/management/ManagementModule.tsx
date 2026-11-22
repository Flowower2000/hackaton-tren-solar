import { useMemo, useState } from 'react'
import { FiltersBar } from './components/FiltersBar'
import { InterventionPanel } from './components/InterventionPanel'
import { ReportCard } from './components/ReportCard'
import { ReportSummary } from './components/ReportSummary'
import { StatsPanel } from './components/StatsPanel'
import { computeStats, emptyFilters, filterReports, sortByUrgency, type ReportFilters } from './stats'
import { useManagementData } from './useManagementData'

type View = 'reports' | 'summary'

export function ManagementModule() {
  const { reports, interventions, changeReport, addIntervention } = useManagementData()
  const [filters, setFilters] = useState<ReportFilters>(emptyFilters)
  const [view, setView] = useState<View>('reports')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const visible = useMemo(() => sortByUrgency(filterReports(reports, filters)), [reports, filters])
  const stats = useMemo(() => computeStats(reports, interventions), [reports, interventions])
  const selected = reports.find(report => report.id === selectedId)
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(emptyFilters)
  const interventionsOf = (reportId: string) => interventions.filter(intervention => intervention.reportId === reportId)

  const tabClass = (tab: View) =>
    `rounded-md px-3 py-1.5 text-sm ${view === tab ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'}`

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Gestión de alertas e informes</h2>
          <p className="text-sm text-slate-500">Seguimiento de reportes ciudadanos e intervenciones. Incluye datos demostrativos.</p>
        </div>
        <nav className="flex gap-1 print:hidden">
          <button type="button" className={tabClass('reports')} onClick={() => setView('reports')}>Reportes</button>
          <button type="button" className={tabClass('summary')} onClick={() => setView('summary')}>Informe</button>
        </nav>
      </header>

      <StatsPanel stats={stats} />

      <div className="print:hidden">
        <FiltersBar filters={filters} onChange={setFilters} />
        <p className="mt-2 text-xs text-slate-500">Mostrando {visible.length} de {reports.length} reportes.</p>
      </div>

      {view === 'summary'
        ? <ReportSummary reports={visible} interventions={interventions} filtered={isFiltered} />
        : (
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {visible.length === 0
              ? <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No hay reportes que coincidan con los filtros.</p>
              : (
                <ul className="space-y-3">
                  {visible.map(report => (
                    <ReportCard key={report.id} report={report} selected={report.id === selectedId}
                      interventionCount={interventionsOf(report.id).length}
                      onSelect={() => setSelectedId(report.id)}
                      onChange={changes => changeReport(report.id, changes)} />
                  ))}
                </ul>
              )}
            {selected && (
              <InterventionPanel key={selected.id} report={selected} interventions={interventionsOf(selected.id)}
                onClose={() => setSelectedId(null)}
                onAdd={(input, markInProgress) => {
                  addIntervention({ reportId: selected.id, ...input })
                  if (markInProgress) changeReport(selected.id, { status: 'in_progress' })
                }} />
            )}
          </div>
        )}
    </section>
  )
}
