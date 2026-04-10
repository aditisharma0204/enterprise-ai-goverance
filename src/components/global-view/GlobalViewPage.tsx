import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  GLOBAL_MAP_SCOPE_PARAM,
  globalViewMapHref,
  parseGlobalMapScope,
  ROUTES,
  type GlobalMapScope,
} from '../../constants/routes'
import { useNaCluster7 } from '../../context/NaCluster7Context'
import { useGlobalViewAlerts } from '../../hooks/useGlobalViewAlerts'
import '../../missionControl.css'
import '../../globalView.css'
import { IconExpand, IconZoomIn, IconZoomOut } from '../icons/AppIcons'
import { TrustOpsHeader } from '../shell/TrustOpsHeader'
import { GlobalAlertSummaryStrip } from './GlobalAlertSummaryStrip'
import { GlobalSuccessStrip } from './GlobalSuccessStrip'
import { TelemetryAlertsPanel } from './TelemetryAlertsPanel'
import { TelemetryMetricsPanel } from './TelemetryMetricsPanel'
import {
  TELEMETRY_ALERTS_PANEL_ID,
  TelemetrySidebar,
  type TelemetrySidebarPanel,
} from './TelemetrySidebar'
import { AgentClusterModal } from './AgentClusterModal'
import { ContinentOverviewCanvas } from './ContinentOverviewCanvas'
import { TopologyCanvas } from './TopologyCanvas'

export function GlobalViewPage() {
  const { naCluster7Resolved, restartDemo } = useNaCluster7()
  const [searchParams, setSearchParams] = useSearchParams()
  const mapScope = useMemo(
    () => parseGlobalMapScope(searchParams),
    [searchParams],
  )
  const setMapScope = useCallback(
    (next: GlobalMapScope) => {
      if (next === 'north-america') {
        setSearchParams({}, { replace: false })
      } else {
        setSearchParams({ [GLOBAL_MAP_SCOPE_PARAM]: 'united-states' }, { replace: false })
      }
    },
    [setSearchParams],
  )
  const [telemetryPanel, setTelemetryPanel] = useState<TelemetrySidebarPanel>('metrics')
  const [clusterModalOpen, setClusterModalOpen] = useState(false)
  const focusAlertsAfterBannerCta = useRef(false)

  const {
    alertRows,
    activeAlerts,
    summary,
    activeAlertCount,
    activeCriticalCount,
    activeWarningCount,
    activeInfoCount,
  } = useGlobalViewAlerts(naCluster7Resolved)

  const healthyCount = naCluster7Resolved ? 22 : 21

  useEffect(() => {
    if (telemetryPanel !== 'alerts' || !focusAlertsAfterBannerCta.current) return
    focusAlertsAfterBannerCta.current = false
    requestAnimationFrame(() => {
      document.getElementById(TELEMETRY_ALERTS_PANEL_ID)?.focus()
    })
  }, [telemetryPanel])

  const openAlertsFromBanner = () => {
    focusAlertsAfterBannerCta.current = true
    setTelemetryPanel('alerts')
  }

  return (
    <div className="mission-root">
      <div className="app-window global-app-window">
        <TrustOpsHeader />

        {naCluster7Resolved ? (
          <GlobalSuccessStrip onRestartDemo={restartDemo} />
        ) : activeAlerts.length > 0 ? (
          <GlobalAlertSummaryStrip summary={summary} onOpenAlertsSidebar={openAlertsFromBanner} />
        ) : null}

        <div className="global-body">
          <TelemetrySidebar
            panel={telemetryPanel}
            onPanelChange={setTelemetryPanel}
            activeAlertCount={activeAlertCount}
            scopeLine={
              mapScope === 'north-america'
                ? 'North America · all clusters'
                : 'United States · this map'
            }
            metricsPanel={
              <TelemetryMetricsPanel
                mapScope={mapScope}
                incidentResolved={naCluster7Resolved}
                healthyCount={healthyCount}
                activeCriticalCount={activeCriticalCount}
                activeWarningCount={activeWarningCount}
                activeInfoCount={activeInfoCount}
              />
            }
            alertsPanel={
              <TelemetryAlertsPanel alerts={alertRows} activeCount={activeAlertCount} />
            }
          />

          <main className="global-main">
            <div className="global-page-header">
              <div>
                <div className="global-breadcrumbs">
                  <Link to={ROUTES.home} className="global-crumb-link">
                    Global View
                  </Link>
                  <span className="global-crumb-sep">/</span>
                  {mapScope === 'north-america' ? (
                    <span className="global-crumb-current">North America</span>
                  ) : (
                    <>
                      <Link to={globalViewMapHref('north-america')} className="global-crumb-link">
                        North America
                      </Link>
                      <span className="global-crumb-sep">/</span>
                      <span className="global-crumb-current">United States</span>
                    </>
                  )}
                </div>
                <h1 className="global-page-title">
                  {mapScope === 'north-america'
                    ? 'AI agents across North America'
                    : 'US hubs & store-field footprint'}
                </h1>
                <p className="global-page-subtitle">
                  {mapScope === 'north-america'
                    ? 'Where store assistants and digital agents run today — Canada, US, and Mexico.'
                    : 'East and West auth hubs, gateway, and Agent Cluster 7 (drill down in Mission Control).'}
                </p>
              </div>
              {mapScope === 'united-states' ? (
                <button
                  type="button"
                  className="global-scope-back btn btn-outline"
                  onClick={() => setMapScope('north-america')}
                >
                  ← Continent overview
                </button>
              ) : null}
            </div>

            <div className="global-work-area">
              <div className="global-map-shell gv-grid-bg gv-scrollbar">
                {mapScope === 'north-america' ? (
                  <div key="map-continent" className="global-map-stage global-map-stage--continent">
                    <ContinentOverviewCanvas
                      incidentResolved={naCluster7Resolved}
                      onOpenUnitedStates={() => setMapScope('united-states')}
                    />
                  </div>
                ) : (
                  <div key="map-us" className="global-map-stage global-map-stage--us-zoom-in">
                    <TopologyCanvas
                      incidentResolved={naCluster7Resolved}
                      onOpenCluster={() => setClusterModalOpen(true)}
                    />
                  </div>
                )}
              </div>

              {mapScope === 'united-states' ? (
                <div className="global-zoom-rail">
                  <button type="button" className="global-zoom-btn" aria-label="Zoom in">
                    <IconZoomIn />
                  </button>
                  <button type="button" className="global-zoom-btn" aria-label="Zoom out">
                    <IconZoomOut />
                  </button>
                  <button
                    type="button"
                    className="global-zoom-btn global-zoom-btn--spaced"
                    aria-label="Fit view"
                  >
                    <IconExpand />
                  </button>
                </div>
              ) : null}
            </div>
          </main>
        </div>

        <AgentClusterModal
          open={clusterModalOpen}
          onClose={() => setClusterModalOpen(false)}
          incidentResolved={naCluster7Resolved}
        />
      </div>
    </div>
  )
}
