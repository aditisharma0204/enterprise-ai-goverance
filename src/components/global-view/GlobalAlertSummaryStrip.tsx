import type { ActiveAlertSummary } from '../../data/globalAlerts'
import { IconChevronRight } from '../icons/AppIcons'

type Props = {
  summary: ActiveAlertSummary
  onOpenAlertsSidebar: () => void
}

export function GlobalAlertSummaryStrip({ summary, onOpenAlertsSidebar }: Props) {
  return (
    <div
      className="global-alert-summary"
      role="status"
      aria-live="polite"
      aria-label={`${summary.total} open alerts`}
    >
      <div className="global-alert-summary-left">
        <div className="global-alert-ping-wrap" aria-hidden>
          <span className="global-alert-ping" />
          <span className="global-alert-dot" />
        </div>
        <div className="global-alert-summary-text">
          <span className="global-alert-summary-count">{summary.total} open alerts</span>
          <span className="global-alert-summary-meta" aria-hidden>
            ·
          </span>
          {summary.critical > 0 ? (
            <span className="global-alert-summary-meta global-alert-summary-meta--critical">
              {summary.critical} critical
            </span>
          ) : (
            <span className="global-alert-summary-meta">No critical</span>
          )}
          <span className="global-alert-summary-meta" aria-hidden>
            ·
          </span>
          <span className="global-alert-summary-meta">
            {summary.regionCount} operational zone
            {summary.regionCount !== 1 ? 's' : ''}
          </span>
          {summary.top ? (
            <>
              <span className="global-alert-summary-meta" aria-hidden>
                ·
              </span>
              <span className="global-alert-summary-hint" title={summary.top.description}>
                Top: {summary.top.title}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <div className="global-alert-summary-actions">
        <button type="button" className="global-alert-cta" onClick={onOpenAlertsSidebar}>
          View alerts
          <IconChevronRight />
        </button>
      </div>
    </div>
  )
}
