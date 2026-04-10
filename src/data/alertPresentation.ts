import type { AlertStatus } from './globalAlerts'

export function alertStatusLabel(s: AlertStatus): string {
  if (s === 'open') return 'Open'
  if (s === 'acknowledged') return 'Acknowledged'
  return 'Resolved'
}
