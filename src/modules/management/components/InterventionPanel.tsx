import { useState, type FormEvent } from 'react'
import type { EnvironmentalReport, Intervention } from '../../../shared/types'
import { formatDate, statusLabels } from '../labels'

interface Props {
  report: EnvironmentalReport
  interventions: Intervention[]
  onAdd: (input: { action: string; notes?: string }, markInProgress: boolean) => void
  onClose: () => void
}

export function InterventionPanel({ report, interventions, onAdd, onClose }: Props) {
  const [action, setAction] = useState('')
  const [notes, setNotes] = useState('')
  const canAdvance = report.status === 'new' || report.status === 'reviewing'
  const [markInProgress, setMarkInProgress] = useState(true)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (action.trim() === '') return
    onAdd({ action: action.trim(), notes: notes.trim() || undefined }, canAdvance && markInProgress)
    setAction('')
    setNotes('')
  }

  return (
    <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase text-slate-500">Intervenciones</p>
          <h3 className="font-semibold">{report.title}</h3>
          <p className="text-xs text-slate-500">Estado: {statusLabels[report.status]}</p>
        </div>
        <button type="button" className="text-sm text-slate-500 hover:text-slate-900" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      <form className="space-y-2" onSubmit={submit}>
        <label className="flex flex-col gap-1 text-sm">
          Acción realizada *
          <input className="rounded-md border border-slate-300 px-2 py-1.5" required value={action}
            onChange={event => setAction(event.target.value)} placeholder="Ej.: inspección en el lugar" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Notas
          <textarea className="rounded-md border border-slate-300 px-2 py-1.5" rows={2} value={notes}
            onChange={event => setNotes(event.target.value)} />
        </label>
        {canAdvance && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={markInProgress} onChange={event => setMarkInProgress(event.target.checked)} />
            Pasar el reporte a “{statusLabels.in_progress}”
          </label>
        )}
        <button type="submit" className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
          disabled={action.trim() === ''}>
          Registrar intervención
        </button>
      </form>
      {interventions.length === 0
        ? <p className="text-sm text-slate-500">Sin intervenciones registradas.</p>
        : (
          <ol className="space-y-2">
            {[...interventions].reverse().map(intervention => (
              <li key={intervention.id} className="border-l-2 border-emerald-500 pl-3 text-sm">
                <p className="font-medium">{intervention.action}</p>
                {intervention.notes && <p className="text-slate-600">{intervention.notes}</p>}
                <p className="text-xs text-slate-500">{formatDate(intervention.createdAt)}</p>
              </li>
            ))}
          </ol>
        )}
    </aside>
  )
}
