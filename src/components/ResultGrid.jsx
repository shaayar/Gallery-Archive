import React, { useEffect, useMemo, useState } from 'react'
import ParallaxColumn from './ParallaxColumn'

const PARALLAX_SPEEDS = [14, -10, 18, -12]

const getColumnCount = (width) => {
  if (width < 768) return 2
  if (width < 1200) return 3
  return 4
}

const distributeIntoColumns = (items, columns) => {
  const next = Array.from({ length: columns }, () => [])
  items.forEach((item, idx) => {
    next[idx % columns].push(item)
  })
  return next
}

const ResultGrid = ({ results, loading, error, activeTab, onPreview, onDownload, onRetry }) => {
  const [columnCount, setColumnCount] = useState(() =>
    typeof window === 'undefined' ? 4 : getColumnCount(window.innerWidth),
  )

  useEffect(() => {
    const onResize = () => setColumnCount(getColumnCount(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const columns = useMemo(() => distributeIntoColumns(results, columnCount), [results, columnCount])

  if (loading && results.length === 0) {
    return <p className="text-[#bac9cc] text-center">Loading {activeTab === 'photos' ? 'images' : 'videos'}...</p>
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-[#ffb4ab]">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!results.length) {
    return <p className="text-[#849396] text-center">No {activeTab} match this filter yet.</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
      {columns.map((items, idx) => (
        <ParallaxColumn
          key={`col-${idx}`}
          items={items}
          speed={PARALLAX_SPEEDS[idx] ?? 12}
          activeTab={activeTab}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </div>
  )
}

export default React.memo(ResultGrid)
