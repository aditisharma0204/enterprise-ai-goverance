/** Application routes — single source of truth for path strings. */
export const ROUTES = {
  home: '/',
  agentCluster7: '/clusters/agent-cluster-7',
} as const

/** Syncs with `GlobalViewPage` map layer (continent vs US topology). */
export const GLOBAL_MAP_SCOPE_PARAM = 'mapScope' as const

export type GlobalMapScope = 'north-america' | 'united-states'

export function parseGlobalMapScope(searchParams: URLSearchParams): GlobalMapScope {
  return searchParams.get(GLOBAL_MAP_SCOPE_PARAM) === 'united-states'
    ? 'united-states'
    : 'north-america'
}

/** Deep link to a specific map layer on Global View. */
export function globalViewMapHref(scope: GlobalMapScope): string {
  const q =
    scope === 'united-states'
      ? `${GLOBAL_MAP_SCOPE_PARAM}=united-states`
      : `${GLOBAL_MAP_SCOPE_PARAM}=north-america`
  return `${ROUTES.home}?${q}`
}
