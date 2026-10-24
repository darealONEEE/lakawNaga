import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppStore } from '../../store/appStore'
import { destinations } from '../../data/destinations'
import type { DestinationId } from '../../data/destinations'

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const categoryColors: Record<string, string> = {
  history: '#C29A51',
  food: '#B96848',
  faith: '#7B3038',
  nature: '#315B43',
}

function createDestinationIcon(color: string, icon: string) {
  return L.divIcon({
    html: `
      <div style="
        width:44px;height:44px;border-radius:50% 50% 50% 0;
        background:${color};border:3px solid #F5F0E5;
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 3px 10px rgba(0,0,0,0.35);
      ">
        <span style="transform:rotate(45deg);font-size:18px;line-height:1">${icon}</span>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -48],
    className: 'destination-marker-icon',
  })
}

function MapFlyTo() {
  const map = useMap()
  const { selectedDestination } = useAppStore()

  useEffect(() => {
    if (!selectedDestination) return
    const dest = destinations.find((d) => d.id === selectedDestination)
    if (dest) {
      map.flyTo([dest.coords.lat, dest.coords.lng], 15, { duration: 1.2, easeLinearity: 0.5 })
    }
  }, [selectedDestination, map])

  return null
}

export function GeoMap() {
  const { selectDestination } = useAppStore()

  return (
    <div className="geo-map-container">
      <MapContainer
        center={[13.6214, 123.1945]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFlyTo />

        {destinations.map((dest) => {
          const icon = createDestinationIcon(categoryColors[dest.category], dest.icon)
          return (
            <Marker
              key={dest.id}
              position={[dest.coords.lat, dest.coords.lng]}
              icon={icon}
              eventHandlers={{
                click: () => selectDestination(dest.id as DestinationId),
              }}
              aria-label={dest.name}
            >
              <Popup>
                <div style={{ fontFamily: 'system-ui', minWidth: 160 }}>
                  <strong style={{ fontFamily: 'Georgia, serif', display: 'block', marginBottom: 4 }}>
                    {dest.name}
                  </strong>
                  <span style={{ fontSize: 12, color: '#7A736A' }}>{dest.tagline}</span>
                  <br />
                  <button
                    style={{
                      marginTop: 8, padding: '4px 10px', background: dest.color, color: '#F5F0E5',
                      border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}
                    onClick={() => selectDestination(dest.id as DestinationId)}
                  >
                    Explore →
                  </button>
                  <div style={{ fontSize: 10, color: '#B96848', marginTop: 6 }}>
                    Coords are approximate — verify before visiting.
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
