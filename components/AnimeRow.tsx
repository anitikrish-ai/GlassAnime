import { useRef } from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import type { Anime } from '@/lib/jikan'
import AnimeCard from '@/components/AnimeCard'

interface Props {
  title: string
  anime: Anime[]
}

function AnimeRow({ title, anime }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  if (!anime.length) return null

  return (
    <section className="fade-up">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scrollBy(-1)}
            className="grid h-9 w-9 place-items-center rounded-full glass text-white transition hover:border-cyan-300/50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="grid h-9 w-9 place-items-center rounded-full glass text-white transition hover:border-cyan-300/50"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2"
      >
        {anime.map((a) => (
          <div key={a.mal_id} className="w-36 shrink-0 snap-start sm:w-44">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AnimeRow
