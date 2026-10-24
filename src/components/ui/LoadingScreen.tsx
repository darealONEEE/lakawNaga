import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'

export function LoadingScreen() {
  const { isLoading } = useAppStore()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          aria-label="Loading LAKAW NAGA experience"
          aria-live="polite"
        >
          <motion.div
            className="loading-emblem"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            aria-hidden="true"
          >
            L
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="loading-title">LAKAW NAGA</h1>
          </motion.div>

          <motion.p
            className="loading-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            Naga City · Camarines Sur · Philippines
          </motion.p>

          <motion.div
            className="loading-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            role="progressbar"
            aria-label="Loading"
          >
            <div className="loading-bar-fill" />
          </motion.div>

          <motion.p
            style={{ fontSize: '0.7rem', color: 'rgba(245,240,229,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            Preparing your journey…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
