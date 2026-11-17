import { useCallback, useEffect, useState } from 'react'

export type Route =
  | { page: 'calc' }
  | { page: 'saved' }
  | { page: 'detail'; id: string }

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '')

  if (hash.startsWith('/saved/')) {
    const id = decodeURIComponent(hash.slice('/saved/'.length))
    if (id) return { page: 'detail', id }
  }

  if (hash === '/saved') return { page: 'saved' }
  return { page: 'calc' }
}

export function useHashRoute(): [Route, (hash: string) => void] {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const handleChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const navigate = useCallback((hash: string) => {
    if (window.location.hash === hash) {
      setRoute(readRoute())
      return
    }
    window.location.hash = hash
  }, [])

  return [route, navigate]
}
