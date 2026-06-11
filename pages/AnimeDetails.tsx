import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHead } from '@unhead/react'
import {Play, Star, Heart, ArrowLeft} from 'lucide-react'
import Navbar from '@/components/Navbar'
import type { Anime } from '@/lib/jikan'
import { displayTitle, getAnimeById, posterOf } from '@/lib/jikan'
import { isFavorite, toggleFavorite } from '@/lib/watch'

function AnimeDetails() {
  const { id } = useParams()
  const malId = Number(id)
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [fav, setFav] = useState(false)
  const [lang, setLang] = useState('sub')

  useHead({ title: anime ? `${displayTitle(anime)} · GlassAnime` : 'Loading · GlassAnime' })

  useEffect(() => {
    let active = true
    setLoading(true)
    setFav(isFavorite(malId))
    getAnimeById(malId)
      .then((a) => active && setAnime(a))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [malId])

  const episodes = useMemo(() => {
    const count = anime?.episodes && anime.episodes > 0 ? Math.min(anime.episodes, 100) : 12
    return Array.from({ length: count }, (_, i) => i + 1)
  }, [anime])

  return (
    <div className="app-bg min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm text-violet-100/70 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {loading ? (
          <div className="glass h-96 w-full animate-pulse rounded-3xl shimmer" />
        ) : !anime ? (
          <div className="glass rounded-2xl p-10 text-center text-violet-100/70">Anime not found.</div>
        ) : (
          <>
            <div className="glass overflow-hidden rounded-3xl">
              <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[260px_1fr]">
                <img
                  src={posterOf(anime)}
                  alt={displayTitle(anime)}
                  className="mx-auto w-48 rounded-2xl object-cover md:w-full"
                />

                <div className="space-y-4">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {displayTitle(anime)}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {typeof anime.score === 'number' && anime.score > 0 ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 font-semibold text-amber-300">
                        <Star className="h-3 w-3" fill="currentColor" /> {anime.score.toFixed(1)}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white/5 px-3 py-1 text-violet-100/80">{anime.type || 'TV'}</span>
                    {anime.episodes ? <span className="rounded-full bg-white/5 px-3 py-1 text-violet-100/80">{anime.episodes} eps</span> : null}
                    {anime.year ? <span className="rounded-full bg-white/5 px-3 py-1 text-violet-100/80">{anime.year}</span> : null}
                    {anime.status ? <span className="rounded-full bg-white/5 px-3 py-1 text-violet-100/80">{anime.status}</span> : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((g) => (
                      <span key={g.mal_id} className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-violet-100/70">
                    {anime.synopsis || 'No synopsis available.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      to={`/watch/${anime.mal_id}?ep=1&lang=${lang}`}
                      className="flex items-center gap-2 rounded-full btn-neon px-6 py-3 text-sm font-semibold text-white"
                    >
                      <Play className="h-4 w-4" fill="currentColor" /> Watch Episode 1
                    </Link>
                    <button
                      onClick={() => setFav(toggleFavorite(anime.mal_id))}
                      className={`flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold transition ${
                        fav ? 'text-rose-300 border-rose-300/40' : 'text-white'
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={fav ? 'currentColor' : 'none'} />
                      {fav ? 'Favorited' : 'Favorite'}
                    </button>

                    <div className="flex items-center gap-1 rounded-full glass p-1">
                      {['sub', 'dub'].map((l) => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            lang === l ? 'bg-cyan-400/20 text-cyan-200' : 'text-violet-100/70'
                          }`}
                        >
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold tracking-tight text-white sm:text-xl">Episodes</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
                {episodes.map((ep) => (
                  <Link
                    key={ep}
                    to={`/watch/${anime.mal_id}?ep=${ep}&lang=${lang}`}
                    className="glass glass-hover grid place-items-center rounded-xl py-3 text-sm font-semibold text-white"
                  >
                    {ep}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default AnimeDetails
