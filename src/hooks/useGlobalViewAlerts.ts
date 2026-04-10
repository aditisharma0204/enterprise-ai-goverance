import { useMemo } from 'react'
import {
  GLOBAL_ALERTS,
  isAlertActive,
  summarizeActiveAlerts,
  withCluster7Resolved,
} from '../data/globalAlerts'

/**
 * Derived global alert state from the demo remediation flag (injectable for tests / SRP).
 */
export function useGlobalViewAlerts(naCluster7Resolved: boolean) {
  const alertRows = useMemo(
    () => withCluster7Resolved(GLOBAL_ALERTS, naCluster7Resolved),
    [naCluster7Resolved],
  )

  const activeAlerts = useMemo(() => alertRows.filter(isAlertActive), [alertRows])

  const summary = useMemo(() => summarizeActiveAlerts(activeAlerts), [activeAlerts])

  return {
    alertRows,
    activeAlerts,
    summary,
    activeAlertCount: activeAlerts.length,
    activeCriticalCount: summary.critical,
    activeWarningCount: summary.warning,
    activeInfoCount: summary.info,
  }
}
