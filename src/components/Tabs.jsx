import React from 'react'

const tabs = [
  { label: 'Images', value: 'photos' },
  { label: 'Videos', value: 'videos' },
]

const Tabs = ({ activeTab, onTabChange, loading }) => {
  return (
    <div className="inline-flex p-1 bg-[#1c1b1b] rounded-full border border-white/10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            disabled={loading}
            onClick={() => onTabChange(tab.value)}
            className={`px-8 py-2.5 rounded-full text-sm tracking-tight transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              isActive
                ? 'bg-[#eceded] text-[#2f3131] font-bold'
                : 'text-[#bac9cc] hover:text-[#e5e2e1] font-semibold'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
