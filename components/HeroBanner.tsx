import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Play, Info, Star} from 'lucide-react'
import type { Anime } from '@/lib/jikan'
import { displayTitle, posterOf } from '@/lib/jikan'

interface Props {
  items: Anime[]
}

function HeroBanner({ items }: Props) {
  const [index, setIndex] = useState(0)
  const slides = items.slice(0, 5)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  if (!slides.length) return null
  const a = slides[index]

  return (
    <div className="relative h-[62vh] min-h-[380px] w-full overflow-hidden rounded-3xl glass">
      <img
        key={a.mal_id}
        src={posterOf(a)}
        alt={displayTitle(a)}
        className="absolute inset-0 h-full w-full object-cover fade-up"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07060f] via-[#07060f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07060f] to-transparent" />

      <div className="relative flex h-full max-w-2xl flex-col justify-end gap-4 p-6 sm:p-10">
        {typeof a.score === 'number' && a.score > 0 ? (
          <div className="flex w-fit items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-300/30">
            <Star className="h-3 w-3" fill="currentColor" /> {a.score.toFixed(1)} Rated
          </div>
        ) : null}

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          {displayTitle(a)}
        </h1>

        <p className="line-clamp-3 max-w-xl text-sm text-violet-100/70 sm:text-base">
          {a.synopsis || 'Stream the latest and greatest anime in crisp quality.'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/watch/${a.mal_id}?ep=1&lang=sub`}
            className="flex items-center gap-2 rounded-full btn-neon px-6 py-3 text-sm font-semibold text-white"
          >
            <Play className="h-4 w-4" fill="currentColor" /> Watch Now
          </Link>
          <Link
            to={`/anime/${a.mal_id}`}
            className="flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
          >
            <Info className="h-4 w-4" /> Details
          </Link>
        </div>

        <div className="flex gap-2 pt-2">
          {slides.map((s, i) => (
            <button
              key={s.mal_id}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-cyan-300' : 'w-3 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
