import React, { useEffect, useMemo, useRef, useState } from 'react'
import SearchBar from '../components/SearchBar'
import Tabs from '../components/Tabs'
import ResultGrid from '../components/ResultGrid'
import FilterBar from '../components/FilterBar'
import { downloadMedia } from '../utils/downloadMedia'

const CollectionPage = ({
  query,
  activeTab,
  filter,
  results,
  hasResults,
  loading,
  error,
  onQueryChange,
  onSearch,
  onTabChange,
  onFilterChange,
  onRetry,
  onClear,
  onDiscoverMore,
}) => {
  const [previewItem, setPreviewItem] = useState(null)
  const loadMoreRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPreviewItem(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!loadMoreRef.current || loading || error || activeTab !== 'photos' || query.trim() || filter !== 'all') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onDiscoverMore()
        }
      },
      { rootMargin: '300px 0px' },
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [activeTab, error, filter, loading, onDiscoverMore, query])

  const preview = useMemo(() => {
    if (!previewItem) return null

    if (activeTab === 'photos') {
      return {
        type: 'photo',
        src: previewItem?.urls?.full || previewItem?.urls?.regular || previewItem?.urls?.small,
        alt: previewItem?.alt_description || 'Preview image',
      }
    }

    return {
      type: 'video',
      src:
        previewItem?.video_files?.find((file) => file?.quality === 'hd')?.link ||
        previewItem?.video_files?.[0]?.link,
      poster: previewItem?.video_pictures?.[0]?.picture,
    }
  }, [activeTab, previewItem])

  const getDownloadDetails = (item) => {
    if (activeTab === 'photos') {
      return {
        url: item?.urls?.full || item?.urls?.regular || item?.urls?.small,
        filename: `photo-${item?.id || 'asset'}.jpg`,
      }
    }

    const videoFile = item?.video_files?.find((file) => file?.quality === 'hd') || item?.video_files?.[0]

    return {
      url: videoFile?.link,
      filename: `video-${item?.id || 'asset'}.mp4`,
    }
  }

  const handleDownload = async (item) => {
    try {
      const { url, filename } = getDownloadDetails(item)
      await downloadMedia(url, filename)
    } catch (downloadError) {
      window.alert(downloadError.message || 'Unable to download this media')
    }
  }

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-white/10 bg-black/65 backdrop-blur-3xl z-50 flex justify-between items-center px-6 py-2 gap-6">
        <div className="flex items-center gap-6 shrink-0">
          <span className="text-xl font-extrabold tracking-tighter text-neutral-100 uppercase hidden md:block">GALLERY ARCHIVE</span>
          <span className="text-xl md:hidden">G A</span>
        </div>

        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          onSubmit={onSearch}
          loading={loading}
          activeTab={activeTab}
          classes="hidden md:block"
        />

        <div className="h-11 w-11 rounded-full p-2 bg-[#353534] border border-white/10 text-white/80 hidden md:block" title="User Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </nav>

      <main className="pt-32 px-6 md:px-12 pb-20 max-w-400px mx-auto">
        <header className="flex flex-col items-center mb-16 space-y-6">
          <SearchBar
            query={query}
            onQueryChange={onQueryChange}
            onSubmit={onSearch}
            loading={loading}
            activeTab={activeTab}
            isMobile={true}
          />
          <Tabs activeTab={activeTab} onTabChange={onTabChange} loading={loading} />
          <FilterBar filter={filter} onFilterChange={onFilterChange} loading={loading} />

          {(query || hasResults || error) && (
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm"
            >
              Clear Results
            </button>
          )}
        </header>

        <ResultGrid
          results={results}
          loading={loading}
          error={error}
          activeTab={activeTab}
          onPreview={(item) => setPreviewItem(item)}
          onDownload={handleDownload}
          onRetry={onRetry}
        />

        <div className="mt-20 flex justify-center">
          <button
            type="button"
            onClick={onDiscoverMore}
            className="group flex items-center gap-3 bg-[#2a2a2a] hover:bg-[#3a3939] px-10 py-4 rounded-full border border-white/10 transition-all duration-300"
          >
            <span className="text-white font-bold tracking-tight">Discover More</span>
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
          </button>
        </div>

        <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
      </main>

      <footer className="border-t border-white/10 py-12 px-6 bg-[#0e0e0e]">
        <div className="max-w-400 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-extrabold tracking-tighter text-white mb-2">GALLERY ARCHIVE</span>
            <p className="text-[#bac9cc] text-sm max-w-xs text-center md:text-left">
              Curating the world's most cinematic visual assets for the digital era.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-cyan-200 uppercase tracking-widest">Platform</span>
              <a className="text-sm text-[#bac9cc] hover:text-white transition-colors" href="#">Archive</a>
              <a className="text-sm text-[#bac9cc] hover:text-white transition-colors" href="#">Licensing</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-cyan-200 uppercase tracking-widest">Community</span>
              <a className="text-sm text-[#bac9cc] hover:text-white transition-colors" href="#">Curators</a>
              <a className="text-sm text-[#bac9cc] hover:text-white transition-colors" href="#">Photographers</a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-white/20">© 2026 Gallery Archive. Built for Digital Curators.</div>
      </footer>

      {preview && (
        <div
          className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >


          <div
            className="w-full relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden bg-[#111] border border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-2 pt-1"
              onClick={() => setPreviewItem(null)}
              aria-label="Close preview"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <button
              type="button"
              className="absolute top-6 left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-2 pt-1"
              onClick={(event) => {
                event.stopPropagation()
                handleDownload(previewItem)
              }}
              aria-label="Download preview media"
            >
              <span className="material-symbols-outlined">download</span>
            </button>

            {preview.type === 'photo' ? (
              <img src={preview.src} alt={preview.alt} className="w-full h-full max-h-[90vh] object-contain" />
            ) : (
              <video
                src={preview.src}
                poster={preview.poster}
                controls
                autoPlay
                className="w-full h-full max-h-[90vh] bg-black"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CollectionPage
