import React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import ResultCard from './ResultCard'

const MotionDiv = motion.div

const ParallaxColumn = ({ items, speed, activeTab, onPreview, onDownload }) => {
  const { scrollY } = useScroll({ 
    target: window,
    syncInternalState: true 
  })
  const yRaw = useTransform(scrollY, [0, 1600], [0, speed])
  const y = useSpring(yRaw, { stiffness: 90, damping: 28, mass: 0.2 })

  return (
    <MotionDiv style={{ y }} className="flex flex-col gap-6">
      {items.map((item) => (
        <ResultCard
          key={item.id}
          item={item}
          activeTab={activeTab}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </MotionDiv>
  )
}

export default React.memo(ParallaxColumn)
