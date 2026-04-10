import { useMissionCluster } from './MissionClusterContext'

/** CMDB-style service graph: spread across estate, affected paths highlighted until remediated. */
export function BlastRadiusGraph() {
  const { remediated, liveTick } = useMissionCluster()

  const sessionBurst = 1200 + liveTick * 14
  const tokenRate = remediated ? '1.1M/m' : `${(2.1 + (liveTick % 4) * 0.04).toFixed(2)}M/m`

  return (
    <div className="blast-canvas">
      <p className="sr-only">
        Service dependency graph showing blast radius from Agent Cluster-7 through API,
        orchestrator, and integrations. Affected paths are emphasized until remediation
        is applied; open sessions and token rate appear in the header above.
      </p>
      <div className="blast-canvas-head">
        <div className="blast-canvas-title">Service graph · Blast radius</div>
        <div className="blast-canvas-meta">
          <span>
            Open sessions <strong>{sessionBurst.toLocaleString()}</strong>
          </span>
          <span className="blast-meta-sep">|</span>
          <span>
            Cross-boundary token rate <strong>{tokenRate}</strong>
          </span>
        </div>
      </div>
      <div className="blast-map-wrap mc-scroll">
        <div className="blast-map">
          <svg className="blast-map-svg" viewBox="0 0 920 560" aria-hidden>
            <defs>
              <filter id="blast-glow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Core paths */}
            <path
              d="M 120 280 L 220 280 L 320 240"
              fill="none"
              stroke={remediated ? '#cbd5e1' : '#fecaca'}
              strokeWidth="2.5"
              className={remediated ? '' : 'blast-edge-pulse'}
            />
            <path
              d="M 320 240 L 460 200 L 600 260"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M 460 200 L 460 120 L 560 90"
              fill="none"
              stroke={remediated ? '#cbd5e1' : '#f59e0b'}
              strokeWidth="2"
              strokeDasharray="5 4"
              className={remediated ? '' : 'blast-edge-pulse'}
            />
            <path
              d="M 460 200 L 420 320 L 460 400"
              fill="none"
              stroke={remediated ? '#cbd5e1' : '#f59e0b'}
              strokeWidth="2.5"
              className={remediated ? '' : 'blast-edge-pulse'}
            />
            <path
              d="M 460 400 L 320 440 L 180 400"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M 600 260 L 720 220 L 820 180"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M 600 260 L 740 300 L 860 340"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M 460 400 L 580 460 L 720 480"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M 320 240 L 240 140 L 140 100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.5"
            />
            <path
              d="M 320 240 L 200 360 L 100 420"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.5"
            />
          </svg>

          <BlastNode
            left={40}
            top={250}
            title="External users"
            subtitle="Identity federation"
            small
            affected={!remediated}
          />
          <BlastNode
            left={200}
            top={255}
            title="Public API tier"
            subtitle="Rate limits · OAuth"
          />
          <BlastNode
            left={360}
            top={175}
            title="Agent Cluster-7"
            subtitle="US production"
            warn
            affected={!remediated}
          />
          <BlastNode
            left={520}
            top={235}
            title="Response orchestrator"
            subtitle="Synthesis + policy"
          />
          <BlastNode
            left={680}
            top={195}
            title="Salesforce CRM"
            subtitle="Account graph"
          />
          <BlastNode
            left={760}
            top={305}
            title="Snowflake"
            subtitle="Telemetry lake"
          />
          <BlastNode
            left={520}
            top={90}
            title="LLM routing fabric"
            subtitle="Primary + fallback"
            affected={!remediated}
          />
          <BlastNode
            left={400}
            top={375}
            title="Eval / vector store"
            subtitle="Golden sets · RAG"
            warn
            affected={!remediated}
          />
          <BlastNode
            left={120}
            top={370}
            title="Support widget CDN"
            subtitle="Embeds"
          />
          <BlastNode
            left={600}
            top={445}
            title="Zendesk bridge"
            subtitle="Ticket enrichment"
          />
          <BlastNode
            left={90}
            top={70}
            title="Corporate WAF"
            subtitle="Ingress"
          />
          <BlastNode
            left={240}
            top={120}
            title="Secrets vault"
            subtitle="KMS-backed"
          />
          <BlastNode
            left={60}
            top={390}
            title="Mobile clients"
            subtitle="iOS / Android"
            small
          />
        </div>
      </div>
    </div>
  )
}

function BlastNode({
  left,
  top,
  title,
  subtitle,
  small,
  warn,
  affected,
}: {
  left: number
  top: number
  title: string
  subtitle: string
  small?: boolean
  warn?: boolean
  affected?: boolean
}) {
  return (
    <div
      className={`blast-node${small ? ' blast-node--sm' : ''}${warn ? ' blast-node--warn' : ''}${affected ? ' blast-node--affected' : ''}`}
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className="blast-node-title">{title}</div>
      <div className="blast-node-sub">{subtitle}</div>
    </div>
  )
}
