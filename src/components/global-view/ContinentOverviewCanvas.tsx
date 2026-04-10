import { type KeyboardEvent } from 'react'
import {
  NA_MAP_IMG_HEIGHT,
  NA_MAP_IMG_WIDTH,
  naClusterStatuses,
  naMapContentGroupTransform,
} from '../../data/naClusterMarkers'

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
 * Click the alert cluster dot to zoom into the US hub topology map.
 */
export function ContinentOverviewCanvas({
  incidentResolved = false,
  onOpenUnitedStates,
}: Props) {
  const clusters = naClusterStatuses(incidentResolved)

  return (
    <div className="global-continent-scale">
      <p className="sr-only">
        North America map with twenty-two agent cluster markers. Click the alert marker
        to zoom into the United States hub map.
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

          <g className="continent-clusters">
            {clusters.map((c) => {
              const isAc7 = c.id === AC7_ID

              return (
                <g
                  key={c.id}
                  className={`continent-cluster${isAc7 ? ' continent-cluster--interactive' : ''}`}
                  transform={`translate(${c.cx} ${c.cy})`}
                  {...(isAc7
                    ? {
                        role: 'button' as const,
                        tabIndex: 0,
                        'aria-label': `${c.label}. Zoom into United States hub map.`,
                        onClick: onOpenUnitedStates,
                        onKeyDown: (e: KeyboardEvent) =>
                          keyActivate(e, onOpenUnitedStates),
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
                  <title>{`${c.label} · ${c.status === 'healthy' ? 'Healthy' : c.status === 'urgent' ? 'Urgent' : c.status === 'elevated' ? 'Warning' : 'Info'}${isAc7 ? '. Click to zoom into US map.' : ''}`}</title>
                </g>
              )
            })}
          </g>
        </g>
      </svg>

    </div>
  )
}
