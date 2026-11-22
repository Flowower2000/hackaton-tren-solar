import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const JUJUY_CENTER: [number, number] = [-23.3, -65.4]
const JUJUY_ZOOM = 7
const POINT_ZOOM = 12

interface Props {
  point?: { lat: number; lng: number }
  onPick: (lat: number, lng: number) => void
}

function FollowPoint({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap()
  useEffect(() => {
    if (lat === undefined || lng === undefined) return
    map.flyTo([lat, lng], Math.max(map.getZoom(), POINT_ZOOM), { duration: 0.5 })
  }, [map, lat, lng])
  return null
}

function PickOnClick({ onPick }: { onPick: Props['onPick'] }) {
  useMapEvents({ click: event => onPick(event.latlng.lat, event.latlng.lng) })
  return null
}

/** Mapa chico para previsualizar la ubicación del reporte; un clic elige el punto. */
export function LocationPreview({ point, onPick }: Props) {
  return (
    <MapContainer
      center={JUJUY_CENTER}
      zoom={JUJUY_ZOOM}
      scrollWheelZoom={false}
      className="h-56 w-full rounded-md"
      aria-label="Vista previa de la ubicación del reporte"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {point && (
        <CircleMarker center={[point.lat, point.lng]} radius={9}
          pathOptions={{ color: '#065f46', fillColor: '#059669', fillOpacity: 0.7, weight: 3 }} />
      )}
      <FollowPoint lat={point?.lat} lng={point?.lng} />
      <PickOnClick onPick={onPick} />
    </MapContainer>
  )
}
