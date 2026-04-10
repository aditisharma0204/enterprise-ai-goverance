import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  severityLabel,
  telemetryAlertSeverityClassName,
} from '../../data/alertPresentation'
import {
  TELEMETRY_ALERT_SEVERITY_FILTER_KEYS,
  filterAlertsBySeverity,
  isAlertActive,
  telemetrySeverityFilterLabel,
  type AlertSeverity,
  type AlertSeverityFilter,
  type GlobalAlert,
} from '../../data/globalAlerts'
import { IconChevronRight } from '../icons/AppIcons'

type Props = {
  alerts: GlobalAlert[]
  activeCount: number
}

function severityCount(alerts: GlobalAlert[], sev: AlertSeverity): number {
  return alerts.filter((a) => a.severity === sev).length
}

export function TelemetryAlertsPanel({ alerts, activeCount }: Props) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverityFilter>('all')

  const rows = useMemo(
    () => filterAlertsBySeverity(alerts, severityFilter),
    [alerts, severityFilter],
  )

  const counts = useMemo(
    () => ({
      all: alerts.length,
      critical: severityCount(alerts, 'critical'),
      warning: severityCount(alerts, 'warning'),
      info: severityCount(alerts, 'info'),
    }),
    [alerts],
  )

  return (
    <div className="telemetry-alerts-panel">
      <p className="telemetry-alerts-lead">
        {activeCount === 0 ? 'No active alerts' : `${activeCount} active alerts`}
      </p>

      <div
        className="telemetry-alerts-filters"
        role="toolbar"
        aria-label="Filter alerts by priority"
      >
        {TELEMETRY_ALERT_SEVERITY_FILTER_KEYS.map((key) => {
          const n = counts[key]
          const label = telemetrySeverityFilterLabel(key)
          return (
            <button
              key={key}
              type="button"
              className={`telemetry-alerts-filter${severityFilter === key ? ' telemetry-alerts-filter--active' : ''}`}
              onClick={() => setSeverityFilter(key)}
              aria-pressed={severityFilter === key}
            >
              {label} · {n}
            </button>
          )
        })}
      </div>

      <div className="telemetry-alerts-list gv-scrollbar">
        {rows.length === 0 ? (
          <p className="telemetry-alerts-empty">Nothing matches this filter.</p>
        ) : null}
        {rows.map((a) => (
          <article
            key={a.id}
            className={`telemetry-alert-card${!isAlertActive(a) ? ' telemetry-alert-card--muted' : ''}`}
          >
            <div className="telemetry-alert-card-top">
              <span
                className={`telemetry-alert-severity ${telemetryAlertSeverityClassName(a.severity)}`}
              >
                {severityLabel(a.severity)}
              </span>
              <span className="telemetry-alert-card-time">{a.openedAtLabel}</span>
            </div>
            <h3 className="telemetry-alert-card-title">{a.title}</h3>
            <p className="telemetry-alert-card-desc">{a.description}</p>
            <div className="telemetry-alert-card-foot">
              <span className="telemetry-alert-card-region">{a.region}</span>
              <div className="telemetry-alert-card-actions">
                {a.clusterPath ? (
                  <Link
                    to={a.clusterPath}
                    className="telemetry-alert-investigate"
                    aria-label={`Investigate ${a.title} in Mission Control`}
                  >
                    Investigate
                    <IconChevronRight width={12} height={12} aria-hidden />
                  </Link>
                ) : !isAlertActive(a) ? (
                  <span className="telemetry-alert-card-scope">Resolved</span>
                ) : (
                  <span className="telemetry-alert-card-scope">
                    No linked cluster
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
