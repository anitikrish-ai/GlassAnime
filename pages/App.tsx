import type { RouteObject } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import AnimeDetails from '@/pages/AnimeDetails'
import Watch from '@/pages/Watch'

// Used in @/prerender.tsx
export const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/search', element: <Search /> },
  { path: '/anime/:id', element: <AnimeDetails /> },
  { path: '/watch/:id', element: <Watch /> },
]

function App() {
  return useRoutes(routes)
}

export default App
