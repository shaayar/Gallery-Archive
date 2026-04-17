import axios from 'axios'

const UNSPLASH_API = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const PEXELS_API = import.meta.env.VITE_PEXELS_API_KEY

export async function fetchPhotos(query, page = 1) {
  if (!UNSPLASH_API) {
    throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY in .env')
  }

  try {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, page, per_page: 20 },
      headers: { Authorization: `Client-ID ${UNSPLASH_API}` },
    })

    return res.data?.results ?? []
  } catch (error) {
    const apiError = error?.response?.data?.errors?.[0] || error?.message || 'Failed to fetch photos'
    throw new Error(apiError)
  }
}

export async function fetchVideos(query, page = 1) {
  if (!PEXELS_API) {
    throw new Error('Missing VITE_PEXELS_API_KEY in .env')
  }

  try {
    const res = await axios.get('https://api.pexels.com/videos/search', {
      params: { query, page, per_page: 20 },
      headers: { Authorization: PEXELS_API },
    })

    return res.data?.videos ?? []
  } catch (error) {
    const apiError = error?.response?.data?.error || error?.message || 'Failed to fetch videos'
    throw new Error(apiError)
  }
}

export async function fetchRandomPhotos(count = 20) {
  if (!UNSPLASH_API) {
    throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY in .env')
  }

  try {
    const res = await axios.get('https://api.unsplash.com/photos/random', {
      params: { count, orientation: 'portrait' },
      headers: { Authorization: `Client-ID ${UNSPLASH_API}` },
    })

    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    const apiError = error?.response?.data?.errors?.[0] || error?.message || 'Failed to fetch random photos'
    throw new Error(apiError)
  }
}
