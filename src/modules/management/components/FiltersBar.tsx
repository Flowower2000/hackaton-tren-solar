import type { ReportFilters } from '../stats'
import { emptyFilters } from '../stats'
import { categories, categoryLabels, priorities, priorityLabels, statuses, statusLabels } from '../labels'

interface Props { filters: ReportFilters; onChange: (filters: ReportFilters) => void }

const selectClass = 'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm'

export function FiltersBar({ filters, onChange }: Props) {
  const set = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => onChange({ ...filters, [key]: value })
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Buscar
        <input className={selectClass} type="search" placeholder="Título, descripción o lugar" value={filters.search}
          onChange={event => set('search', event.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Estado
        <select className={selectClass} value={filters.status} onChange={event => set('status', event.target.value as ReportFilters['status'])}>
          <option value="all">Todos</option>
          {statuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Prioridad
        <select className={selectClass} value={filters.priority} onChange={event => set('priority', event.target.value as ReportFilters['priority'])}>
          <option value="all">Todas</option>
          {priorities.map(priority => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Categoría
        <select className={selectClass} value={filters.category} onChange={event => set('category', event.target.value as ReportFilters['category'])}>
          <option value="all">Todas</option>
          {categories.map(category => <option key={category} value={category}>{categoryLabels[category]}</option>)}
        </select>
      </label>
      <button type="button" className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200" onClick={() => onChange(emptyFilters)}>
        Limpiar filtros
      </button>
    </div>
  )
}
