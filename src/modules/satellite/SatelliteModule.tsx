import { useMemo, useState } from 'react'
import { getZones } from '../../shared/repository'
import { SatelliteMap } from './SatelliteMap'
import { SimulatedBadge } from './SimulatedBadge'
import { ZoneComparison } from './ZoneComparison'

export function SatelliteModule() {
  const zones = useMemo(() => getZones(), [])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <section className="space-y-4" aria-labelledby="satellite-title">
      <header className="flex flex-wrap items-center gap-3">
        <h2 id="satellite-title" className="text-2xl font-bold">Monitoreo satelital</h2>
        <SimulatedBadge />
      </header>
      <p className="text-sm text-slate-600">
        Comparación entre la observación anterior y la actual de cada zona. Los valores son demostrativos, no provienen de imágenes satelitales reales.
      </p>
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <SatelliteMap zones={zones} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <ZoneComparison zones={zones} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </section>
  )
}
