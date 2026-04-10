type TopologyCanvasProps = {
  /** After Order Processing Agent deploy, topology reflects healthy state */
  incidentResolved?: boolean
  onOpenCluster?: () => void
}

function SmAgent({
  left,
  top,
  label,
}: {
  left: string
  top: string
  label: string
}) {
  return (
    <button
      type="button"
      className="topology-node topology-node--sm"
      style={{ left, top }}
    >
      <span>{label}</span>
      <span className="topology-dot" />
    </button>
  )
}

export function TopologyCanvas({ incidentResolved = false, onOpenCluster }: TopologyCanvasProps) {
  return (
    <div className="global-topology-scale">
      <p className="sr-only">
        United States operations map: central gateway, US East and US West hubs, store
        and field agents, and downstream services. Lines show traffic paths; use zoom
        controls to adjust the view. Open Order Processing Agent in Mission Control for
        cluster-level detail.
      </p>
      <svg className="global-topology-svg" aria-hidden>
        <defs>
          <filter id="gv-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M 600 375 L 350 220"
          stroke="#cbd5e1"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 600 375 L 850 220"
          stroke="#cbd5e1"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 600 375 L 600 550"
          stroke="#cbd5e1"
          strokeWidth="3"
          fill="none"
        />

        <path
          d="M 600 375 L 350 220"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6 12"
          className="gv-animate-dash"
          opacity="0.6"
        />
        <path
          d="M 600 375 L 850 220"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6 12"
          className="gv-animate-dash"
          opacity="0.6"
        />
        <path
          d="M 600 375 L 600 550"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6 12"
          className="gv-animate-dash"
          opacity="0.6"
        />

        <line
          x1="350"
          y1="220"
          x2="200"
          y2="100"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="350"
          y2="80"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="500"
          y2="120"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="180"
          y2="200"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="220"
          y2="300"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="350"
          y2="360"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="480"
          y2="320"
          stroke={incidentResolved ? '#cbd5e1' : '#f59e0b'}
          strokeWidth={incidentResolved ? 2 : 2.5}
          strokeDasharray={incidentResolved ? undefined : '4 4'}
          className={incidentResolved ? undefined : 'gv-animate-dash'}
          filter={incidentResolved ? undefined : 'url(#gv-glow)'}
        />
        <line
          x1="350"
          y1="220"
          x2="100"
          y2="280"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        <line
          x1="850"
          y1="220"
          x2="700"
          y2="120"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="850"
          y2="80"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="1000"
          y2="100"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="1020"
          y2="200"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="980"
          y2="320"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="850"
          y2="360"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        <line
          x1="600"
          y1="550"
          x2="450"
          y2="650"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="600"
          y1="550"
          x2="550"
          y2="690"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="600"
          y1="550"
          x2="650"
          y2="690"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <line
          x1="600"
          y1="550"
          x2="750"
          y2="650"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        <line
          x1="350"
          y1="220"
          x2="200"
          y2="100"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="gv-animate-dash"
          opacity="0.3"
        />
        <line
          x1="850"
          y1="220"
          x2="1000"
          y2="100"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="gv-animate-dash"
          opacity="0.3"
        />
        <line
          x1="600"
          y1="550"
          x2="750"
          y2="650"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="gv-animate-dash"
          opacity="0.3"
        />
      </svg>

      <div className="topology-us-map" aria-hidden>
        <svg viewBox="0 0 960 420" className="topology-us-map-svg">
          <path
            className="topology-us-shape"
            d="M84 188 L120 146 L172 132 L218 102 L292 98 L356 122 L420 112 L492 122 L560 156 L634 150 L714 170 L778 208 L830 238 L850 274 L820 306 L752 326 L666 332 L594 320 L518 334 L448 324 L378 330 L316 318 L248 328 L186 314 L138 286 L100 242 Z"
          />
          <path
            className="topology-us-shape-accent"
            d="M232 212 C308 184 374 176 448 182 C520 188 590 204 656 226"
          />
          <path
            className="topology-us-shape-accent"
            d="M186 246 C266 262 352 272 440 274 C532 276 616 266 700 246"
          />
        </svg>
      </div>
      <div className="topology-us-tag topology-us-tag--west" aria-hidden>
        US West hub zone
      </div>
      <div className="topology-us-tag topology-us-tag--east" aria-hidden>
        US East hub zone
      </div>

      <div
        className="topology-node topology-node--gateway"
        style={{ left: 'calc(600px - 80px)', top: 'calc(375px - 27px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-gw-title">Global Gateway</span>
          <div className="topology-dot-gw" />
        </div>
        <div className="topology-gw-sub">US enterprise entry</div>
      </div>

      <button
        type="button"
        className="topology-node topology-node--router"
        style={{ left: 'calc(350px - 70px)', top: 'calc(220px - 23px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-router-title">US East hub</span>
          <div className="topology-dot" style={{ width: 8, height: 8 }} />
        </div>
        <div className="topology-router-sub">Router Node</div>
      </button>

      <button
        type="button"
        className="topology-node topology-node--router"
        style={{ left: 'calc(850px - 70px)', top: 'calc(220px - 23px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-router-title">US West hub</span>
          <div className="topology-dot" style={{ width: 8, height: 8 }} />
        </div>
        <div className="topology-router-sub">Router Node</div>
      </button>

      <button
        type="button"
        className="topology-node topology-node--router"
        style={{ left: 'calc(600px - 70px)', top: 'calc(550px - 23px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-router-title">Internal QA Auth</span>
          <div className="topology-dot" style={{ width: 8, height: 8 }} />
        </div>
        <div className="topology-router-sub">Router Node</div>
      </button>

      <SmAgent left="calc(200px - 60px)" top="calc(100px - 18px)" label="Agent USE-1" />
      <SmAgent left="calc(350px - 60px)" top="calc(80px - 18px)" label="Agent USE-2" />
      <SmAgent left="calc(500px - 60px)" top="calc(120px - 18px)" label="Agent USE-3" />
      <SmAgent left="calc(180px - 60px)" top="calc(200px - 18px)" label="Agent USE-4" />
      <SmAgent left="calc(220px - 60px)" top="calc(300px - 18px)" label="Agent USE-5" />
      <SmAgent left="calc(350px - 60px)" top="calc(360px - 18px)" label="Agent USE-6" />

      <button
        type="button"
        onClick={onOpenCluster}
        className={
          incidentResolved
            ? 'topology-node topology-node--cluster-healthy'
            : 'topology-node topology-node--alert'
        }
        style={{ left: 'calc(480px - 80px)', top: 'calc(320px - 26px)' }}
      >
        {incidentResolved ? (
          <>
            <div className="topology-healthy-head">
              <span className="topology-healthy-title">Agent Cluster 7</span>
              <div className="topology-healthy-dot" />
            </div>
            <div className="topology-healthy-sub">All agents healthy · US</div>
          </>
        ) : (
          <>
            <div className="topology-alert-head">
              <span className="topology-alert-title">Agent Cluster 7</span>
              <div className="topology-alert-ping-wrap">
                <span className="topology-alert-ping" />
                <span className="topology-alert-dot" />
              </div>
            </div>
            <div className="topology-alert-drift">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Attention: policy variance
            </div>
          </>
        )}
      </button>

      <SmAgent left="calc(100px - 60px)" top="calc(280px - 18px)" label="Agent USE-8" />

      <SmAgent left="calc(700px - 60px)" top="calc(120px - 18px)" label="Agent USW-1" />
      <SmAgent left="calc(850px - 60px)" top="calc(80px - 18px)" label="Agent USW-2" />
      <SmAgent left="calc(1000px - 60px)" top="calc(100px - 18px)" label="Agent USW-3" />
      <SmAgent left="calc(1020px - 60px)" top="calc(200px - 18px)" label="Agent USW-4" />
      <SmAgent left="calc(980px - 60px)" top="calc(320px - 18px)" label="Agent USW-5" />
      <SmAgent left="calc(850px - 60px)" top="calc(360px - 18px)" label="Agent USW-6" />

      <SmAgent left="calc(450px - 60px)" top="calc(650px - 18px)" label="Agent QA-1" />
      <SmAgent left="calc(550px - 60px)" top="calc(690px - 18px)" label="Agent QA-2" />
      <SmAgent left="calc(650px - 60px)" top="calc(690px - 18px)" label="Agent QA-3" />
      <SmAgent left="calc(750px - 60px)" top="calc(650px - 18px)" label="Agent QA-4" />
    </div>
  )
}
