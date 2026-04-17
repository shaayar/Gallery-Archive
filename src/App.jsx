import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { fetchPhotos, fetchRandomPhotos, fetchVideos } from './api/mediaApi'
import CollectionPage from './pages/CollectionPage'
import {
  appendResults,
  clearResults,
  setActiveTab,
  setError,
  setFilter,
  setLoading,
  setQuery,
  setResults,
} from './redux/features/searchSlice'
import { selectAllResults, selectFilteredResults } from './redux/features/searchSelectors'

const getOrientation = (width, height) => (height > width ? 'portrait' : 'landscape')

const normalizeItems = (items, tab) => {
  return items.map((item) => {
    const width = Number(item?.width || item?.video_files?.[0]?.width || 0)
    const height = Number(item?.height || item?.video_files?.[0]?.height || 0)

    return {
      ...item,
      orientation: getOrientation(width, height),
      mediaType: tab,
    }
  })
}

const App = () => {
  const dispatch = useDispatch()
  const { query, activeTab, loading, error, filter } = useSelector((state) => state.search)
  const allResults = useSelector(selectAllResults)
  const filteredResults = useSelector(selectFilteredResults)
  const pageRef = useRef(1)

  const loadRandomImages = useCallback(
    async (append = false) => {
      dispatch(setLoading())

      if (!append) {
        pageRef.current = 1
        dispatch(setActiveTab('photos'))
        dispatch(setQuery(''))
      }

      try {
        const data = normalizeItems(await fetchRandomPhotos(20), 'photos')
        dispatch(append ? appendResults(data) : setResults(data))
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch random photos'))
      }
    },
    [dispatch],
  )

  const runSearch = useCallback(
    async (nextQuery, targetTab = activeTab, append = false) => {
      const trimmedQuery = nextQuery.trim()

      if (!trimmedQuery) {
        await loadRandomImages(append)
        return
      }

      dispatch(setLoading())

      const page = append ? pageRef.current + 1 : 1

      try {
        const data =
          targetTab === 'photos'
            ? await fetchPhotos(trimmedQuery, page)
            : await fetchVideos(trimmedQuery, page)

        const normalized = normalizeItems(data, targetTab)
        dispatch(append ? appendResults(normalized) : setResults(normalized))
        pageRef.current = page
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch media'))
      }
    },
    [activeTab, dispatch, loadRandomImages],
  )

  const handleSubmit = async (nextQuery) => {
    dispatch(setQuery(nextQuery))
    await runSearch(nextQuery, activeTab, false)
  }

  const handleTabChange = async (tab) => {
    if (tab === activeTab || loading) return

    dispatch(setActiveTab(tab))
    pageRef.current = 1

    if (query.trim()) {
      await runSearch(query, tab, false)
      return
    }

    if (tab === 'photos') {
      await loadRandomImages(false)
    } else {
      dispatch(clearResults())
    }
  }

  const handleRetry = async () => {
    await runSearch(query, activeTab, false)
  }

  const handleClear = async () => {
    dispatch(clearResults())
    await loadRandomImages(false)
  }

  const handleDiscoverMore = async () => {
    if (loading) return

    if (query.trim()) {
      await runSearch(query, activeTab, true)
      return
    }

    if (activeTab === 'photos') {
      await loadRandomImages(true)
    }
  }

  useEffect(() => {
    loadRandomImages(false)
  }, [loadRandomImages])

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] selection:bg-cyan-300 selection:text-[#00363d]">
      <CollectionPage
        query={query}
        activeTab={activeTab}
        filter={filter}
        results={filteredResults}
        hasResults={allResults.length > 0}
        loading={loading}
        error={error}
        onQueryChange={(value) => dispatch(setQuery(value))}
        onSearch={handleSubmit}
        onTabChange={handleTabChange}
        onFilterChange={(nextFilter) => dispatch(setFilter(nextFilter))}
        onRetry={handleRetry}
        onClear={handleClear}
        onDiscoverMore={handleDiscoverMore}
      />
    </div>
  )
}

export default App
