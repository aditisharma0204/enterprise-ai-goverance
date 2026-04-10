import { ROUTES } from '../constants/routes'

export type AlertSeverity = 'critical' | 'warning' | 'info'

export type AlertStatus = 'open' | 'acknowledged' | 'resolved'

export type GlobalAlert = {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  /** Logical zone for US retail IT (stores, digital, supply chain, corporate). */
  region: string
  clusterLabel?: string
  clusterPath?: string
  status: AlertStatus
  openedAtLabel: string
}

/**
 * Demo catalog framed for US national retail IT (e.g. Home Depot: US stores + digital;
 * Canada exists for the real company but this v1 copy stays US-centric for stakeholder review).
 */
export const GLOBAL_ALERTS: GlobalAlert[] = [
  {
    id: 'ac7-drift',
    severity: 'warning',
    title: 'Policy drift · Order Processing Agent',
    description: 'Store & field traffic outside approved guardrails.',
    region: 'US — stores & field',
    clusterLabel: 'Order Processing Agent',
    clusterPath: ROUTES.agentCluster7,
    status: 'open',
    openedAtLabel: '12 min ago',
  },
  {
    id: 'us-digital-vector',
    severity: 'critical',
    title: 'Vector index SLO breach',
    description: 'Embedding lag over 15m; digital retrieval degraded.',
    region: 'US — digital',
    clusterLabel: 'Digital · vector',
    clusterPath: ROUTES.agentCluster7,
    status: 'open',
    openedAtLabel: '28 min ago',
  },
  {
    id: 'us-supply-egress',
    severity: 'warning',
    title: 'LLM egress spike',
    description: 'Token volume above 7-day baseline in supply sandbox.',
    region: 'US — supply chain',
    clusterLabel: 'Supply · gateway pool',
    clusterPath: ROUTES.agentCluster7,
    status: 'acknowledged',
    openedAtLabel: '1 hr ago',
  },
  {
    id: 'us-corp-gov',
    severity: 'info',
    title: 'Audit export delayed',
    description: 'Compliance bundle retrying to secure bucket.',
    region: 'US — corporate IT',
    status: 'open',
    openedAtLabel: '2 hr ago',
  },
]

export function withCluster7Resolved(
  alerts: GlobalAlert[],
  naCluster7Resolved: boolean,
): GlobalAlert[] {
  if (!naCluster7Resolved) return alerts
  return alerts.map((a) =>
    a.id === 'ac7-drift' ? { ...a, status: 'resolved' as const } : a,
  )
}

export function isAlertActive(a: GlobalAlert): boolean {
  return a.status === 'open' || a.status === 'acknowledged'
}

export type ActiveAlertSummary = {
  total: number
  critical: number
  warning: number
  info: number
  regionCount: number
  top: GlobalAlert | null
}

export function summarizeActiveAlerts(active: GlobalAlert[]): ActiveAlertSummary {
  const sorted = [...active].sort((a, b) => {
    const rank = { critical: 0, warning: 1, info: 2 } as const
    return rank[a.severity] - rank[b.severity]
  })
  const critical = active.filter((a) => a.severity === 'critical').length
  const warning = active.filter((a) => a.severity === 'warning').length
  const info = active.filter((a) => a.severity === 'info').length
  const regions = new Set(active.map((a) => a.region))
  return {
    total: active.length,
    critical,
    warning,
    info,
    regionCount: regions.size,
    top: sorted[0] ?? null,
  }
}

export type AlertSeverityFilter = 'all' | AlertSeverity

export function filterAlertsBySeverity(
  alerts: GlobalAlert[],
  filter: AlertSeverityFilter,
): GlobalAlert[] {
  if (filter === 'all') return alerts
  return alerts.filter((a) => a.severity === filter)
}

/** Sidebar filter keys (labels + counts composed in `TelemetryAlertsPanel`). */
export const TELEMETRY_ALERT_SEVERITY_FILTER_KEYS: AlertSeverityFilter[] = [
  'all',
  'critical',
  'warning',
  'info',
]

/** Plain-language priority labels — scannable, not cryptic abbreviations. */
export function telemetrySeverityFilterLabel(key: AlertSeverityFilter): string {
  if (key === 'all') return 'All'
  if (key === 'critical') return 'Urgent'
  if (key === 'warning') return 'Elevated'
  return 'FYI'
}
