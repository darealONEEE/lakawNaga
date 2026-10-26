import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { kinalasSpots } from '../../data/kinalasEstablishments'

export function KinalasTrail() {
  const { activeView, setActiveView, selectedDestination } = useAppStore()

  const isOpen = activeView === 'food-trail' && selectedDestination === 'kinalas'

  return (
    <div className="kinalas-overlay" aria-hidden={!isOpen}>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="kinalas-panel"
            role="complementary"
            aria-label="Kinalas Food Trail"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 38 }}
          >
            {/* Header */}
            <div className="kinalas-header">
              <button
                className="journal-back-btn"
                onClick={() => setActiveView('travel-journal')}
                aria-label="Back to Kinalas destination page"
              >
                ← Kinalas Heritage
              </button>
              <h2 className="journal-title" style={{ fontFamily: 'var(--font-serif)' }}>
                🍜 Best Kinalas in Naga
              </h2>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
                Where the city goes for a bowl
              </p>
            </div>

            {/* Note */}
            <div className="kinalas-disclaimer">
              <p>
                Spots listed are known local favorites. Hours and exact locations change — confirm via Google Maps or the
                <strong> Naga City Tourism Office</strong> before your visit.
              </p>
            </div>

            {/* Simple list */}
            <div className="kinalas-list" role="list" aria-label="Kinalas spots">
              {kinalasSpots.map((spot) => (
                <div key={spot.id} className="kinalas-card kinalas-card--simple" role="listitem" tabIndex={0}>
                  <div className="kinalas-card-top">
                    <span className="kinalas-card-name">{spot.name}</span>
                  </div>
                  <div className="kinalas-card-area">📍 {spot.area}</div>
                  <div className="kinalas-card-known">{spot.knownFor}</div>
                  <div className="kinalas-card-note">{spot.note}</div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
