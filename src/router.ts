import { useEffect, useState } from 'react'

export type Route = 'home' | 'plan' | 'checks' | 'theory' | 'formulas'

export const ROUTE_META: Record<Route, { hash: string; title: string }> = {
  home: { hash: '#/', title: 'Маршрут: математика' },
  plan: { hash: '#/plan', title: 'План — Маршрут: математика' },
  checks: { hash: '#/checks', title: 'Проверки — Маршрут: математика' },
  theory: { hash: '#/theory', title: 'Теория — Маршрут: математика' },
  formulas: { hash: '#/formulas', title: 'Формулы — Маршрут: математика' },
}

function parseHash(hash: string): Route {
  if (hash.startsWith(ROUTE_META.plan.hash)) return 'plan'
  if (hash.startsWith(ROUTE_META.checks.hash)) return 'checks'
  if (hash.startsWith(ROUTE_META.theory.hash)) return 'theory'
  // «#/formulas/12» — та же страница с раскрытой темой, поэтому startsWith, а не равенство
  if (hash.startsWith(ROUTE_META.formulas.hash)) return 'formulas'
  return 'home'
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}
