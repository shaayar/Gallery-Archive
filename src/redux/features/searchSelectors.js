import { createSelector } from '@reduxjs/toolkit'

export const selectSearchState = (state) => state.search
export const selectAllResults = (state) => state.search.results
export const selectFilter = (state) => state.search.filter

export const selectFilteredResults = createSelector(
  [selectAllResults, selectFilter],
  (results, filter) => {
    if (filter === 'all') return results
    return results.filter((item) => item.orientation === filter)
  },
)
