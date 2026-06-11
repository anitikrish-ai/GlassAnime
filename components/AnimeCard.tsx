import { Link } from 'react-router-dom'
import {Star, Play} from 'lucide-react'
import type { Anime } from '@/lib/jikan'
import { displayTitle, posterOf } from '@/lib/jikan'

interface Props {
  anime: Anime
  className?: string
}

function AnimeCard({ anime, className = '' }: Props) {
  const poster = posterOf(anime)
  const title = displayTitle(anime)

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className={`glass glass-hover group block overflow-hidden rounded-2xl ${className}`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-white/5" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#07060f] via-[#07060f]/20 to-transparent" />

        {typeof anime.score === 'number' && anime.score > 0 ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
            <Star className="h-3 w-3" fill="currentColor" />
            {anime.score.toFixed(1)}
          </div>
        ) : null}

        <div className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
          <span className="grid h-12 w-12 place-items-center rounded-full btn-neon">
            <Play className="h-5 w-5 text-cyan-200" fill="currentColor" />
          </span>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">{title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-violet-200/60">
          {anime.type || 'TV'}
          {anime.episodes ? ` · ${anime.episodes} eps` : ''}
          {anime.year ? ` · ${anime.year}` : ''}
        </p>
      </div>
    </Link>
  )
}

export default AnimeCard
