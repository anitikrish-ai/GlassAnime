import { Link, useNavigate } from 'react-router-dom'
import {Search, Play, Menu, X} from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-violet-500/30 border border-cyan-300/40">
              <Play className="h-4 w-4 text-cyan-300" fill="currentColor" />
            </span>
            <span className="hidden text-base font-extrabold tracking-tight text-white sm:block">
              Glass<span className="text-cyan-300">Anime</span>
            </span>
          </Link>

          <form onSubmit={submit} className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-200/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anime, genres, seasons..."
              className="w-full rounded-full bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-violet-200/50 outline-none ring-1 ring-white/10 transition focus:ring-cyan-300/60"
            />
          </form>

          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium text-violet-100/80 transition hover:bg-white/5 hover:text-white">
              Home
            </Link>
            <Link to="/search" className="rounded-full px-3 py-2 text-sm font-medium text-violet-100/80 transition hover:bg-white/5 hover:text-white">
              Browse
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white ring-1 ring-white/10 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-violet-100/90 hover:bg-white/5">
                Home
              </Link>
              <Link to="/search" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-violet-100/90 hover:bg-white/5">
                Browse
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Navbar
