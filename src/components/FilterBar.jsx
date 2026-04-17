import React from 'react'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
]

const FilterBar = ({ filter, onFilterChange, loading }) => {
  return (
    <div className="inline-flex p-1 bg-[#1c1b1b] rounded-full border border-white/10">
      {filters.map((item) => {
        const isActive = filter === item.value

        return (
          <button
            key={item.value}
            type="button"
            disabled={loading}
            onClick={() => onFilterChange(item.value)}
            className={`px-5 py-2 rounded-full text-sm tracking-tight transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              isActive
                ? 'bg-cyan-300/90 text-[#052228] font-bold'
                : 'text-[#bac9cc] hover:text-[#e5e2e1] font-semibold'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default React.memo(FilterBar)
