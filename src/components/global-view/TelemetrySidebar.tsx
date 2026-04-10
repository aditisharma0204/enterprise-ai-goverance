import type { ReactNode } from 'react'

export const TELEMETRY_METRICS_PANEL_ID = 'telemetry-panel-metrics'
export const TELEMETRY_ALERTS_PANEL_ID = 'telemetry-panel-alerts'

export type TelemetrySidebarPanel = 'metrics' | 'alerts'

type Props = {
  panel: TelemetrySidebarPanel
  onPanelChange: (panel: TelemetrySidebarPanel) => void
  activeAlertCount: number
  /** Shown under the aside title — ties telemetry to map scope */
  scopeLine?: string
  metricsPanel: ReactNode
  alertsPanel: ReactNode
}

/**
 * Shell + tabs only; content is injected (Open/Closed — easy to extend with new tabs).
 */
export function TelemetrySidebar({
  panel,
  onPanelChange,
  activeAlertCount,
  scopeLine,
  metricsPanel,
  alertsPanel,
}: Props) {
  return (
    <aside className="telemetry-aside gv-scrollbar" aria-label="Live system telemetry">
      <div className="telemetry-aside-head telemetry-aside-head--tabbed">
        <div className="telemetry-aside-toprow">
          <h2 className="telemetry-aside-title" id="telemetry-aside-heading">
            Live System Telemetry
          </h2>
          {panel === 'metrics' ? (
            <div className="telemetry-live">
              <span className="telemetry-live-dot" />
              Live
            </div>
          ) : (
            <span className="telemetry-aside-head-spacer" aria-hidden />
          )}
        </div>
        {scopeLine ? (
          <p className="telemetry-aside-scope-line">{scopeLine}</p>
        ) : null}
        <div
          className="telemetry-tablist"
          role="tablist"
          aria-label="Telemetry views"
          aria-labelledby="telemetry-aside-heading"
        >
          <button
            type="button"
            role="tab"
            id="tab-telemetry-metrics"
            aria-selected={panel === 'metrics'}
            aria-controls={TELEMETRY_METRICS_PANEL_ID}
            tabIndex={panel === 'metrics' ? 0 : -1}
            className={`telemetry-tab${panel === 'metrics' ? ' telemetry-tab--active' : ''}`}
            onClick={() => onPanelChange('metrics')}
          >
            Metrics
          </button>
          <button
            type="button"
            role="tab"
            id="tab-telemetry-alerts"
            aria-selected={panel === 'alerts'}
            aria-controls={TELEMETRY_ALERTS_PANEL_ID}
            tabIndex={panel === 'alerts' ? 0 : -1}
            className={`telemetry-tab${panel === 'alerts' ? ' telemetry-tab--active' : ''}`}
            onClick={() => onPanelChange('alerts')}
          >
            Alerts
            {activeAlertCount > 0 ? (
              <span className="telemetry-tab-badge">{activeAlertCount}</span>
            ) : null}
          </button>
        </div>
      </div>
      <div className="telemetry-aside-panels">
        <div
          id={TELEMETRY_METRICS_PANEL_ID}
          className="telemetry-aside-body gv-scrollbar telemetry-tabpanel"
          role="tabpanel"
          aria-labelledby="tab-telemetry-metrics"
          aria-describedby={panel === 'metrics' ? 'telemetry-metrics-scope' : undefined}
          hidden={panel !== 'metrics'}
        >
          {metricsPanel}
        </div>
        <div
          id={TELEMETRY_ALERTS_PANEL_ID}
          className="telemetry-aside-body gv-scrollbar telemetry-tabpanel"
          role="tabpanel"
          aria-labelledby="tab-telemetry-alerts"
          hidden={panel !== 'alerts'}
          tabIndex={-1}
        >
          {alertsPanel}
        </div>
      </div>
    </aside>
  )
}
