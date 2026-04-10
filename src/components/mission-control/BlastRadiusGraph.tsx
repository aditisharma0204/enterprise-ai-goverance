import { useMissionCluster, type ClusterPhase } from './MissionClusterContext'

type NodeVisual = 'default' | 'warn' | 'affected' | 'disabled' | 'processing' | 'healthy'
type EdgeVisual = 'default' | 'alert' | 'alert-warn' | 'muted' | 'dim' | 'processing' | 'healthy'

function deriveVisuals(phase: ClusterPhase) {
  const n = {
    orderAgent: 'default' as NodeVisual,
    llmRouting: 'default' as NodeVisual,
    evaluator: 'default' as NodeVisual,
    storeCustomers: 'default' as NodeVisual,
    responseOrch: 'default' as NodeVisual,
    compliance: 'default' as NodeVisual,
  }
  const e = {
    storeToGw: 'default' as EdgeVisual,
    gwToOrder: 'default' as EdgeVisual,
    orderToLlm: 'default' as EdgeVisual,
    orderToResponse: 'default' as EdgeVisual,
    orderToEval: 'default' as EdgeVisual,
    evalToZendesk: 'default' as EdgeVisual,
    compToEval: 'muted' as EdgeVisual,
  }

  switch (phase) {
    case 'alert':
      n.orderAgent = 'warn'
      n.llmRouting = 'affected'
      n.evaluator = 'warn'
      n.storeCustomers = 'affected'
      e.storeToGw = 'alert-warn'
      e.gwToOrder = 'alert'
      e.orderToLlm = 'alert-warn'
      e.orderToEval = 'alert-warn'
      break

    case 'traffic-stopped':
      n.orderAgent = 'disabled'
      n.llmRouting = 'default'
      n.evaluator = 'default'
      n.storeCustomers = 'default'
      e.storeToGw = 'dim'
      e.gwToOrder = 'dim'
      e.orderToLlm = 'dim'
      e.orderToResponse = 'dim'
      e.orderToEval = 'dim'
      break

    case 'retraining':
      n.orderAgent = 'disabled'
      n.evaluator = 'processing'
      e.storeToGw = 'dim'
      e.gwToOrder = 'dim'
      e.orderToLlm = 'dim'
      e.orderToResponse = 'dim'
      e.orderToEval = 'processing'
      e.compToEval = 'processing'
      break

    case 'retrain-complete':
      n.orderAgent = 'disabled'
      n.evaluator = 'healthy'
      e.storeToGw = 'dim'
      e.gwToOrder = 'dim'
      e.orderToLlm = 'dim'
      e.orderToResponse = 'dim'
      e.orderToEval = 'dim'
      break

    case 'deploying':
      n.orderAgent = 'processing'
      n.evaluator = 'healthy'
      e.storeToGw = 'dim'
      e.gwToOrder = 'processing'
      e.orderToLlm = 'dim'
      e.orderToResponse = 'dim'
      e.orderToEval = 'dim'
      break

    case 'healthy':
      n.orderAgent = 'healthy'
      n.llmRouting = 'healthy'
      n.evaluator = 'healthy'
      n.responseOrch = 'healthy'
      e.storeToGw = 'healthy'
      e.gwToOrder = 'healthy'
      e.orderToLlm = 'healthy'
      e.orderToResponse = 'healthy'
      e.orderToEval = 'healthy'
      e.evalToZendesk = 'healthy'
      e.compToEval = 'healthy'
      break
  }

  return { n, e }
}

export function BlastRadiusGraph() {
  const { clusterPhase } = useMissionCluster()

  const { n, e } = deriveVisuals(clusterPhase)

  return (
    <div className="blast-canvas">
      <p className="sr-only">
        Agent cluster dependency graph showing Order Processing Agent and connected
        agents, services, and users. Visual state reflects the current Agentforce
        conversation phase.
      </p>
      <div className="blast-canvas-head">
        <div className="blast-canvas-title">Service Graph USW-7</div>
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

            {/* Users → API Gateway */}
            <Edge d="M 100 140 L 260 200" visual="muted" />
            <Edge d="M 100 280 L 260 255" visual={e.storeToGw} />
            <Edge d="M 100 420 L 260 310" visual="muted" />

            {/* API Gateway → Order Processing Agent */}
            <Edge d="M 320 255 L 460 255" visual={e.gwToOrder} />

            {/* Order Processing Agent → right-side agents */}
            <Edge d="M 520 230 L 660 160" visual={e.orderToLlm} dashed />
            <Edge d="M 520 255 L 660 280" visual={e.orderToResponse} />
            <Edge d="M 520 280 L 660 400" visual={e.orderToEval} />

            {/* Response Orchestrator → downstream */}
            <Edge d="M 720 280 L 850 200" visual="muted" />
            <Edge d="M 720 280 L 850 355" visual="muted" />

            {/* LLM Routing → Knowledge Base */}
            <Edge d="M 720 160 L 850 80" visual="muted" />

            {/* Evaluator → Zendesk */}
            <Edge d="M 720 400 L 850 460" visual={e.evalToZendesk} />

            {/* API Gateway → Compliance Agent */}
            <Edge d="M 290 290 L 290 430" visual="muted" />

            {/* Compliance → Evaluator */}
            <Edge d="M 350 450 L 600 420" visual={e.compToEval} />
          </svg>

          {/* Left column: user sources */}
          <BlastNode left={80} top={140} title="Enterprise users" subtitle="SSO · SAML" small />
          <BlastNode left={80} top={280} title="Store customers" subtitle="Chat widget" small visual={n.storeCustomers} />
          <BlastNode left={80} top={420} title="Mobile clients" subtitle="iOS / Android" small />

          {/* Center-left: gateway */}
          <BlastNode left={290} top={255} title="API Gateway" subtitle="Rate limits · OAuth" />

          {/* CENTER: primary agent */}
          <BlastNode
            left={490}
            top={255}
            title="Order Processing Agent"
            subtitle="US production"
            visual={n.orderAgent}
            disabledLabel={clusterPhase === 'traffic-stopped' || clusterPhase === 'retraining' || clusterPhase === 'retrain-complete' ? 'Traffic stopped' : undefined}
          />

          {/* Right column: connected agents */}
          <BlastNode left={690} top={160} title="LLM Routing Agent" subtitle="Primary + fallback" visual={n.llmRouting} />
          <BlastNode left={690} top={280} title="Response Orchestrator Agent" subtitle="Synthesis + policy" visual={n.responseOrch} />
          <BlastNode left={690} top={400} title="Evaluator Agent" subtitle="Golden sets · RAG" visual={n.evaluator} />

          {/* Far right: downstream services */}
          <BlastNode left={850} top={80} title="Knowledge Base" subtitle="Vector store" small />
          <BlastNode left={850} top={200} title="Salesforce CRM" subtitle="Account graph" small />
          <BlastNode left={850} top={355} title="Snowflake" subtitle="Telemetry lake" small />
          <BlastNode left={850} top={460} title="Zendesk Bridge" subtitle="Ticket enrichment" small />

          {/* Bottom: compliance */}
          <BlastNode left={290} top={450} title="Compliance Agent" subtitle="Policy enforcement" visual={n.compliance} />
        </div>
      </div>
    </div>
  )
}

function Edge({
  d,
  visual = 'default',
  dashed,
}: {
  d: string
  visual?: EdgeVisual
  dashed?: boolean
}) {
  let color: string
  let width: number
  let animated = false
  let dashArray = dashed ? '5 4' : undefined

  const css = getComputedStyle(document.documentElement)
  const tok = (name: string) => css.getPropertyValue(name).trim()

  switch (visual) {
    case 'alert':
      color = tok('--edge-alert') || '#fecaca'; width = 2.5; animated = true; break
    case 'alert-warn':
      color = tok('--edge-alert-warn') || '#f59e0b'; width = 2.5; animated = true; break
    case 'muted':
      color = tok('--edge-muted') || '#374151'; width = 1.5; break
    case 'dim':
      color = tok('--edge-dark') || '#1f2937'; width = 1; dashArray = '4 6'; break
    case 'processing':
      color = tok('--edge-processing') || '#38bdf8'; width = 2; animated = true; break
    case 'healthy':
      color = tok('--gv-cluster-dot-healthy') || '#34d399'; width = 2; break
    default:
      color = tok('--gv-topology-sm-text') || '#4b5563'; width = 2; break
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashArray}
      className={animated ? 'blast-edge-pulse' : ''}
      style={{ transition: 'stroke 0.6s ease-in-out, stroke-width 0.4s ease-in-out, opacity 0.4s ease-in-out' }}
    />
  )
}

function BlastNode({
  left,
  top,
  title,
  subtitle,
  small,
  visual = 'default',
  disabledLabel,
}: {
  left: number
  top: number
  title: string
  subtitle: string
  small?: boolean
  visual?: NodeVisual
  disabledLabel?: string
}) {
  const cls = [
    'blast-node',
    small && 'blast-node--sm',
    visual === 'warn' && 'blast-node--warn',
    visual === 'affected' && 'blast-node--affected',
    visual === 'disabled' && 'blast-node--disabled',
    visual === 'processing' && 'blast-node--processing',
    visual === 'healthy' && 'blast-node--healthy',
  ].filter(Boolean).join(' ')

  const isDisabled = visual === 'disabled'
  const displaySub = disabledLabel && isDisabled ? disabledLabel : subtitle

  return (
    <div className={cls} style={{ left: `${left}px`, top: `${top}px` }}>
      <div className={`blast-node-title${isDisabled ? ' blast-node-title--strike' : ''}`}>{title}</div>
      <div className="blast-node-sub">{displaySub}</div>
    </div>
  )
}
