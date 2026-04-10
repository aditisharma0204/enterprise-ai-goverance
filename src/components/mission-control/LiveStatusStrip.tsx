import { useMissionCluster } from './MissionClusterContext'

export function LiveStatusStrip() {
  const { remediated, warningsPerMin, secondsSinceSync, liveTick } =
    useMissionCluster()

  const affectedUsers = 847 + (liveTick % 5) * 3
  const edgesMonitored = 128 + (liveTick % 7)

  return (
    <div className="live-status-strip">
      <div className="live-status-left">
        <span className="live-pulse-dot" aria-hidden />
        <span className="live-status-label">Live · 5m rolling window</span>
        <span className="live-status-sep">·</span>
        <span className="live-status-muted">
          Graph synced{' '}
          <strong className="live-status-strong">{secondsSinceSync}s</strong> ago
        </span>
        <span className="live-status-sep">·</span>
        <span className="live-status-muted">
          <strong className="live-status-strong">{edgesMonitored}</strong> edges
          monitored
        </span>
      </div>
      <div className="live-status-right">
        <span className="live-status-muted">Warnings / min (cluster)</span>
        <span
          className={`live-warn-pill${remediated ? ' live-warn-pill--ok' : ''}`}
        >
          {remediated ? '✓ 0' : `⚠ ${warningsPerMin}`}
        </span>
        <span className="live-status-sep">·</span>
        <span className="live-status-muted">
          {remediated ? (
            <>
              Flagged sessions (historical){' '}
              <strong className="live-status-strong">12</strong>
            </>
          ) : (
            <>
              Impacted user sessions (est.){' '}
              <strong className="live-status-strong">{affectedUsers}</strong>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
