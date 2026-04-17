import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const MotionArticle = motion.article

const ResultCard = ({ item, activeTab, onPreview, onDownload }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const imageUrl = useMemo(
    () =>
      activeTab === 'photos'
        ? item?.urls?.regular || item?.urls?.small
        : item?.video_pictures?.[0]?.picture || item?.image,
    [activeTab, item],
  )

  const author =
    activeTab === 'photos'
      ? item?.user?.name || 'Unknown Author'
      : item?.user?.name || item?.user || 'Unknown Creator'

  if (!imageUrl) return null

  return (
    <MotionArticle
      className="group relative overflow-hidden rounded-3xl bg-[#2a2a2a] cursor-zoom-in"
      onClick={() => onPreview(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onPreview(item)
        }
      }}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 24 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.035, rotate: 0.35 }}
    >
      <img
        src={imageUrl}
        alt={item?.alt_description || item?.url || 'Media item'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto block transition-all duration-500 ${isLoaded ? 'blur-0' : 'blur-md scale-[1.02]'}`}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
        <span className="text-sm font-semibold text-white tracking-wide">{author}</span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDownload(item)
          }}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md py-1.25 px-2 rounded-full transition-colors"
          aria-label="Download media"
        >
          <span className="material-symbols-outlined text-white text-lg">download</span>
        </button>
      </div>
    </MotionArticle>
  )
}

export default React.memo(ResultCard)
