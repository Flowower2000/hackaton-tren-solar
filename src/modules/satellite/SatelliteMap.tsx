import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MonitoredZone } from '../../shared/types'
import { formatDelta, formatValue, getZoneChange, trendColor, trendLabel } from './zoneTrend'

const JUJUY_CENTER: [number, number] = [-23.3, -65.4]

interface Props {
  zones: MonitoredZone[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function FocusSelected({ zone }: { zone: MonitoredZone | undefined }) {
  const map = useMap()
  useEffect(() => {
    if (zone) map.flyTo([zone.location.lat, zone.location.lng], Math.max(map.getZoom(), 8), { duration: 0.6 })
  }, [map, zone])
  return null
}

export function SatelliteMap({ zones, selectedId, onSelect }: Props) {
  const selected = zones.find(zone => zone.id === selectedId)
  return (
    <MapContainer center={JUJUY_CENTER} zoom={7} scrollWheelZoom className="h-[420px] w-full rounded-lg" aria-label="Mapa de zonas monitoreadas en Jujuy">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {zones.map(zone => {
        const change = getZoneChange(zone)
        const isSelected = zone.id === selectedId
        return (
          <CircleMarker
            key={zone.id}
            center={[zone.location.lat, zone.location.lng]}
            radius={isSelected ? 14 : 10}
            pathOptions={{ color: trendColor[change.trend], fillColor: trendColor[change.trend], fillOpacity: 0.6, weight: isSelected ? 4 : 2 }}
            eventHandlers={{ click: () => onSelect(zone.id) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>{zone.name}</Tooltip>
            <Popup>
              <strong>{zone.name}</strong>
              <br />
              {zone.indicator}
              <br />
              Anterior: {formatValue(zone.previousValue, zone.unit)} · Actual: {formatValue(zone.currentValue, zone.unit)}
              <br />
              {trendLabel[change.trend]}: {formatDelta(change, zone.unit)}
              <br />
              <em>Dato simulado</em>
            </Popup>
          </CircleMarker>
        )
      })}
      <FocusSelected zone={selected} />
    </MapContainer>
  )
}
