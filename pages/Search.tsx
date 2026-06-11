import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHead } from '@unhead/react'
import {Search as SearchIcon} from 'lucide-react'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import { CardGridSkeleton } from '@/components/Skeleton'
import type { Anime } from '@/lib/jikan'
import { searchAnime } from '@/lib/jikan'

const GENRES = [
  { id: '1', name: 'Action' },
  { id: '4', name: 'Comedy' },
  { id: '8', name: 'Drama' },
  { id: '10', name: 'Fantasy' },
  { id: '22', name: 'Romance' },
  { id: '24', name: 'Sci-Fi' },
  { id: '37', name: 'Supernatural' },
  { id: '30', name: 'Sports' },
]

const YEARS = ['', '2026', '2025', '2024', '2023', '2022', '2020', '2018']

function Search() {
  useHead({ title: 'Browse · GlassAnime' })
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const genre = params.get('genre') || ''
  const year = params.get('year') || ''

  const [results, setResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    const t = setTimeout(() => {
      searchAnime(q, { genres: genre, year, limit: 24 })
        .then((r) => active && setResults(r))
        .catch(() => active && setResults([]))
        .finally(() => active && setLoading(false))
    }, 350)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [q, genre, year])

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="app-bg min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-cyan-300" />
          <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            {q ? `Results for "${q}"` : 'Browse Anime'}
          </h1>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-200/60">Genre</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => update('genre', '')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  !genre ? 'btn-neon text-white' : 'glass text-violet-100/70'
                }`}
              >
                All
              </button>
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => update('genre', g.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    genre === g.id ? 'btn-neon text-white' : 'glass text-violet-100/70'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-200/60">Year</p>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <button
                  key={y || 'all'}
                  onClick={() => update('year', y)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    year === y ? 'btn-neon text-white' : 'glass text-violet-100/70'
                  }`}
                >
                  {y || 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <CardGridSkeleton count={12} />
        ) : results.length ? (
          <div className="grid grid-cols-2 gap-4 fade-up sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((a) => (
              <AnimeCard key={a.mal_id} anime={a} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center text-violet-100/70">
            No anime found. Try a different search or filter.
          </div>
        )}
      </main>
    </div>
  )
}

export default Search
