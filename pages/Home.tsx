import { useEffect, useState } from 'react'
import { useHead } from '@unhead/react'
import Navbar from '@/components/Navbar'
import HeroBanner from '@/components/HeroBanner'
import AnimeRow from '@/components/AnimeRow'
import ContinueWatching from '@/components/ContinueWatching'
import AnimeCard from '@/components/AnimeCard'
import { CardGridSkeleton, HeroSkeleton } from '@/components/Skeleton'
import type { Anime } from '@/lib/jikan'
import { getSeasonNow, getTopAnime } from '@/lib/jikan'
import { getWatchHistory, type WatchItem } from '@/lib/watch'

function Home() {
  useHead({ title: '玻璃风动漫流媒体站 · GlassAnime' })

  const [top, setTop] = useState<Anime[]>([])
  const [season, setSeason] = useState<Anime[]>([])
  const [history, setHistory] = useState<WatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setHistory(getWatchHistory())
    let active = true
    ;(async () => {
      try {
        const [t, s] = await Promise.all([getTopAnime(14), getSeasonNow(18)])
        if (!active) return
        setTop(t)
        setSeason(s)
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-bg min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <HeroSkeleton />
        ) : top.length ? (
          <HeroBanner items={top} />
        ) : null}

        <ContinueWatching items={history} />

        {!loading && top.length ? <AnimeRow title="🔥 Trending Now" anime={top} /> : null}

        <section>
          <h2 className="mb-3 text-lg font-bold tracking-tight text-white sm:text-xl">
            ✨ This Season
          </h2>
          {loading ? (
            <CardGridSkeleton count={12} />
          ) : error ? (
            <div className="glass rounded-2xl p-8 text-center text-violet-100/70">
              Failed to load anime. Please refresh and try again.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 fade-up sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {season.map((a) => (
                <AnimeCard key={a.mal_id} anime={a} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-xs text-violet-200/40 sm:px-6">
        GlassAnime · Built with a frosted-glass UI · Metadata by Jikan (MyAnimeList)
      </footer>
    </div>
  )
}

export default Home
