import { Link } from 'react-router-dom'
import { isAlertActive, type GlobalAlert } from '../../data/globalAlerts'
import { IconChevronRight } from '../icons/AppIcons'

type Props = {
  alerts: GlobalAlert[]
  activeCount: number
}

const SEV_DOT_COLOR: Record<string, string> = {
  critical: 'var(--status-danger-text)',
  warning: 'var(--status-warning-text)',
  info: 'var(--accent-teal)',
}

export function TelemetryAlertsPanel({ alerts, activeCount }: Props) {
  return (
    <div className="telemetry-alerts-panel">
      <p className="telemetry-alerts-lead">
        {activeCount === 0 ? 'No active alerts' : `${activeCount} active alerts`}
      </p>

      <div className="telemetry-alerts-list gv-scrollbar">
        {alerts.map((a) => {
          const muted = !isAlertActive(a)
          return (
            <div
              key={a.id}
              className={`ta-row${muted ? ' ta-row--muted' : ''}`}
            >
              <span
                className="ta-dot"
                style={{ background: SEV_DOT_COLOR[a.severity] }}
              />
              <div className="ta-body">
                <span className="ta-title">{a.title}</span>
                <span className="ta-sub">{a.description}</span>
              </div>
              <span className="ta-time">{a.openedAtLabel}</span>
              {a.clusterPath && isAlertActive(a) ? (
                <Link
                  to={a.clusterPath}
                  className="ta-action"
                  aria-label={`View ${a.title}`}
                >
                  <IconChevronRight width={14} height={14} aria-hidden />
                </Link>
              ) : muted ? (
                <span className="ta-resolved">Resolved</span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
