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
    title: 'Policy drift',
    description: 'Order Processing Agent',
    region: 'Agent USW-7',
    clusterLabel: 'Order Processing Agent',
    clusterPath: ROUTES.agentCluster7,
    status: 'open',
    openedAtLabel: '12m',
  },
  {
    id: 'us-digital-vector',
    severity: 'critical',
    title: 'Retrieval degraded',
    description: 'Digital · vector index',
    region: 'Digital Commerce',
    clusterLabel: 'Digital · vector',
    clusterPath: ROUTES.agentCluster7,
    status: 'open',
    openedAtLabel: '28m',
  },
  {
    id: 'us-supply-egress',
    severity: 'warning',
    title: 'Token egress spike',
    description: 'Supply · gateway pool',
    region: 'Supply Chain',
    clusterLabel: 'Supply · gateway pool',
    clusterPath: ROUTES.agentCluster7,
    status: 'acknowledged',
    openedAtLabel: '1h',
  },
  {
    id: 'us-corp-gov',
    severity: 'info',
    title: 'Export delayed',
    description: 'Compliance audit bundle',
    region: 'Corporate IT',
    status: 'open',
    openedAtLabel: '2h',
  },
]

export function withCluster7Resolved(
  alerts: GlobalAlert[],
  naCluster7Resolved: boolean,
): GlobalAlert[] {
  if (!naCluster7Resolved) return alerts
  return alerts.map((a) => ({ ...a, status: 'resolved' as const }))
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

