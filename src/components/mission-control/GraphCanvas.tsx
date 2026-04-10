import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { FlowNode } from './FlowNode'
import { useMissionCluster } from './MissionClusterContext'

type Edge = {
  d: string
  stroke: string
  strokeDasharray?: string
}

function relRect(container: HTMLElement, el: HTMLElement) {
  const cr = container.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  return {
    left: r.left - cr.left + container.scrollLeft,
    right: r.right - cr.left + container.scrollLeft,
    top: r.top - cr.top + container.scrollTop,
    bottom: r.bottom - cr.top + container.scrollTop,
  }
}

export function GraphCanvas() {
  const { remediated, liveTick, setWorkflowNodeDetail } = useMissionCluster()
  const containerRef = useRef<HTMLDivElement>(null)
  const agentRef = useRef<HTMLDivElement>(null)
  const llmRef = useRef<HTMLDivElement>(null)
  const vectorRef = useRef<HTMLDivElement>(null)
  const aggRef = useRef<HTMLDivElement>(null)

  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [edges, setEdges] = useState<Edge[]>([])

  const reqDisplay = `${(14.2 + (liveTick % 5) * 0.05).toFixed(2)}k/s`

  const measure = useCallback(() => {
    const c = containerRef.current
    const agentEl = agentRef.current
    const llmEl = llmRef.current
    const vectorEl = vectorRef.current
    const aggEl = aggRef.current
    if (!c || !agentEl || !llmEl || !vectorEl || !aggEl) return

    const w = Math.max(c.scrollWidth, c.clientWidth)
    const h = Math.max(c.scrollHeight, c.clientHeight)
    setDims({ w, h })

    const a = relRect(c, agentEl)
    const l = relRect(c, llmEl)
    const v = relRect(c, vectorEl)
    const g = relRect(c, aggEl)

    const llmCy = (l.top + l.bottom) / 2
    const vecCy = (v.top + v.bottom) / 2

    const ax = a.right
    const ayToLlm = a.top + (a.bottom - a.top) * 0.3
    const ayToVec = a.top + (a.bottom - a.top) * 0.7

    const llmInX = l.left
    const vecInX = v.left
    const llmOutX = l.right
    const vecOutX = v.right
    const gx = g.left

    const gInUpper = g.top + (g.bottom - g.top) * 0.38
    const gInLower = g.top + (g.bottom - g.top) * 0.62

    const vecStroke = remediated ? '#cbd5e1' : '#f59e0b'
    const vecDash = remediated ? undefined : '4'

    const next: Edge[] = [
      {
        d: `M ${ax} ${ayToLlm} L ${llmInX} ${llmCy}`,
        stroke: '#cbd5e1',
      },
      {
        d: `M ${ax} ${ayToVec} L ${vecInX} ${vecCy}`,
        stroke: '#cbd5e1',
      },
      {
        d: `M ${llmOutX} ${llmCy} L ${gx} ${gInUpper}`,
        stroke: '#cbd5e1',
      },
      {
        d: `M ${vecOutX} ${vecCy} L ${gx} ${gInLower}`,
        stroke: vecStroke,
        strokeDasharray: vecDash,
      },
    ]

    setEdges(next)
  }, [remediated])

  useLayoutEffect(() => {
    measure()
    const c = containerRef.current
    if (!c) return

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure)
    })
    ro.observe(c)

    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const warnCount = remediated ? 0 : 1
  const healthyExtras = remediated ? 25 : 24

  return (
    <div className="canvas">
      <p className="sr-only">
        Interactive architecture diagram: Router Node-7, LLM provider, evaluation
        dataset, and response synthesizer. Nodes with inspection open a details dialog;
        connector lines update with layout.
      </p>
      <div className="canvas-header">
        <div className="canvas-title">Live Data Flow Architecture</div>
        <div className="breadcrumbs breadcrumbs-canvas">
          <span className="canvas-status-ok">
            ● {healthyExtras} Nodes Healthy
          </span>
          <span className="canvas-status-sep">|</span>
          {remediated ? (
            <span className="canvas-status-ok">● 0 Warnings</span>
          ) : (
            <span className="canvas-status-warn">
              ● {warnCount} Warning Detected
            </span>
          )}
        </div>
      </div>

      <div ref={containerRef} className="graph-container">
        {dims.w > 0 && dims.h > 0 ? (
          <svg
            className="graph-edges"
            width={dims.w}
            height={dims.h}
            aria-hidden
          >
            {edges.map((e, i) => (
              <path
                key={i}
                d={e.d}
                stroke={e.stroke}
                strokeWidth={2}
                fill="none"
                strokeDasharray={e.strokeDasharray}
              />
            ))}
          </svg>
        ) : null}

        <div className="tree-wrapper">
          <div className="node-column">
            <div ref={agentRef} className="graph-node-anchor">
              <FlowNode
                nodeType="Agent Cluster"
                title="Router Node-7"
                status="green"
                onInspect={() => setWorkflowNodeDetail('agent')}
                metrics={
                  <>
                    <div className="node-metric">
                      Req: <span>{reqDisplay}</span>
                    </div>
                    <div className="node-metric">
                      Lat: <span>42ms</span>
                    </div>
                  </>
                }
              />
            </div>
          </div>

          <div className="node-column">
            <div ref={llmRef} className="graph-node-anchor">
              <FlowNode
                nodeType="External Service"
                title="LLM Provider (Primary)"
                status="green"
                onInspect={() => setWorkflowNodeDetail('llm')}
                metrics={
                  <div className="node-metric">
                    Tkn:{' '}
                    <span>
                      {remediated
                        ? '1.1M/m'
                        : `${(2.1 + (liveTick % 4) * 0.03).toFixed(2)}M/m`}
                    </span>
                  </div>
                }
              />
            </div>
            <div ref={vectorRef} className="graph-node-anchor">
              <FlowNode
                nodeType="Vector DB"
                title="Evaluation Dataset"
                status={remediated ? 'green' : 'amber'}
                variant={remediated ? 'default' : 'alert'}
                onInspect={() => setWorkflowNodeDetail('vector')}
                metrics={
                  <div className="node-metric">
                    Variance:{' '}
                    {remediated ? (
                      <span>nominal</span>
                    ) : (
                      <span className="node-metric-danger">+14%</span>
                    )}
                  </div>
                }
              />
            </div>
          </div>

          <div className="node-column">
            <div ref={aggRef} className="graph-node-anchor">
              <FlowNode
                nodeType="Aggregator"
                title="Response Synthesizer"
                status="green"
                onInspect={() => setWorkflowNodeDetail('agg')}
                metrics={
                  <div className="node-metric">
                    Safety: <span>Pass</span>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
