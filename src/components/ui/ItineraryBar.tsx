import { useAppStore } from '../../store/appStore'
import { destinationMap } from '../../data/destinations'

export function ItineraryBar() {
  const { itinerary, removeFromItinerary, clearItinerary } = useAppStore()

  if (itinerary.length === 0) return null

  const mapsUrl = (() => {
    const stops = itinerary.map((s) => {
      const d = destinationMap[s.destinationId]
      return `${d.coords.lat},${d.coords.lng}`
    })
    if (stops.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${stops[0]}`
    }
    const origin = stops[0]
    const destination = stops[stops.length - 1]
    const waypoints = stops.slice(1, -1).join('|')
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}`
  })()

  return (
    <div className="itinerary-bar" role="region" aria-label="My itinerary">
      <div className="itinerary-stops" aria-label="Itinerary stops">
        {itinerary.map((stop) => {
          const dest = destinationMap[stop.destinationId]
          return (
            <div key={stop.destinationId} className="itinerary-stop-chip">
              <span aria-hidden="true">{dest.icon}</span>
              <span>{dest.name.split(' ').slice(0, 2).join(' ')}</span>
              <button
                className="itinerary-stop-remove"
                onClick={() => removeFromItinerary(stop.destinationId)}
                aria-label={`Remove ${dest.name} from itinerary`}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="itinerary-directions-btn"
        aria-label="Open route in Google Maps"
      >
        Directions
      </a>

      <button
        className="itinerary-clear-btn"
        onClick={clearItinerary}
        aria-label="Clear itinerary"
      >
        ✕
      </button>
    </div>
  )
}
