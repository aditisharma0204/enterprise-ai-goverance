import type { GlobalMapScope } from '../../constants/routes'
import { IconTrendUp } from '../icons/AppIcons'

type Props = {
  mapScope: GlobalMapScope
  /** When true, Order Processing Agent healthy — affects US-footprint trust / nodes */
  incidentResolved: boolean
  healthyCount: number
  activeCriticalCount: number
  activeWarningCount: number
}

/** US topology map: routers + agents in view (demo counts, coherent with scope). */
function usFootprintNodes(incidentResolved: boolean) {
  if (incidentResolved) {
    return { total: 14, healthy: 14, urgent: 0, elevated: 0 }
  }
  return { total: 14, healthy: 12, urgent: 1, elevated: 1 }
}

/** Metrics tab body — values and labels follow map scope (continent vs US drill-in). */
export function TelemetryMetricsPanel({
  mapScope,
  incidentResolved,
  healthyCount,
  activeCriticalCount,
  activeWarningCount,
}: Props) {
  const isContinent = mapScope === 'north-america'
  const us = usFootprintNodes(incidentResolved)

  const requests = isContinent
    ? { value: '14.2M', trend: '12%', label: 'Total requests' }
    : { value: '9.8M', trend: '9%', label: 'US cell traffic' }

  const trust = isContinent
    ? { value: '98.7%', sub: 'North America avg' }
    : {
        value: incidentResolved ? '98.6%' : '98.2%',
        sub: 'United States avg',
      }

  const sessions = isContinent
    ? { value: '42,891', sub: 'Active across region' }
    : { value: '28,400', sub: 'US store & digital' }

  const latency = isContinent
    ? { value: '124', sub: 'avg across North America' }
    : { value: '108', sub: 'avg US footprint' }

  return (
    <>
      <p className="telemetry-metrics-scope" id="telemetry-metrics-scope">
        {isContinent
          ? 'Scope: North America — all 43 agent clusters on the map.'
          : 'Scope: United States — hubs & agents on this map only.'}
      </p>

      <div className="telemetry-card">
        <div className="telemetry-label-row">
          {requests.label}
          <span className="telemetry-trend-up">
            <IconTrendUp /> {requests.trend}
          </span>
        </div>
        <div className="telemetry-value-xl">
          {requests.value} <span className="telemetry-value-unit">/min</span>
        </div>
        <div className="telemetry-bars" aria-hidden>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="telemetry-bar" />
          ))}
        </div>
      </div>

      <div className="telemetry-card">
        <div className="telemetry-label-row">Trust score trend</div>
        <div className="telemetry-value-inline">
          <div className="telemetry-value-xl">{trust.value}</div>
          <div className="telemetry-value-unit telemetry-value-unit--sub">
            {trust.sub}
          </div>
        </div>
        <div className="telemetry-sparkline-wrap">
          <svg preserveAspectRatio="none" viewBox="0 0 100 40" aria-hidden>
            <path
              d="M0,30 C20,30 30,10 50,15 C70,20 80,5 100,10"
              fill="none"
              stroke="var(--accent-teal)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,30 C20,30 30,10 50,15 C70,20 80,5 100,10 L100,40 L0,40 Z"
              fill="url(#gv-spark-grad)"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gv-spark-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-teal)" />
                <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="telemetry-card telemetry-split">
        <div>
          <div className="telemetry-stat-label">Active sessions</div>
          <div className="telemetry-stat-value">{sessions.value}</div>
        </div>
        <div className="telemetry-hr" />
        <div>
          <div className="telemetry-stat-label">System latency</div>
          <div className="telemetry-stat-value">
            {latency.value}ms{' '}
            <span className="telemetry-stat-context">{latency.sub}</span>
          </div>
        </div>
      </div>

      {isContinent ? (
        <div className="telemetry-card telemetry-card--elevated">
          <div className="telemetry-node-head">
            Agent clusters
            <span className="telemetry-node-pill">43 total</span>
          </div>
          <p className="telemetry-node-scope-hint">Canada · United States · Mexico</p>
          <div className="telemetry-status-rows">
            <div className="telemetry-status-row">
              <div className="telemetry-status-label" style={{ color: 'var(--status-success)' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--status-success-dot)',
                  }}
                />
                Healthy
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{healthyCount}</span>
            </div>
            <div
              className={`telemetry-status-row${activeCriticalCount ? '' : ' telemetry-status-row--muted'}`}
            >
              <div
                className="telemetry-status-label"
                style={{ color: activeCriticalCount ? 'var(--status-danger)' : undefined }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: activeCriticalCount ? 'var(--status-danger)' : 'var(--border-color)',
                    opacity: activeCriticalCount ? 1 : 0.5,
                  }}
                />
                Urgent
              </div>
              <span className="telemetry-status-count" style={{ fontWeight: 700 }}>
                {activeCriticalCount}
              </span>
            </div>
            <div
              className={`telemetry-status-row${activeWarningCount ? '' : ' telemetry-status-row--muted'}`}
            >
              <div
                className="telemetry-status-label"
                style={{
                  color: activeWarningCount ? 'var(--status-warning-text)' : undefined,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: activeWarningCount ? 'var(--status-warning)' : 'var(--border-color)',
                  }}
                />
                Elevated
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: activeWarningCount ? 'var(--text-primary)' : undefined,
                }}
              >
                {activeWarningCount}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="telemetry-card telemetry-card--elevated">
          <div className="telemetry-node-head">
            Nodes in this map
            <span className="telemetry-node-pill">{us.total} in view</span>
          </div>
          <p className="telemetry-node-scope-hint">East / West hubs, gateway & QA path</p>
          <div className="telemetry-status-rows">
            <div className="telemetry-status-row">
              <div className="telemetry-status-label" style={{ color: 'var(--status-success)' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--status-success-dot)',
                  }}
                />
                Healthy
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{us.healthy}</span>
            </div>
            <div
              className={`telemetry-status-row${us.urgent ? '' : ' telemetry-status-row--muted'}`}
            >
              <div
                className="telemetry-status-label"
                style={{ color: us.urgent ? 'var(--status-danger)' : undefined }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: us.urgent ? 'var(--status-danger)' : 'var(--border-color)',
                    opacity: us.urgent ? 1 : 0.5,
                  }}
                />
                Urgent
              </div>
              <span className="telemetry-status-count" style={{ fontWeight: 700 }}>
                {us.urgent}
              </span>
            </div>
            <div
              className={`telemetry-status-row${us.elevated ? '' : ' telemetry-status-row--muted'}`}
            >
              <div
                className="telemetry-status-label"
                style={{
                  color: us.elevated ? 'var(--status-warning-text)' : undefined,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: us.elevated ? 'var(--status-warning)' : 'var(--border-color)',
                  }}
                />
                Elevated
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: us.elevated ? 'var(--text-primary)' : undefined,
                }}
              >
                {us.elevated}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
