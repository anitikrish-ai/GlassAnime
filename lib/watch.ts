// Local watch history / continue-watching store (localStorage)

export interface WatchItem {
  malId: number
  title: string
  poster: string
  episode: number
  totalEpisodes?: number | null
  language: string
  updatedAt: number
}

const KEY = 'gas_watch_history_v1'
const FAV_KEY = 'gas_favorites_v1'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / private mode errors
  }
}

export function getWatchHistory(): WatchItem[] {
  return read<WatchItem[]>(KEY, []).sort((a, b) => b.updatedAt - a.updatedAt)
}

export function upsertWatch(item: Omit<WatchItem, 'updatedAt'>) {
  const list = read<WatchItem[]>(KEY, [])
  const idx = list.findIndex((w) => w.malId === item.malId)
  const next: WatchItem = { ...item, updatedAt: Date.now() }
  if (idx >= 0) list[idx] = next
  else list.unshift(next)
  write(KEY, list.slice(0, 30))
}

export function getFavorites(): number[] {
  return read<number[]>(FAV_KEY, [])
}

export function isFavorite(malId: number): boolean {
  return getFavorites().includes(malId)
}

export function toggleFavorite(malId: number): boolean {
  const list = getFavorites()
  const idx = list.indexOf(malId)
  if (idx >= 0) {
    list.splice(idx, 1)
    write(FAV_KEY, list)
    return false
  }
  list.unshift(malId)
  write(FAV_KEY, list)
  return true
}
