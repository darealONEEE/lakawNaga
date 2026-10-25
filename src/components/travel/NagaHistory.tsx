import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'

const statCards = [
  { label: 'Founded', value: '1595', sub: 'Diocese of Nueva Cáceres' },
  { label: 'City Charter', value: '1948', sub: 'Republic Act No. 305' },
  { label: 'Population', value: '220K+', sub: '2020 Census' },
  { label: 'Elevation', value: '~10 m', sub: 'above sea level' },
  { label: 'Region', value: 'Region V', sub: 'Bicol Region' },
]

const timeline = [
  {
    period: 'Pre-Colonial Era',
    icon: '🌿',
    color: '#315B43',
    title: 'Ancient Bikol Settlements',
    body: `Long before Spanish contact, the fertile lowlands along the Naga River were home to thriving Bikol-speaking communities. These early peoples sustained themselves through fishing, wet-rice cultivation, and riverine trade. The natural abundance of the Naga River delta — which drains southward to Ragay Gulf — made the area one of the most prosperous in the Bicol Peninsula.

The name "Naga" is widely believed to derive from the Bicolano word "Ynaga," referring to a type of local tree. Archaeological finds and oral traditions indicate that the pre-colonial settlement functioned as a trading hub between upland and coastal Bikol communities, with the river as its main artery.`,
  },
  {
    period: '1572 – 1595',
    icon: '⚓',
    color: '#7B3038',
    title: 'Spanish Arrival & Nueva Cáceres',
    body: `Spanish colonial forces, building on the earlier campaigns of Miguel López de Legazpi, extended their reach into the Camarines area in the early 1570s. Captain Pedro de Chaves led expeditions that established Spanish presence along the Bicol River system.

The settlement at the Naga River was formally organized and christened "Nueva Cáceres," named after Cáceres, the capital of Extremadura, Spain — the home province of many early colonizers. In 1595, the Diocese of Nueva Cáceres was formally erected by Pope Clement VIII, making it one of the original four dioceses of the Philippine Islands — alongside Manila, Cebu, and Nueva Segovia. This ecclesiastical status cemented Naga's position as the political, religious, and cultural capital of the Bicol region.`,
  },
  {
    period: 'Colonial Period',
    icon: '🏛️',
    color: '#302E2A',
    title: 'Capital of Bicolandia',
    body: `As seat of the Diocese of Nueva Cáceres, the city became the spiritual and administrative center of all Bikol. Augustinian Recollect missionaries built churches, convents, schools, and hospitals throughout the region — many radiating outward from Naga. The Metropolitan Cathedral of St. John the Evangelist served as the mother church of the entire diocese.

Colonial governance shaped the city's urban pattern: the central plaza (today's Plaza Quince Martires), the church, and the alcaldía (civil hall) formed the tripartite core of Spanish colonial town planning. Commerce flourished along the Naga River, which connected the city to coastal ports and the broader Philippine trade network.`,
  },
  {
    period: 'Colonial Period',
    icon: '🕯️',
    color: '#7B3038',
    title: 'The Quince Mártires',
    body: `Plaza Quince Mártires — the historic heart of Naga City — bears witness to one of the most poignant chapters of the Spanish colonial era. The plaza's name honors fifteen young Filipino men from the city who were accused of plotting against Spanish authority and were executed during the colonial period.

Their sacrifice became a powerful symbol of Filipino courage and the aspiration for freedom, even amid colonial subjugation. The Quince Mártires Monument, a multi-tiered marble pedestal crowned with bronze allegorical figures and an eagle, stands at the center of the plaza as a permanent tribute to their memory. The plaza has remained the civic and ceremonial heart of Naga City for over four centuries.`,
  },
  {
    period: 'c. 1710',
    icon: '⛪',
    color: '#7B3038',
    title: 'Devotion to Our Lady of Peñafrancia',
    body: `Around 1710, Fr. Miguel Robles de Cobarrubias, an Augustinian Recollect, introduced the image of "Ina" (Mother) — Our Lady of Peñafrancia — to Naga City. The devotion was inspired by a shrine at Peñafrancia in Extremadura, Spain. Fr. Cobarrubias is said to have carried the image from Spain and had it enshrined along the Naga River.

The miraculous image quickly attracted widespread veneration among the Bicolano faithful. The Basilica Minore of Our Lady of Peñafrancia was eventually established to house the image. Over the centuries, the devotion grew into one of the most fervent Marian celebrations in all of Asia. The annual Peñafrancia Festival — held every September — draws over a million pilgrims and devotees from across the Philippines and abroad, making it among the largest Marian gatherings on the continent.`,
  },
  {
    period: '1896 – 1900',
    icon: '🇵🇭',
    color: '#C29A51',
    title: 'Revolution & the End of Spanish Rule',
    body: `The Philippine Revolution of 1896, ignited by Andrés Bonifacio and the Katipunan in Luzon, sent tremors throughout the archipelago — including Bicol. As Spanish authority collapsed following the 1898 Treaty of Paris, which ended the Spanish-American War, the Philippines briefly declared independence. Naga City's people participated in the revolutionary ferment that swept the region.

American forces arrived in the Philippines in 1898, and the Philippine-American War (1899–1902) extended the struggle for independence into the early 20th century. Bicol saw significant resistance. With the eventual establishment of American civil governance, the city was reorganized under a new municipal structure. Public schools, roads, and civic infrastructure were built under American administration — transforming the urban landscape of Nueva Cáceres.`,
  },
  {
    period: '1948',
    icon: '📜',
    color: '#302E2A',
    title: 'Chartered as an Independent City',
    body: `On June 18, 1948, the Philippine Congress passed Republic Act No. 305, formally incorporating Naga as an independent component city — legally separate from the Province of Camarines Sur. The city retained its historic role as the regional capital and ecclesiastical seat of Bicol.

In 1919, an earlier act had given the settlement broader municipal powers; the 1948 charter elevated it further. The post-war decades brought rapid population growth, university expansion, and the emergence of Naga as the educational, commercial, and cultural center of the Bicol Peninsula — a status it holds firmly to this day.`,
  },
  {
    period: '1988 – 1998',
    icon: '🌟',
    color: '#C29A51',
    title: 'The Robredo Era — A Model of Governance',
    body: `Jesse M. Robredo (May 26, 1958 – August 18, 2012) transformed Naga City during his three terms as mayor (1988–1998) into a internationally recognized model of participatory local governance. His administration launched the Naga City People's Council — a formal mechanism allowing civil society organizations to directly participate in local legislation, budgeting, and policy — years before the concept became mainstream in the Philippines.

Under Robredo, the city established participatory budgeting, anti-corruption measures, pro-poor housing, and transparent public finance. He received the prestigious Ramon Magsaysay Award for Government Service in 2000, and his reforms were studied by governments around the world. He later served as Secretary of the Interior and Local Government under President Benigno Aquino III from 2010 until his death in a plane crash near Masbate on August 18, 2012. His legacy lives in every institution of civic participation that Naga continues to practice.`,
  },
  {
    period: 'Every September',
    icon: '🕯️',
    color: '#7B3038',
    title: "Peñafrancia Festival — Asia's Great Marian Pilgrimage",
    body: `Each September, Naga City hosts the Peñafrancia Festival — one of the largest Marian devotions in Asia. The nine-day celebration centers on the miraculous image of Our Lady of Peñafrancia housed at the Basilica Minore along the Naga River.

The festival's most dramatic events are the Traslacion — the ceremonial transfer of the image from the Metropolitan Cathedral back to the Basilica — and the Fluvial Procession, in which the image travels on a decorated barge along the Naga River, escorted by hundreds of bancas and thousands of wading male devotees (called "voyadores"). Women are traditionally not permitted in the water during the procession, a practice rooted in centuries-old devotional custom. Over a million pilgrims attend annually, making Peñafrancia Festival the defining spiritual event of the Bicol region.`,
  },
  {
    period: 'Present Day',
    icon: '🌆',
    color: '#315B43',
    title: 'Naga City Today',
    body: `Today, Naga City is a thriving, progressive metropolis and the undisputed heart of the Bicol Region. With a population of approximately 220,000 (2020 census), it anchors the Metro Naga conurbation spanning several surrounding municipalities.

The city is a major university hub, home to institutions including Ateneo de Naga University (founded 1940), the University of Nueva Caceres (founded 1948), Central Bicol State University of Agriculture, and several other colleges. This concentration of higher education drives a young, dynamic population and a growing knowledge economy.

Naga is recognized as one of the Philippines' most livable cities, celebrated for strong civic institutions, environmental advocacy, and community participation. Mount Isarog Natural Park — the 1,966 m active stratovolcano to the east — serves as both a water tower for the region and a center of biodiversity. The Naga River remains the city's lifeblood, connecting history to the present day.`,
  },
]

export function NagaHistory() {
  const { historyOpen, setHistoryOpen } = useAppStore()

  return (
    <AnimatePresence>
      {historyOpen && (
        <>
          {/* Full-screen backdrop */}
          <motion.div
            className="history-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHistoryOpen(false)}
          />

          {/* Centering wrapper — static, keeps Framer Motion transforms from fighting CSS */}
          <div className="history-modal-center">
          <motion.div
            className="history-modal-wrap"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            role="dialog"
            aria-modal="true"
            aria-label="History of Naga City"
          >
            {/* Hero header */}
            <div className="history-modal-hero">
              <div className="history-modal-hero-content">
                <span className="history-modal-eyebrow">Naga City · Camarines Sur · Bicol Region</span>
                <h2 className="history-modal-title">History of Naga City</h2>
                <p className="history-modal-subtitle">From Ancient Bikol Settlement to the Heart of Bicol</p>
              </div>
              <button
                className="history-modal-close"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="history-modal-body">

              {/* Stat cards */}
              <div className="history-stat-row">
                {statCards.map((s) => (
                  <div key={s.label} className="history-stat-card">
                    <div className="history-stat-value">{s.value}</div>
                    <div className="history-stat-label">{s.label}</div>
                    <div className="history-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="history-timeline">
                {timeline.map((sec, i) => (
                  <div key={i} className="history-section">
                    <div className="history-section-aside">
                      <div className="history-section-icon" style={{ background: sec.color + '22', borderColor: sec.color }}>
                        <span>{sec.icon}</span>
                      </div>
                      <div className="history-section-line" />
                    </div>
                    <div className="history-section-body">
                      <span className="history-section-period" style={{ color: sec.color }}>{sec.period}</span>
                      <h3 className="history-section-title">{sec.title}</h3>
                      {sec.body.split('\n\n').map((para, j) => (
                        <p key={j} className="history-section-para">{para}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="history-footer-note">
                Historical information compiled from publicly available records and official sources. Verify specific dates and details with the Naga City Government, Diocese of Nueva Cáceres, or the National Historical Commission of the Philippines.
              </p>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
