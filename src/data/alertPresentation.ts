import type { AlertSeverity, AlertStatus } from './globalAlerts'

/** Matches sidebar filter vocabulary (badges stay scannable at a glance). */
export function severityLabel(s: AlertSeverity): string {
  if (s === 'critical') return 'Urgent'
  if (s === 'warning') return 'Elevated'
  return 'FYI'
}

export function alertStatusLabel(s: AlertStatus): string {
  if (s === 'open') return 'Open'
  if (s === 'acknowledged') return 'Acknowledged'
  return 'Resolved'
}

const TELEMETRY_SEVERITY_CLASS: Record<AlertSeverity, string> = {
  critical: 'telemetry-alert-severity--critical',
  warning: 'telemetry-alert-severity--warning',
  info: 'telemetry-alert-severity--info',
}

export function telemetryAlertSeverityClassName(s: AlertSeverity): string {
  return TELEMETRY_SEVERITY_CLASS[s]
}
