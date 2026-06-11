import { Link } from 'react-router-dom'
import {Play, History} from 'lucide-react'
import type { WatchItem } from '@/lib/watch'

interface Props {
  items: WatchItem[]
}

function ContinueWatching({ items }: Props) {
  if (!items.length) return null

  return (
    <section className="fade-up">
      <div className="mb-3 flex items-center gap-2">
        <History className="h-5 w-5 text-cyan-300" />
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">Continue Watching</h2>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.malId}
            to={`/watch/${item.malId}?ep=${item.episode}&lang=${item.language}`}
            className="glass glass-hover group relative w-64 shrink-0 overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {item.poster ? (
                <img src={item.poster} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-white/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07060f] to-transparent" />
              <span className="absolute inset-0 m-auto grid h-11 w-11 place-items-center rounded-full btn-neon opacity-0 transition group-hover:opacity-100">
                <Play className="h-4 w-4 text-cyan-200" fill="currentColor" />
              </span>
            </div>
            <div className="px-3 py-2.5">
              <h3 className="line-clamp-1 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-0.5 text-xs text-violet-200/60">
                Episode {item.episode}
                {item.totalEpisodes ? ` / ${item.totalEpisodes}` : ''} · {item.language.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ContinueWatching
