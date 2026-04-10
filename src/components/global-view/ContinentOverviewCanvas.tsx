import { type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NA_MAP_IMG_HEIGHT,
  NA_MAP_IMG_WIDTH,
  US_MAP_HIT_PATH,
  naClusterStatuses,
  naMapContentGroupTransform,
} from '../../data/naClusterMarkers'
import { ROUTES } from '../../constants/routes'

type Props = {
  /** US cluster healthy after demo resolution */
  incidentResolved?: boolean
  onOpenUnitedStates: () => void
}

const MAP_SRC = `${import.meta.env.BASE_URL}north-america.png`
const MAP_CONTENT_TRANSFORM = naMapContentGroupTransform()
const AC7_ID = 'us-ac7'

function keyActivate(e: KeyboardEvent, action: () => void): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    action()
  }
}

/**
 * North America basemap (PNG in /public) with agent clusters in image pixel space.
 * Open U.S. hubs by clicking the contiguous United States; open Mission Control from Order Processing Agent.
 */
export function ContinentOverviewCanvas({
  incidentResolved = false,
  onOpenUnitedStates,
}: Props) {
  const navigate = useNavigate()
  const clusters = naClusterStatuses(incidentResolved)

  return (
    <div className="global-continent-scale">
      <p className="sr-only">
        North America map with twenty-two agent cluster markers. Click the United
        States region to open the U.S. hub map. Click Order Processing Agent to open Mission
        Control.
      </p>

      <svg
        className="global-continent-svg"
        viewBox="0 0 1200 750"
        role="application"
        aria-label="North America agent footprint map"
      >
        <g transform={MAP_CONTENT_TRANSFORM}>
          <g className="continent-map-layer">
            <image
              href={MAP_SRC}
              x="0"
              y="0"
              width={NA_MAP_IMG_WIDTH}
              height={NA_MAP_IMG_HEIGHT}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          <path
            className="continent-country-hit continent-country-hit--us"
            d={US_MAP_HIT_PATH}
            fill="rgba(0,0,0,0)"
            stroke="none"
            tabIndex={0}
            role="button"
            aria-label="United States — open U.S. hub map"
            onClick={onOpenUnitedStates}
            onKeyDown={(e) => keyActivate(e, onOpenUnitedStates)}
          />

          <g className="continent-clusters">
            {clusters.map((c) => {
              const isAc7 = c.id === AC7_ID
              const openMissionControl = () => navigate(ROUTES.agentCluster7)

              return (
                <g
                  key={c.id}
                  className={`continent-cluster${isAc7 ? ' continent-cluster--interactive' : ''}`}
                  transform={`translate(${c.cx} ${c.cy})`}
                  {...(isAc7
                    ? {
                        role: 'link' as const,
                        tabIndex: 0,
                        'aria-label': `${c.label}. Open Mission Control.`,
                        onClick: openMissionControl,
                        onKeyDown: (e: KeyboardEvent) =>
                          keyActivate(e, openMissionControl),
                      }
                    : {})}
                >
                  {isAc7 ? (
                    <circle
                      className="continent-cluster-hit"
                      r={280}
                      fill="transparent"
                      stroke="none"
                    />
                  ) : null}
                  {c.status === 'urgent' && !incidentResolved ? (
                    <circle className="continent-cluster-pulse" r={340} />
                  ) : null}
                  <circle
                    className={`continent-cluster-dot continent-cluster-dot--${c.status}`}
                    r={c.status === 'urgent' ? 110 : 85}
                    pointerEvents={isAc7 ? 'none' : 'auto'}
                  />
                  <title>{`${c.label} · ${c.status === 'healthy' ? 'Healthy' : c.status === 'urgent' ? 'Urgent' : c.status === 'elevated' ? 'Warning' : 'Info'}${isAc7 ? '. Click to open Mission Control.' : ''}`}</title>
                </g>
              )
            })}
          </g>
        </g>
      </svg>

    </div>
  )
}
