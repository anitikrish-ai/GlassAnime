import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useHead } from '@unhead/react'
import {ArrowLeft, SkipBack, SkipForward, Server} from 'lucide-react'
import Navbar from '@/components/Navbar'
import type { Anime } from '@/lib/jikan'
import { displayTitle, getAnimeById } from '@/lib/jikan'
import { upsertWatch } from '@/lib/watch'

// VidNest anime player embed (AniList/MAL id based). Falls back gracefully.
function buildEmbed(malId: number, ep: number, lang: string, server: string) {
  if (server === 'vidnest') {
    return `https://vidnest.fun/anime/${malId}/${ep}/${lang}`
  }
  return `https://megaplay.buzz/stream/s-2/${malId}-${ep}/${lang}`
}

function Watch() {
  const { id } = useParams()
  const malId = Number(id)
  const [params, setParams] = useSearchParams()
  const ep = Math.max(1, Number(params.get('ep') || 1))
  const lang = params.get('lang') === 'dub' ? 'dub' : 'sub'
  const [server, setServer] = useState('vidnest')
  const [anime, setAnime] = useState<Anime | null>(null)

  useHead({ title: anime ? `Ep ${ep} · ${displayTitle(anime)}` : 'Watching · GlassAnime' })

  useEffect(() => {
    let active = true
    getAnimeById(malId).then((a) => active && setAnime(a))
    return () => {
      active = false
    }
  }, [malId])

  const totalEpisodes = anime?.episodes && anime.episodes > 0 ? anime.episodes : null

  // Save to continue-watching whenever episode/anime resolves
  useEffect(() => {
    if (!anime) return
    upsertWatch({
      malId,
      title: displayTitle(anime),
      poster: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '',
      episode: ep,
      totalEpisodes,
      language: lang,
    })
  }, [anime, malId, ep, lang, totalEpisodes])

  // Listen to player postMessage events (progress / complete / error)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'complete' || data.event === 'ended') {
        // auto-next on completion
        if (!totalEpisodes || ep < totalEpisodes) goTo(ep + 1)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep, totalEpisodes])

  const goTo = (nextEp: number) => {
    const next = new URLSearchParams(params)
    next.set('ep', String(nextEp))
    next.set('lang', lang)
    setParams(next)
  }

  const embed = useMemo(() => buildEmbed(malId, ep, lang, server), [malId, ep, lang, server])

  const hasPrev = ep > 1
  const hasNext = !totalEpisodes || ep < totalEpisodes

  return (
    <div className="app-bg min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          to={`/anime/${malId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-violet-100/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to details
        </Link>

        <div className="glass overflow-hidden rounded-3xl">
          <div className="aspect-video w-full bg-black">
            <iframe
              key={embed}
              src={embed}
              title={`Episode ${ep}`}
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen"
              className="h-full w-full border-0"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-white sm:text-2xl">
              {anime ? displayTitle(anime) : 'Loading...'}
            </h1>
            <p className="text-sm text-violet-200/60">
              Episode {ep}
              {totalEpisodes ? ` / ${totalEpisodes}` : ''} · {lang.toUpperCase()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full glass p-1">
              <Server className="ml-2 h-3.5 w-3.5 text-violet-200/60" />
              {['vidnest', 'megaplay'].map((s) => (
                <button
                  key={s}
                  onClick={() => setServer(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    server === s ? 'bg-cyan-400/20 text-cyan-200' : 'text-violet-100/70'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              disabled={!hasPrev}
              onClick={() => goTo(ep - 1)}
              className="flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-30"
            >
              <SkipBack className="h-4 w-4" /> Prev
            </button>
            <button
              disabled={!hasNext}
              onClick={() => goTo(ep + 1)}
              className="flex items-center gap-2 rounded-full btn-neon px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-30"
            >
              Next <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>

        {totalEpisodes ? (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-violet-200/70">Episodes</h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {Array.from({ length: Math.min(totalEpisodes, 100) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    n === ep ? 'btn-neon text-white' : 'glass glass-hover text-violet-100/80'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default Watch
