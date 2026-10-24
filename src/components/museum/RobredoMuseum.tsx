import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { museumExhibits } from '../../data/museumExhibits'

export function RobredoMuseum() {
  const { activeView, activeMuseumExhibit, setMuseumExhibit, setActiveView, selectedDestination } = useAppStore()

  const isOpen = activeView === 'museum' && selectedDestination === 'robredo'

  const activeExhibit =
    activeMuseumExhibit
      ? museumExhibits.find((e) => e.id === activeMuseumExhibit) ?? museumExhibits[0]
      : museumExhibits[0]

  return (
    <div className="museum-overlay" aria-hidden={!isOpen}>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="museum-panel"
            role="complementary"
            aria-label="Jesse M. Robredo Virtual Museum"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 38 }}
          >
            {/* Header */}
            <div className="museum-header">
              <button
                className="museum-back"
                onClick={() => setActiveView('travel-journal')}
                aria-label="Back to Robredo Heritage Site"
              >
                ← Heritage Site
              </button>
              <div className="museum-title">Jesse M. Robredo</div>
              <div className="museum-subtitle">Virtual Heritage Museum</div>
            </div>

            {/* Exhibit tabs */}
            <div
              className="museum-exhibits"
              role="tablist"
              aria-label="Museum exhibits"
            >
              {museumExhibits.map((exhibit) => (
                <button
                  key={exhibit.id}
                  className={`exhibit-tab${activeExhibit.id === exhibit.id ? ' active' : ''}`}
                  onClick={() => setMuseumExhibit(exhibit.id)}
                  role="tab"
                  aria-selected={activeExhibit.id === exhibit.id}
                  aria-controls={`exhibit-panel-${exhibit.id}`}
                >
                  <div className="exhibit-tab-title">{exhibit.title}</div>
                  <div className="exhibit-tab-period">{exhibit.period}</div>
                </button>
              ))}
            </div>

            {/* Exhibit content */}
            <div
              className="museum-body"
              id={`exhibit-panel-${activeExhibit.id}`}
              role="tabpanel"
              aria-label={activeExhibit.title}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExhibit.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <div
                    className="exhibit-period-badge"
                    style={{ borderColor: `${activeExhibit.color}66`, color: activeExhibit.color }}
                  >
                    {activeExhibit.period}
                  </div>

                  <h3 className="exhibit-heading">{activeExhibit.title}</h3>
                  <p className="exhibit-subheading">{activeExhibit.subtitle}</p>
                  <p className="exhibit-description">{activeExhibit.description}</p>

                  <ul className="exhibit-details" aria-label="Key details">
                    {activeExhibit.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>

                  <div className="source-note" style={{ marginTop: 'var(--space-6)', color: 'rgba(245,240,229,0.35)' }}>
                    Content based on publicly documented biographical and historical records.
                    No invented quotes or unverified claims.
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
