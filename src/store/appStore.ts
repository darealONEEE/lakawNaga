import { create } from 'zustand'
import type { DestinationId } from '../data/destinations'

export type MapMode = '3d' | 'geo'
export type ActiveView = 'map' | 'museum' | 'food-trail' | 'travel-journal' | 'itinerary' | 'history'

export interface ItineraryStop {
  destinationId: DestinationId
  note: string
}

interface AppState {
  mapMode: MapMode
  activeView: ActiveView
  selectedDestination: DestinationId | null
  breadcrumb: string[]
  activeMuseumExhibit: string | null
  selectedEstablishment: string | null
  kinalasFilter: string
  itinerary: ItineraryStop[]
  searchOpen: boolean
  searchQuery: string
  categoryFilter: 'all' | 'history' | 'food' | 'faith' | 'nature' | 'landmark'
  isLoading: boolean
  reducedMotion: boolean
  historyOpen: boolean
  penafranciaModeActive: boolean

  setMapMode: (mode: MapMode) => void
  setActiveView: (view: ActiveView) => void
  selectDestination: (id: DestinationId | null) => void
  closeDestination: () => void
  setMuseumExhibit: (exhibitId: string | null) => void
  setSelectedEstablishment: (id: string | null) => void
  setKinalasFilter: (filter: string) => void
  addToItinerary: (stop: ItineraryStop) => void
  removeFromItinerary: (destinationId: DestinationId) => void
  clearItinerary: () => void
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setCategoryFilter: (filter: AppState['categoryFilter']) => void
  setLoading: (loading: boolean) => void
  setHistoryOpen: (open: boolean) => void
  setPenafranciaModeActive: (active: boolean) => void
}

const crumbLabels: Record<DestinationId, string> = {
  quincemart: 'Plaza Quince Martires',
  robredo:    'Robredo Heritage Site',
  kinalas:    'Kinalas Food Trail',
  basilica:   'Basilica Minore',
  isarog:     'Mount Isarog',
}

export const useAppStore = create<AppState>((set) => ({
  mapMode: '3d',
  activeView: 'map',
  selectedDestination: null,
  breadcrumb: ['Naga City'],
  activeMuseumExhibit: null,
  selectedEstablishment: null,
  kinalasFilter: 'all',
  itinerary: [],
  searchOpen: false,
  searchQuery: '',
  categoryFilter: 'all',
  isLoading: true,
  historyOpen: false,
  penafranciaModeActive: false,
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,

  setMapMode: (mode) => set({ mapMode: mode }),
  setActiveView: (view) => set({ activeView: view }),

  selectDestination: (id) =>
    set(() => {
      if (!id) return { selectedDestination: null, breadcrumb: ['Naga City'], activeView: 'map' as ActiveView }
      return {
        selectedDestination: id,
        breadcrumb: ['Naga City', crumbLabels[id]],
        activeView: 'travel-journal' as ActiveView,
        activeMuseumExhibit: null,
        selectedEstablishment: null,
      }
    }),

  closeDestination: () =>
    set({ selectedDestination: null, breadcrumb: ['Naga City'], activeView: 'map', activeMuseumExhibit: null }),

  setMuseumExhibit: (exhibitId) =>
    set((state) => ({
      activeMuseumExhibit: exhibitId,
      breadcrumb: exhibitId
        ? ['Naga City', 'Robredo Heritage Site', exhibitId]
        : ['Naga City', 'Robredo Heritage Site'],
      activeView: 'museum' as ActiveView,
      selectedDestination: state.selectedDestination ?? 'robredo',
    })),

  setSelectedEstablishment: (id) => set({ selectedEstablishment: id }),
  setKinalasFilter: (filter) => set({ kinalasFilter: filter }),

  addToItinerary: (stop) =>
    set((state) => {
      if (state.itinerary.some((s) => s.destinationId === stop.destinationId)) return state
      return { itinerary: [...state.itinerary, stop] }
    }),

  removeFromItinerary: (destinationId) =>
    set((state) => ({ itinerary: state.itinerary.filter((s) => s.destinationId !== destinationId) })),

  clearItinerary: () => set({ itinerary: [] }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (filter) => set({ categoryFilter: filter }),
  setLoading: (loading) => set({ isLoading: loading }),
  setHistoryOpen: (open) => set({ historyOpen: open, activeView: open ? 'history' : 'map' }),
  setPenafranciaModeActive: (active) => set({ penafranciaModeActive: active }),
}))
