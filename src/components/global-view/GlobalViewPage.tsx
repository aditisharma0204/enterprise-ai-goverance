import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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

const MAP_W = 1100
const MAP_H = 700

function useMapFit(ref: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const sw = el.clientWidth / MAP_W
      const sh = el.clientHeight / MAP_H
      el.style.setProperty('--map-fit', String(Math.min(1, sw, sh)))
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [ref])
}

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
  const mapShellRef = useRef<HTMLDivElement>(null)
  useMapFit(mapShellRef)

  const {
    alertRows,
    activeAlerts,
    summary,
    activeAlertCount,
    activeCriticalCount,
    activeWarningCount,
  } = useGlobalViewAlerts(naCluster7Resolved)

  const healthyCount = naCluster7Resolved ? 43 : 42

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
              </div>
              {/* Back button hidden for demo */}
            </div>

            <div className="global-work-area">
              <div ref={mapShellRef} className="global-map-shell gv-grid-bg">
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
