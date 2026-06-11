// Jikan API (unofficial MyAnimeList REST API) client
// Docs: https://docs.api.jikan.moe/

const BASE = 'https://api.jikan.moe/v4'

export interface AnimeImage {
  jpg?: { image_url?: string; large_image_url?: string }
  webp?: { image_url?: string; large_image_url?: string }
}

export interface Anime {
  mal_id: number
  title: string
  title_english?: string | null
  images: AnimeImage
  episodes?: number | null
  score?: number | null
  year?: number | null
  season?: string | null
  type?: string | null
  status?: string | null
  rating?: string | null
  synopsis?: string | null
  genres?: { mal_id: number; name: string }[]
  trailer?: { youtube_id?: string | null } | null
}

interface JikanListResponse<T> {
  data: T[]
  pagination?: {
    has_next_page: boolean
    current_page: number
    last_visible_page: number
  }
}

interface JikanItemResponse<T> {
  data: T
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Jikan request failed (${res.status}): ${path}`)
  }
  return res.json() as Promise<T>
}

export function posterOf(anime: Anime): string {
  return (
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.webp?.image_url ||
    anime.images?.jpg?.image_url ||
    ''
  )
}

export function displayTitle(anime: Anime): string {
  return anime.title_english || anime.title
}

export async function getTopAnime(limit = 14): Promise<Anime[]> {
  const data = await getJson<JikanListResponse<Anime>>(
    `/top/anime?filter=bypopularity&limit=${limit}`,
  )
  return data.data || []
}

export async function getSeasonNow(limit = 18): Promise<Anime[]> {
  const data = await getJson<JikanListResponse<Anime>>(`/seasons/now?limit=${limit}`)
  return data.data || []
}

export async function getAnimeById(id: number): Promise<Anime | null> {
  try {
    const data = await getJson<JikanItemResponse<Anime>>(`/anime/${id}/full`)
    return data.data || null
  } catch {
    return null
  }
}

export async function searchAnime(
  query: string,
  opts: { genres?: string; year?: string; limit?: number } = {},
): Promise<Anime[]> {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  params.set('limit', String(opts.limit ?? 24))
  params.set('order_by', 'popularity')
  params.set('sfw', 'true')
  if (opts.genres) params.set('genres', opts.genres)
  if (opts.year) params.set('start_date', `${opts.year}-01-01`)
  const data = await getJson<JikanListResponse<Anime>>(`/anime?${params.toString()}`)
  return data.data || []
}
