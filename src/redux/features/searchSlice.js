import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    activeTab: 'photos',
    filter: 'all',
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
    setFilter(state, action) {
      state.filter = action.payload
    },
    setResults(state, action) {
      state.results = action.payload
      state.loading = false
      state.error = null
    },
    appendResults(state, action) {
      state.results = [...state.results, ...action.payload]
      state.loading = false
      state.error = null
    },
    setLoading(state) {
      state.loading = true
      state.error = null
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    clearResults(state) {
      state.results = []
      state.query = ''
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setQuery,
  setActiveTab,
  setFilter,
  setResults,
  appendResults,
  setLoading,
  setError,
  clearResults,
} = searchSlice.actions

export default searchSlice.reducer
