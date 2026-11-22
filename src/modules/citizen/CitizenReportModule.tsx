import { useState, type ChangeEvent, type FormEvent } from 'react'
import { createReport, getReports } from '../../shared/repository'
import type { EnvironmentalReport, Priority, ReportCategory } from '../../shared/types'
import { approximateKilobytes, compressPhoto, isQuotaError, PhotoError } from './photo'
import {
  CATEGORY_LABELS, DESCRIPTION_MAX, TITLE_MAX, draftCoordinates, emptyDraft, validateDraft,
  type DraftErrors, type ReportDraft,
} from './validation'

/** Prioridad inicial sugerida; Gestión la puede cambiar después. */
const INITIAL_PRIORITY: Record<ReportCategory, Priority> = {
  fire: 'high', water: 'medium', deforestation: 'medium', waste: 'medium', other: 'low',
}

type LocationState = { kind: 'idle' } | { kind: 'locating' } | { kind: 'error'; message: string }

const inputClass = 'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600'
const errorClass = 'mt-1 text-sm text-red-700'

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className={errorClass}>{message}</p> : null
}

export default function CitizenReportModule() {
  const [draft, setDraft] = useState<ReportDraft>(emptyDraft)
  const [errors, setErrors] = useState<DraftErrors>({})
  const [photo, setPhoto] = useState<string | undefined>()
  const [photoError, setPhotoError] = useState<string | undefined>()
  const [processingPhoto, setProcessingPhoto] = useState(false)
  const [locationState, setLocationState] = useState<LocationState>({ kind: 'idle' })
  const [submitError, setSubmitError] = useState<string | undefined>()
  const [lastCreated, setLastCreated] = useState<EnvironmentalReport | undefined>()
  const [reports, setReports] = useState<EnvironmentalReport[]>(() => getReports())

  function update<K extends keyof ReportDraft>(field: K, value: ReportDraft[K]) {
    setDraft(current => ({ ...current, [field]: value }))
    setLastCreated(undefined)
  }

  function requestCurrentLocation() {
    if (!('geolocation' in navigator)) {
      setLocationState({ kind: 'error', message: 'Tu navegador no permite obtener la ubicación. Cargá las coordenadas a mano.' })
      return
    }
    setLocationState({ kind: 'locating' })
    navigator.geolocation.getCurrentPosition(
      position => {
        setDraft(current => ({ ...current, lat: position.coords.latitude.toFixed(5), lng: position.coords.longitude.toFixed(5) }))
        setLocationState({ kind: 'idle' })
        setErrors(current => ({ ...current, location: undefined }))
      },
      () => setLocationState({ kind: 'error', message: 'No pudimos obtener tu ubicación. Revisá el permiso o cargá las coordenadas a mano.' }),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    )
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    setPhotoError(undefined)
    if (!file) return
    setProcessingPhoto(true)
    try {
      setPhoto(await compressPhoto(file))
    } catch (error) {
      setPhoto(undefined)
      setPhotoError(error instanceof PhotoError ? error.message : 'No se pudo procesar la foto.')
    } finally {
      setProcessingPhoto(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(undefined)
    const validation = validateDraft(draft)
    setErrors(validation)
    if (Object.keys(validation).length > 0 || draft.category === '') return

    const { lat, lng } = draftCoordinates(draft)
    const label = draft.label.trim()
    try {
      const report = createReport({
        title: draft.title.trim(),
        description: draft.description.trim(),
        category: draft.category,
        location: label ? { lat, lng, label } : { lat, lng },
        priority: INITIAL_PRIORITY[draft.category],
        status: 'new',
        ...(photo ? { photoDataUrl: photo } : {}),
      })
      setLastCreated(report)
      setReports(getReports())
      setDraft(emptyDraft)
      setPhoto(undefined)
      setErrors({})
    } catch (error) {
      setSubmitError(isQuotaError(error)
        ? 'No hay espacio en este navegador para guardar el reporte. Quitá la foto e intentá de nuevo.'
        : 'No se pudo guardar el reporte. Intentá de nuevo.')
    }
  }

  const recent = [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <section className="mx-auto max-w-2xl space-y-6" aria-labelledby="citizen-title">
      <header>
        <h2 id="citizen-title" className="text-2xl font-bold">Reportar un problema ambiental</h2>
        <p className="mt-1 text-sm text-slate-600">Contanos qué viste y dónde. Los reportes se guardan en este navegador (prototipo de demostración).</p>
      </header>

      {lastCreated && (
        <div role="status" className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          Reporte «{lastCreated.title}» guardado. Queda pendiente de revisión.
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label htmlFor="citizen-report-title" className="text-sm font-medium">Título *</label>
          <input id="citizen-report-title" className={inputClass} value={draft.title} maxLength={TITLE_MAX}
            onChange={e => update('title', e.target.value)} aria-invalid={!!errors.title} aria-describedby="citizen-report-title-error"
            placeholder="Ej.: Basural junto al río Grande" />
          <FieldError id="citizen-report-title-error" message={errors.title} />
        </div>

        <div>
          <label htmlFor="citizen-report-category" className="text-sm font-medium">Categoría *</label>
          <select id="citizen-report-category" className={inputClass} value={draft.category}
            onChange={e => update('category', e.target.value as ReportDraft['category'])} aria-invalid={!!errors.category} aria-describedby="citizen-report-category-error">
            <option value="">Elegí una opción</option>
            {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map(key => <option key={key} value={key}>{CATEGORY_LABELS[key]}</option>)}
          </select>
          <FieldError id="citizen-report-category-error" message={errors.category} />
        </div>

        <div>
          <label htmlFor="citizen-report-description" className="text-sm font-medium">Descripción *</label>
          <textarea id="citizen-report-description" rows={4} className={inputClass} value={draft.description} maxLength={DESCRIPTION_MAX}
            onChange={e => update('description', e.target.value)} aria-invalid={!!errors.description} aria-describedby="citizen-report-description-error"
            placeholder="Qué observaste, desde cuándo, qué tan extendido está…" />
          <div className="flex justify-between">
            <FieldError id="citizen-report-description-error" message={errors.description} />
            <span className="ml-auto mt-1 text-xs text-slate-500">{draft.description.trim().length}/{DESCRIPTION_MAX}</span>
          </div>
        </div>

        <fieldset aria-describedby="citizen-report-location-error">
          <legend className="text-sm font-medium">Ubicación *</legend>
          <button type="button" onClick={requestCurrentLocation} disabled={locationState.kind === 'locating'}
            className="mt-2 rounded-md border border-emerald-700 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-60">
            {locationState.kind === 'locating' ? 'Obteniendo ubicación…' : 'Usar mi ubicación actual'}
          </button>
          {locationState.kind === 'error' && <p className="mt-1 text-sm text-amber-800">{locationState.message}</p>}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="citizen-report-lat" className="text-xs text-slate-600">Latitud</label>
              <input id="citizen-report-lat" inputMode="decimal" className={inputClass} value={draft.lat}
                onChange={e => update('lat', e.target.value)} aria-invalid={!!errors.location} placeholder="-24.19100" />
            </div>
            <div>
              <label htmlFor="citizen-report-lng" className="text-xs text-slate-600">Longitud</label>
              <input id="citizen-report-lng" inputMode="decimal" className={inputClass} value={draft.lng}
                onChange={e => update('lng', e.target.value)} aria-invalid={!!errors.location} placeholder="-65.29700" />
            </div>
          </div>
          <div className="mt-3">
            <label htmlFor="citizen-report-label" className="text-xs text-slate-600">Referencia del lugar (opcional)</label>
            <input id="citizen-report-label" className={inputClass} value={draft.label} maxLength={80}
              onChange={e => update('label', e.target.value)} placeholder="Ej.: Puente Lavalle, Tilcara" />
            <FieldError id="citizen-report-label-error" message={errors.label} />
          </div>
          <FieldError id="citizen-report-location-error" message={errors.location} />
        </fieldset>

        <div>
          <label htmlFor="citizen-report-photo" className="text-sm font-medium">Foto (opcional)</label>
          <input id="citizen-report-photo" type="file" accept="image/*" capture="environment" onChange={handlePhoto}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm" />
          <p className="mt-1 text-xs text-slate-500">Se reduce automáticamente para que ocupe poco espacio.</p>
          {processingPhoto && <p className="mt-1 text-sm text-slate-600">Procesando foto…</p>}
          <FieldError id="citizen-report-photo-error" message={photoError} />
          {photo && (
            <div className="mt-2 flex items-start gap-3">
              <img src={photo} alt="Vista previa de la foto adjunta" className="h-24 w-24 rounded-md object-cover" />
              <div className="text-xs text-slate-600">
                <p>≈ {approximateKilobytes(photo)} KB</p>
                <button type="button" onClick={() => setPhoto(undefined)} className="mt-1 text-red-700 underline">Quitar foto</button>
              </div>
            </div>
          )}
        </div>

        {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}

        <button type="submit" disabled={processingPhoto}
          className="w-full rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          Enviar reporte
        </button>
      </form>

      <section aria-labelledby="citizen-recent-title">
        <h3 id="citizen-recent-title" className="text-lg font-semibold">Últimos reportes</h3>
        {recent.length === 0
          ? <p className="mt-2 text-sm text-slate-600">Todavía no hay reportes.</p>
          : (
            <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {recent.map(report => (
                <li key={report.id} className="flex gap-3 p-3 text-sm">
                  {report.photoDataUrl && <img src={report.photoDataUrl} alt="" className="h-12 w-12 rounded object-cover" />}
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-slate-600">
                      {CATEGORY_LABELS[report.category]} · {report.location.label ?? `${report.location.lat.toFixed(3)}, ${report.location.lng.toFixed(3)}`} · {new Date(report.createdAt).toLocaleString('es-AR')}
                      {report.id.startsWith('demo-') && ' · dato demostrativo'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </section>
    </section>
  )
}
