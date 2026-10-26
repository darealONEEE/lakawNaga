import { useAppStore } from '../../store/appStore'
import { destinations } from '../../data/destinations'

const categoryColors: Record<string, string> = {
  history: '#C29A51',
  food: '#B96848',
  faith: '#7B3038',
  nature: '#315B43',
}

export function DestinationNav() {
  const { selectedDestination, selectDestination } = useAppStore()

  return (
    <nav className="destination-nav" aria-label="Destinations">
      <div className="destination-nav-row">
        {destinations.map((dest) => {
          const isActive = selectedDestination === dest.id
          return (
            <button
              key={dest.id}
              className={`destination-btn${isActive ? ' active' : ''}`}
              onClick={() => selectDestination(isActive ? null : dest.id)}
              style={{
                borderColor: isActive ? dest.color : undefined,
              }}
              aria-pressed={isActive}
              aria-label={`${dest.name} — ${dest.tagline}`}
            >
              <span
                className="destination-btn-category"
                style={{ color: categoryColors[dest.category] }}
              >
                {dest.category}
              </span>
              <span className="destination-btn-name">{dest.name.split(' ').slice(0, 3).join(' ')}</span>
              <span className="destination-btn-sub">{dest.tagline}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
