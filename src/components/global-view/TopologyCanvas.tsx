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
    <div
      className="topology-node topology-node--sm"
      style={{ left, top }}
    >
      <span>{label}</span>
      <span className="topology-dot" />
    </div>
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
          stroke="var(--edge-default)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 600 375 L 850 220"
          stroke="var(--edge-default)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 600 375 L 600 550"
          stroke="var(--edge-default)"
          strokeWidth="3"
          fill="none"
        />

        <path
          d="M 600 375 L 350 220"
          stroke="var(--edge-healthy)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6 12"
          className="gv-animate-dash"
          opacity="0.6"
        />
        <path
          d="M 600 375 L 850 220"
          stroke="var(--edge-healthy)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6 12"
          className="gv-animate-dash"
          opacity="0.6"
        />
        <path
          d="M 600 375 L 600 550"
          stroke="var(--edge-healthy)"
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
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="350"
          y2="80"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="500"
          y2="120"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="180"
          y2="200"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="220"
          y2="300"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="350"
          y2="360"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="350"
          y1="220"
          x2="480"
          y2="320"
          stroke={incidentResolved ? 'var(--edge-default)' : 'var(--edge-alert-warn)'}
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
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />

        <line
          x1="850"
          y1="220"
          x2="700"
          y2="120"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="850"
          y2="80"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="1000"
          y2="100"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="1020"
          y2="200"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="980"
          y2="320"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="850"
          y1="220"
          x2="850"
          y2="360"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />

        <line
          x1="600"
          y1="550"
          x2="450"
          y2="650"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="600"
          y1="550"
          x2="550"
          y2="690"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="600"
          y1="550"
          x2="650"
          y2="690"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />
        <line
          x1="600"
          y1="550"
          x2="750"
          y2="650"
          stroke="var(--edge-dim)"
          strokeWidth="2"
        />

        <line
          x1="350"
          y1="220"
          x2="200"
          y2="100"
          stroke="var(--edge-healthy)"
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
          stroke="var(--edge-healthy)"
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
          stroke="var(--edge-healthy)"
          strokeWidth="2"
          strokeDasharray="4 8"
          className="gv-animate-dash"
          opacity="0.3"
        />
      </svg>

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

      <div
        className="topology-node topology-node--router"
        style={{ left: 'calc(350px - 70px)', top: 'calc(220px - 23px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-router-title">US West hub</span>
          <div className="topology-dot" style={{ width: 8, height: 8 }} />
        </div>
        <div className="topology-router-sub">Router Node</div>
      </div>

      <div
        className="topology-node topology-node--router"
        style={{ left: 'calc(850px - 70px)', top: 'calc(220px - 23px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-router-title">US East hub</span>
          <div className="topology-dot" style={{ width: 8, height: 8 }} />
        </div>
        <div className="topology-router-sub">Router Node</div>
      </div>

      <div
        className="topology-node topology-node--router"
        style={{ left: 'calc(600px - 70px)', top: 'calc(550px - 23px)' }}
      >
        <div className="topology-router-head">
          <span className="topology-router-title">Internal QA Auth</span>
          <div className="topology-dot" style={{ width: 8, height: 8 }} />
        </div>
        <div className="topology-router-sub">Router Node</div>
      </div>

      <SmAgent left="calc(200px - 60px)" top="calc(100px - 18px)" label="Agent USW-1" />
      <SmAgent left="calc(350px - 60px)" top="calc(80px - 18px)" label="Agent USW-2" />
      <SmAgent left="calc(500px - 60px)" top="calc(120px - 18px)" label="Agent USW-3" />
      <SmAgent left="calc(180px - 60px)" top="calc(200px - 18px)" label="Agent USW-4" />
      <SmAgent left="calc(220px - 60px)" top="calc(300px - 18px)" label="Agent USW-5" />
      <SmAgent left="calc(350px - 60px)" top="calc(360px - 18px)" label="Agent USW-6" />

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
              <span className="topology-healthy-title">Agent USW-7</span>
              <div className="topology-healthy-dot" />
            </div>
            <div className="topology-healthy-sub">All agents healthy · US</div>
          </>
        ) : (
          <>
            <div className="topology-alert-head">
              <span className="topology-alert-title">Agent USW-7</span>
              <div className="topology-alert-ping-wrap">
                <span className="topology-alert-ping" />
                <span className="topology-alert-dot" />
              </div>
            </div>
          </>
        )}
      </button>

      <SmAgent left="calc(100px - 60px)" top="calc(280px - 18px)" label="Agent USW-8" />

      <SmAgent left="calc(700px - 60px)" top="calc(120px - 18px)" label="Agent USE-1" />
      <SmAgent left="calc(850px - 60px)" top="calc(80px - 18px)" label="Agent USE-2" />
      <SmAgent left="calc(1000px - 60px)" top="calc(100px - 18px)" label="Agent USE-3" />
      <SmAgent left="calc(1020px - 60px)" top="calc(200px - 18px)" label="Agent USE-4" />
      <SmAgent left="calc(980px - 60px)" top="calc(320px - 18px)" label="Agent USE-5" />
      <SmAgent left="calc(850px - 60px)" top="calc(360px - 18px)" label="Agent USE-6" />

      <SmAgent left="calc(450px - 60px)" top="calc(650px - 18px)" label="Agent QA-1" />
      <SmAgent left="calc(550px - 60px)" top="calc(690px - 18px)" label="Agent QA-2" />
      <SmAgent left="calc(650px - 60px)" top="calc(690px - 18px)" label="Agent QA-3" />
      <SmAgent left="calc(750px - 60px)" top="calc(650px - 18px)" label="Agent QA-4" />
    </div>
  )
}
