import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { kinalasEstablishments, kinalasCategories } from '../../data/kinalasEstablishments'

export function KinalasTrail() {
  const {
    activeView,
    kinalasFilter,
    setKinalasFilter,
    setActiveView,
    selectedDestination,
  } = useAppStore()

  const isOpen = activeView === 'food-trail' && selectedDestination === 'kinalas'

  const filtered = kinalasEstablishments.filter(
    (e) => kinalasFilter === 'all' || e.type === kinalasFilter
  )

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
                🍜 Kinalas Food Trail
              </h2>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
                Discover where Naga eats
              </p>
            </div>

            {/* Disclaimer */}
            <div className="kinalas-disclaimer">
              <p>
                <strong>Note:</strong> Establishment data below is sample/placeholder only. Verify current businesses,
                hours, and addresses through Naga City Tourism Office or Google Maps before your visit.
              </p>
            </div>

            {/* Category filters */}
            <div className="kinalas-categories" role="group" aria-label="Filter by type">
              {kinalasCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`kinalas-cat-btn${kinalasFilter === cat.id ? ' active' : ''}`}
                  onClick={() => setKinalasFilter(cat.id)}
                  aria-pressed={kinalasFilter === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="kinalas-list" role="list" aria-label="Establishments">
              {filtered.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  No establishments match this filter.
                </p>
              )}
              {filtered.map((est) => (
                <div key={est.id} className="kinalas-card" role="listitem" tabIndex={0}>
                  <div className="kinalas-card-top">
                    <span className="kinalas-card-name">{est.name}</span>
                    <span className="kinalas-price">{est.priceRange}</span>
                  </div>
                  <div className="kinalas-card-area">{est.area} · {est.type}</div>
                  <div className="kinalas-card-known">{est.knownFor}</div>
                  <div className="kinalas-card-note">{est.note}</div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
