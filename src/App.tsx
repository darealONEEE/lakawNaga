import { Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/appStore'
import { CityMap } from './components/map/CityMap'
import { Header } from './components/ui/Header'
import { DestinationNav } from './components/ui/DestinationNav'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { DestinationSearch } from './components/ui/DestinationSearch'
import { ItineraryBar } from './components/ui/ItineraryBar'
import { TravelJournal } from './components/travel/TravelJournal'
import { KinalasTrail } from './components/travel/KinalasTrail'
import { RobredoMuseum } from './components/museum/RobredoMuseum'
import { destinations } from './data/destinations'
import type { DestinationId } from './data/destinations'

// Lazy-load GeoMap to avoid bundling Leaflet into the main chunk
import { lazy } from 'react'
const GeoMap = lazy(() => import('./components/map/GeoMap').then((m) => ({ default: m.GeoMap })))

// Accessible fallback for users without WebGL
function AccessibleFallback() {
  const { selectDestination } = useAppStore()

  return (
    <div className="accessible-map" role="main">
      <h2>LAKAW NAGA — Explore Naga City</h2>
      <p style={{ marginBottom: 'var(--space-6)', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
        Select a destination to explore its heritage and community story.
      </p>
      <div className="accessible-destination-grid">
        {destinations.map((d) => (
          <button
            key={d.id}
            className="accessible-destination-card"
            onClick={() => selectDestination(d.id as DestinationId)}
            style={{ borderColor: 'transparent' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }} aria-hidden="true">{d.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-1)', color: d.color }}>{d.name}</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{d.tagline}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { mapMode, activeView, isLoading, searchOpen, itinerary } = useAppStore()

  return (
    <div className="app-container">
      <LoadingScreen />

      {/* 3D scene always mounted; geo map shown on top when mode = 'geo' */}
      <div className="scene-container">
        <Suspense fallback={<AccessibleFallback />}>
          <CityMap />
        </Suspense>

        <AnimatePresence>
          {mapMode === 'geo' && (
            <Suspense fallback={null}>
              <GeoMap />
            </Suspense>
          )}
        </AnimatePresence>
      </div>

      {/* Header (brand + breadcrumb + controls) */}
      <Header />

      {/* Destination navigation bar (bottom) */}
      {!isLoading && <DestinationNav />}

      {/* Hint */}
      {!isLoading && mapMode === '3d' && activeView === 'map' && (
        <div className="hint-overlay" aria-hidden="true">
          <span className="hint-text">Click a zone to explore · Drag to pan</span>
        </div>
      )}

      {/* Travel journal slide-in panel */}
      <TravelJournal />

      {/* Museum panel */}
      <RobredoMuseum />

      {/* Food trail panel */}
      <KinalasTrail />

      {/* Itinerary bar (shown when stops added) */}
      {itinerary.length > 0 && <ItineraryBar />}

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <DestinationSearch />}
      </AnimatePresence>
    </div>
  )
}
