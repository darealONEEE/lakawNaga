import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { destinationMap } from '../../data/destinations'

const categoryColors: Record<string, { bg: string; text: string }> = {
  history:  { bg: 'rgba(194,154,81,0.15)', text: '#C29A51' },
  food:     { bg: 'rgba(185,104,72,0.15)', text: '#B96848' },
  faith:    { bg: 'rgba(123,48,56,0.15)',  text: '#7B3038' },
  nature:   { bg: 'rgba(49,91,67,0.15)',   text: '#315B43' },
  landmark: { bg: 'rgba(123,48,56,0.12)',  text: '#7B3038' },
}

export function TravelJournal() {
  const {
    selectedDestination,
    activeView,
    closeDestination,
    setActiveView,
  } = useAppStore()

  const isOpen =
    selectedDestination !== null &&
    (activeView === 'travel-journal' || activeView === 'food-trail')

  const dest = selectedDestination ? destinationMap[selectedDestination] : null
  const colors = dest ? categoryColors[dest.category] : categoryColors.history

  const handleOpenMuseum = () => {
    if (selectedDestination === 'robredo') setActiveView('museum')
  }

  const handleOpenFoodTrail = () => {
    if (selectedDestination === 'kinalas') setActiveView('food-trail')
  }

  return (
    <div className="travel-journal-overlay" aria-hidden={!isOpen}>
      <AnimatePresence>
        {isOpen && dest && (
          <motion.aside
            className="travel-journal-panel"
            role="complementary"
            aria-label={`Travel journal: ${dest.name}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 38 }}
          >
            {/* Header */}
            <div className="journal-header">
              <button className="journal-back-btn" onClick={closeDestination} aria-label="Close destination panel">
                ← Back to map
              </button>
              <div
                className="journal-category-badge"
                style={{ background: colors.bg, color: colors.text }}
              >
                {dest.icon} {dest.category.charAt(0).toUpperCase() + dest.category.slice(1)}
              </div>
              <h2 className="journal-title">{dest.name}</h2>
              <p className="journal-tagline">{dest.tagline}</p>
            </div>

            {/* Body */}
            <div className="journal-body">
              {dest.image && (
                <div className="journal-dest-image-wrap">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="journal-dest-image"
                  />
                </div>
              )}
              <div className="journal-description">
                {dest.description.split('\n\n').map((block, i) => (
                  <p key={i} style={{ margin: i > 0 ? '0.75em 0 0' : '0', whiteSpace: 'pre-line' }}>
                    {block}
                  </p>
                ))}
              </div>

              {/* Highlights */}
              <div className="journal-highlights">
                <div className="journal-highlights-title">Highlights</div>
                <ul className="journal-highlight-list" aria-label="Destination highlights">
                  {dest.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Practical info */}
              <div className="journal-practical">
                <div className="journal-practical-label">Visitor Information</div>
                <p>{dest.practicalInfo}</p>
              </div>

              {/* Destination-specific call to action */}
              {selectedDestination === 'robredo' && (
                <button
                  className="journal-btn-primary"
                  onClick={handleOpenMuseum}
                  style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                >
                  Enter Virtual Museum →
                </button>
              )}
              {selectedDestination === 'kinalas' && (
                <button
                  className="journal-btn-primary"
                  onClick={handleOpenFoodTrail}
                  style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                >
                  Explore Food Trail →
                </button>
              )}
            </div>

            {/* Footer actions */}
            <div className="journal-actions">
              <button
                className="journal-btn-secondary"
                onClick={closeDestination}
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
