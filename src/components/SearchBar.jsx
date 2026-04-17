import React from 'react'

const SearchBar = ({ query, onQueryChange, onSubmit, loading, activeTab, isMobile }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(query)
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-[800px] relative group ${isMobile ? 'hidden' : 'block'}`}>
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[#bac9cc]">
        <span className="material-symbols-outlined">search</span>
      </div>

      <input
        type="text"
        placeholder={`Search ${activeTab === 'photos' ? 'images' : 'videos'} ${isMobile ? '' : 'from the archive...'}`}
        className="w-full bg-[#0e0e0e] border border-white/5 rounded-full py-3 pl-16 pr-28 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all duration-500 placeholder:text-[#849396]"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-white text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar
