import { useState } from 'react'
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

The festival's most dramatic events are the Traslacion — the ceremonial transfer of the image from the Metropolitan Cathedral back to the Basilica — and the Fluvial Procession, in which the image travels on a decorated barge along the Naga River, escorted by hundreds of bancas and thousands of wading male devotees (called "voyadores"). Women are traditionally not permitted in the water during the procession, a practice rooted in centuries-old devotional custom. Over a million pilgrims attend annually, making Peñafrancia Festival the defining spiritual event of the Bicol Region.`,
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

type MayorEntry = {
  name: string
  term: string
  icon: string
  note: string
  award?: string
  highlight?: boolean
  current?: boolean
}

const mayors: MayorEntry[] = [
  {
    name: 'Leni Robredo',
    term: 'June 30, 2025 – Present',
    icon: '🌟',
    current: true,
    note: 'Elected mayor in the May 2025 elections. Wife of the late Jesse M. Robredo, she previously served as Camarines Sur 3rd District Representative (2013–2016) and as Vice President of the Philippines (2016–2022).',
  },
  {
    name: 'Nelson S. Legacion',
    term: 'June 30, 2019 – June 30, 2025',
    icon: '🏙️',
    note: 'Served two consecutive stints totalling six years. Led Naga through the COVID-19 pandemic, coordinating public health emergency response, mass vaccination drives, and community recovery programs.',
  },
  {
    name: 'John G. Bongat',
    term: 'June 30, 2010 – June 30, 2019',
    icon: '🏙️',
    note: 'Three consecutive terms. One of the longest-serving mayors in modern Naga history; oversaw major infrastructure modernization, heritage preservation, and inclusive economic development programs.',
  },
  {
    name: 'Jesse M. Robredo',
    term: 'June 30, 2001 – June 30, 2010',
    icon: '⭐',
    highlight: true,
    award: 'Ramon Magsaysay Award for Government Service · 2000',
    note: 'Second stint — three more terms. Continued to deepen participatory governance after returning to the mayoralty. Later appointed Secretary of the Interior and Local Government (2010–2012) under President Benigno Aquino III; died in a plane crash on August 18, 2012.',
  },
  {
    name: 'Sulpicio Roco Jr.',
    term: 'June 30, 1998 – June 30, 2001',
    icon: '🏛️',
    note: 'Served as mayor during the bridge period between Robredo\'s two stints. Maintained the city\'s governance programs and continued development initiatives.',
  },
  {
    name: 'Jesse M. Robredo',
    term: 'February 2, 1988 – June 30, 1998',
    icon: '⭐',
    highlight: true,
    award: 'Ramon Magsaysay Award for Government Service · 2000',
    note: 'First stint — three consecutive terms. Transformed Naga City into an internationally recognized model of participatory local governance through the Naga City People\'s Council, participatory budgeting, and transparent public finance. His reforms were studied by governments worldwide.',
  },
  {
    name: 'Carlos G. del Castillo (Acting)',
    term: 'December 1979 – February 1980',
    icon: '🏛️',
    note: 'Served as Acting Mayor during intermittent periods in the transition between administrations.',
  },
  {
    name: 'Vicente Sibulo',
    term: 'September 1965 – December 1979',
    icon: '🏛️',
    note: 'Long-serving mayor spanning over fourteen years, including the period of Martial Law declared in 1972. Guided the city through significant national political changes.',
  },
  {
    name: 'Ramon Felipe Jr.',
    term: 'January 1964 – September 1965',
    icon: '🏛️',
    note: 'Brief administration during the mid-1960s, overseeing city development during a period of national growth.',
  },
  {
    name: 'Victorino Ojeda',
    term: 'January 1960 – December 1963',
    icon: '🏛️',
    note: 'Four-year administration focused on post-war city reconstruction and development.',
  },
  {
    name: 'Rosalio Imperial',
    term: 'September 1, 1959 – December 1959',
    icon: '🏛️',
    note: 'Brief second term; also served as one of the city\'s earliest post-charter executives in 1945–1946.',
  },
  {
    name: 'Monico Imperial',
    term: 'June 1954 – August 31, 1959',
    icon: '🏛️',
    note: 'Five-year administration guiding the city\'s early chartered-city development and civic institution building.',
  },
  {
    name: 'Antonio Sibulo',
    term: 'January 1954 – May 1954',
    icon: '🏛️',
    note: 'Short transitional administration in early 1954.',
  },
  {
    name: 'Anastacio Prila',
    term: 'September 1953 – January 1954',
    icon: '🏛️',
    note: 'Brief administration during a period of local government transition.',
  },
  {
    name: 'Leon Aureus',
    term: 'December 15, 1948 – August 1953',
    icon: '🏛️',
    note: 'Served for nearly five years as one of the city\'s first elected mayors under the 1948 charter, laying early foundations for city governance and post-war reconstruction.',
  },
  {
    name: 'Feliciano Reyes',
    term: 'January 1, 1948 – December 1948',
    icon: '🏛️',
    note: 'Served at the time the city charter (Republic Act No. 305) was enacted on June 18, 1948, marking Naga\'s formal establishment as an independent chartered city.',
  },
  {
    name: 'Felix Espiritu',
    term: 'September 1947 – December 15, 1947',
    icon: '🏛️',
    note: 'Pre-charter administrator during the immediate post-war transition period.',
  },
  {
    name: 'Blas David',
    term: 'June 1946 – September 1947',
    icon: '🏛️',
    note: 'Oversaw the city\'s early post-war recovery and reconstruction.',
  },
  {
    name: 'Rosalio Imperial',
    term: 'May 1945 – June 1946',
    icon: '🏛️',
    note: 'Among the first post-liberation executives, helping restore civil governance in Naga following the Second World War.',
  },
]

type SpotEntry = {
  name: string
  category: string
  categoryColor: string
  icon: string
  desc: string
  tip: string
}

const touristSpots: SpotEntry[] = [
  {
    name: 'Plaza Quince Martires',
    category: 'Heritage',
    categoryColor: '#C29A51',
    icon: '🏛️',
    desc: 'The historic heart of Naga City, named after fifteen young Filipino men executed during the Spanish colonial era. The multi-tiered marble monument crowned with bronze allegorical figures and an eagle stands as a permanent tribute to their courage. The plaza has served as the civic and ceremonial center of Naga for over four centuries.',
    tip: 'Best visited in the early morning or evening when the monument is illuminated. The annual Peñafrancia procession passes through here.',
  },
  {
    name: 'Basilica Minore of Our Lady of Peñafrancia',
    category: 'Religious',
    categoryColor: '#7B3038',
    icon: '⛪',
    desc: 'Home of the miraculous image of "Ina" — Our Lady of Peñafrancia — enshrined since around 1710. One of the most visited pilgrimage sites in the Philippines and the spiritual center of the Bicol Region. Each September, over a million devotees converge here for the Peñafrancia Festival, one of Asia\'s largest Marian gatherings.',
    tip: 'The image is housed in a special chapel inside the basilica. The Fluvial Procession departs from here along the Naga River every third Saturday of September.',
  },
  {
    name: 'Metropolitan Cathedral of Saint John the Evangelist',
    category: 'Religious',
    categoryColor: '#7B3038',
    icon: '⛪',
    desc: 'One of the original four cathedrals of the Philippine Islands, established when the Diocese of Nueva Cáceres was erected in 1595. The mother church of the entire Bicol Region, it has stood for over four centuries as a witness to Naga\'s history. The Traslacion ceremony begins here every September when the image of "Ina" is transferred to the Basilica.',
    tip: 'Located on Elias Angeles Street near Plaza Quince Martires. Historic architecture with centuries of ecclesiastical significance.',
  },
  {
    name: 'Museo ni Jesse Robredo',
    category: 'Cultural',
    categoryColor: '#315B43',
    icon: '🏺',
    desc: 'A museum dedicated to the life and legacy of Jesse M. Robredo — Naga\'s most celebrated mayor and former DILG Secretary. Interactive exhibits cover his transformative governance innovations, the Naga City People\'s Council, his Ramon Magsaysay Award in 2000, and his enduring impact on Philippine public service.',
    tip: 'Located in the Naga City Government Center. Free admission; open during government office hours.',
  },
  {
    name: 'Mount Isarog National Park',
    category: 'Nature',
    categoryColor: '#315B43',
    icon: '🏔️',
    desc: 'A 10,112-hectare protected area surrounding the active stratovolcano of Mount Isarog (1,966 m above sea level), visible from across Naga City. The park is a critical watershed and biodiversity hotspot, home to endemic flora and fauna found nowhere else on Earth. Hiking trails lead through montane rainforest to multiple waterfalls and base camps.',
    tip: 'Register at the DENR Isarog Protected Area Office before hiking. Malabsay Falls is the most accessible attraction. Guides are recommended for summit attempts.',
  },
  {
    name: 'Malabsay Falls',
    category: 'Nature',
    categoryColor: '#315B43',
    icon: '💧',
    desc: 'A stunning multi-tiered waterfall on the southern slopes of Mount Isarog within the national park. The falls drop through lush tropical forest into a clear natural pool — one of the most visited natural attractions in the Bicol Region. The trail to Malabsay winds through old-growth forest and smaller cascades along the way.',
    tip: 'About 2–3 hours by trail from the Panicuason entry point. Bring water shoes — the rocky pools are worth wading in. Best visited in the dry season (Dec–May).',
  },
  {
    name: 'Naga River',
    category: 'Heritage',
    categoryColor: '#C29A51',
    icon: '🌊',
    desc: 'The lifeblood of Naga City for centuries, the Naga River drains southward to Ragay Gulf and was the primary artery of commerce and culture in the pre-colonial and colonial eras. Today it is famous as the site of the annual Peñafrancia Fluvial Procession, when thousands of bancas escort the image of "Ina" down the river in one of the Philippines\' most dramatic religious spectacles.',
    tip: 'The riverbank promenade near the Basilica is a pleasant walk. The Fluvial Procession happens every third Saturday of September.',
  },
  {
    name: 'Ateneo de Naga University',
    category: 'Heritage',
    categoryColor: '#302E2A',
    icon: '🎓',
    desc: 'A Jesuit university founded in 1940 — one of the oldest and most prestigious universities in the Bicol Region. The campus features colonial-era and mid-century architecture set amid mature trees. The university has been central to Naga\'s reputation as the educational capital of Bicol and has produced many national leaders, including Jesse Robredo.',
    tip: 'Located along Ateneo Avenue. The university chapel and main grounds are worth visiting for their architectural heritage.',
  },
  {
    name: 'University of Nueva Caceres',
    category: 'Heritage',
    categoryColor: '#302E2A',
    icon: '🎓',
    desc: 'Established in 1948 — the oldest university in the Bicol Region. Named after the colonial-era name of Naga, it was founded in the same year the city received its charter as an independent chartered city. A landmark of Bicolano education and one of the most recognized academic institutions in the region.',
    tip: 'Located along Jaime Hernandez Avenue in the city center.',
  },
  {
    name: 'Naga City Public Market',
    category: 'Cultural',
    categoryColor: '#B96848',
    icon: '🛒',
    desc: 'The commercial and culinary heart of Naga City. The public market is where locals buy fresh produce, dried goods, local delicacies, and the freshest ingredients for Bicolano cooking. It is also the best place to find authentic kinalas, bicol express, and pili nut products. A sensory-rich experience that captures the everyday life and food culture of Naga.',
    tip: 'Go early in the morning for the freshest selections. Look for stalls selling pili nut products — Bicol\'s signature export. Kinalas carinderías are clustered around the market.',
  },
  {
    name: 'Christ the King College',
    category: 'Heritage',
    categoryColor: '#302E2A',
    icon: '🎓',
    desc: 'A Catholic institution with a long history of education in Naga, contributing significantly to the city\'s role as an academic hub of the Bicol Region. Its campus and heritage buildings reflect decades of Catholic educational tradition in the city.',
    tip: 'Located in the central part of Naga City.',
  },
  {
    name: 'Triangulo Commercial District',
    category: 'Landmark',
    categoryColor: '#302E2A',
    icon: '🏙️',
    desc: 'The central commercial junction of Naga City, where several major roads converge at the heart of the CBD. Triangulo is surrounded by banks, restaurants, shops, and commercial establishments — it is the pulse of modern Naga\'s daily urban life and a key navigational landmark for visitors.',
    tip: 'The nearby Robredo heritage walk connects Triangulo to Plaza Quince Martires and the Cathedral — all within easy walking distance.',
  },
]

type BarangayEntry = {
  name: string
  note?: string
}

const barangays: BarangayEntry[] = [
  { name: 'Abella',            note: 'Residential district south of the CBD' },
  { name: 'Bagumbayan Norte',  note: 'Commercial and residential area' },
  { name: 'Bagumbayan Sur',    note: 'Adjacent to Bagumbayan Norte, near the market' },
  { name: 'Balatas',           note: 'Known for the Balatas Road corridor' },
  { name: 'Calauag',           note: 'Agricultural and residential barangay' },
  { name: 'Cararayan',         note: 'Site of the Cararayan spring and agricultural land' },
  { name: 'Carolina',          note: 'Residential community in the northern district' },
  { name: 'Concepcion Grande', note: 'Near the Basilica Minore; devotional center' },
  { name: 'Concepcion Pequeña',note: 'Near the Metropolitan Cathedral' },
  { name: 'Dayangdang',        note: 'Southeastern residential barangay' },
  { name: 'Del Rosario',       note: 'Central barangay along major road arteries' },
  { name: 'Dinaga',            note: 'Agricultural barangay on the city periphery' },
  { name: 'Fatima',            note: 'Residential barangay named for the Marian apparition' },
  { name: 'Lerma',             note: 'Part of the central business district' },
  { name: 'Liboton',           note: 'Along the Naga River corridor' },
  { name: 'Mabolo',            note: 'Named after the mabolo (velvet apple) tree' },
  { name: 'Pacol',             note: 'Gateway barangay towards Mt. Isarog foothills' },
  { name: 'Panicuason',        note: 'Entry point to Mount Isarog National Park' },
  { name: 'Peñafrancia',       note: 'Barangay surrounding the famous basilica and shrine' },
  { name: 'Sabang',            note: 'Along the Naga River; near the public market' },
  { name: 'San Felipe',        note: 'Residential barangay in the northern district' },
  { name: 'San Francisco',     note: 'Residential and light commercial barangay' },
  { name: 'Tabuco',            note: 'Agricultural and residential on the city\'s outskirts' },
  { name: 'Tinago',            note: 'Name means "hidden"; quiet residential district' },
  { name: 'Triangulo',         note: 'Central commercial hub; major road junction' },
  { name: 'Sto. Domingo',      note: 'Residential barangay in the northern area' },
  { name: 'Sta. Cruz',         note: 'Residential district on the city\'s southern side' },
]

type Tab = 'history' | 'mayors' | 'spots' | 'barangays'

export function NagaHistory() {
  const { historyOpen, setHistoryOpen } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>('history')

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

          {/* Centering wrapper */}
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

            {/* Tab bar */}
            <div className="history-tab-bar">
              <button
                className={`history-tab${activeTab === 'history' ? ' active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Timeline
              </button>
              <button
                className={`history-tab${activeTab === 'mayors' ? ' active' : ''}`}
                onClick={() => setActiveTab('mayors')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Mayors
              </button>
              <button
                className={`history-tab${activeTab === 'spots' ? ' active' : ''}`}
                onClick={() => setActiveTab('spots')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Tourist Spots
              </button>
              <button
                className={`history-tab${activeTab === 'barangays' ? ' active' : ''}`}
                onClick={() => setActiveTab('barangays')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Barangays
              </button>
            </div>

            {/* Scrollable body */}
            <div className="history-modal-body">

              {/* ── HISTORY TAB ── */}
              {activeTab === 'history' && (
                <>
                  <div className="history-stat-row">
                    {statCards.map((s) => (
                      <div key={s.label} className="history-stat-card">
                        <div className="history-stat-value">{s.value}</div>
                        <div className="history-stat-label">{s.label}</div>
                        <div className="history-stat-sub">{s.sub}</div>
                      </div>
                    ))}
                  </div>

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
                </>
              )}

              {/* ── MAYORS TAB ── */}
              {activeTab === 'mayors' && (
                <>
                  <div className="history-mayors-header">
                    <h3 className="history-mayors-title">Past &amp; Present Mayors</h3>
                    <p className="history-mayors-sub">Leaders who shaped Naga City from its founding to the present day.</p>
                  </div>

                  <div className="history-mayor-list">
                    {mayors.map((m, i) => (
                      <div
                        key={i}
                        className={`history-mayor-card${m.highlight ? ' highlight' : ''}${m.current ? ' current' : ''}`}
                      >
                        <div className="history-mayor-icon-wrap">
                          <span className="history-mayor-icon">{m.icon}</span>
                        </div>
                        <div className="history-mayor-info">
                          <div className="history-mayor-top">
                            <h3 className="history-mayor-name">{m.name}</h3>
                            <div className="history-mayor-badges">
                              {m.current && <span className="history-mayor-badge badge-current">Incumbent</span>}
                              {m.highlight && <span className="history-mayor-badge badge-award">Magsaysay Awardee</span>}
                            </div>
                          </div>
                          <div className="history-mayor-term">{m.term}</div>
                          {m.award && (
                            <div className="history-mayor-award">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              {m.award}
                            </div>
                          )}
                          <p className="history-mayor-note">{m.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="history-footer-note">
                    Mayor records sourced from official Naga City Government and COMELEC records, 1945–present.
                  </p>
                </>
              )}

              {/* ── TOURIST SPOTS TAB ── */}
              {activeTab === 'spots' && (
                <>
                  <div className="history-mayors-header">
                    <h3 className="history-mayors-title">Tourist Spots in Naga City</h3>
                    <p className="history-mayors-sub">Heritage sites, natural attractions, religious landmarks, and cultural destinations.</p>
                  </div>

                  <div className="history-spots-list">
                    {touristSpots.map((s, i) => (
                      <div key={i} className="history-spot-card">
                        <div className="history-spot-icon-wrap">
                          <span className="history-spot-icon">{s.icon}</span>
                        </div>
                        <div className="history-spot-info">
                          <div className="history-spot-top">
                            <h3 className="history-spot-name">{s.name}</h3>
                            <span
                              className="history-spot-category"
                              style={{ color: s.categoryColor, borderColor: s.categoryColor + '44', background: s.categoryColor + '12' }}
                            >
                              {s.category}
                            </span>
                          </div>
                          <p className="history-spot-desc">{s.desc}</p>
                          <div className="history-spot-tip">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {s.tip}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="history-footer-note">
                    Tourist spot information based on publicly available sources. Hours, admission fees, and access conditions may vary — verify with the Naga City Tourism Office before visiting.
                  </p>
                </>
              )}

              {/* ── BARANGAYS TAB ── */}
              {activeTab === 'barangays' && (
                <>
                  <div className="history-mayors-header">
                    <h3 className="history-mayors-title">Barangays of Naga City</h3>
                    <p className="history-mayors-sub">Naga City is composed of 27 barangays spanning urban, residential, and agricultural districts.</p>
                  </div>

                  <div className="history-brgy-grid">
                    {barangays.map((b, i) => (
                      <div key={i} className="history-brgy-card">
                        <div className="history-brgy-num">{String(i + 1).padStart(2, '0')}</div>
                        <div className="history-brgy-body">
                          <div className="history-brgy-name">{b.name}</div>
                          {b.note && <div className="history-brgy-note">{b.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="history-footer-note">
                    Barangay list based on official Naga City Government and PSA records. Verify the complete official list with the Naga City Local Government Unit.
                  </p>
                </>
              )}

            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
