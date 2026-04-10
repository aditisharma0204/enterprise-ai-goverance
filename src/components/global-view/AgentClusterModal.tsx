import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

interface ClusterAgent {
  id: string
  name: string
  subtitle: string
  status: 'healthy' | 'warning' | 'critical'
  statusLabel: string
}

const CLUSTER_AGENTS: ClusterAgent[] = [
  {
    id: 'order-processing',
    name: 'Order Processing Agent',
    subtitle: 'US production · Retail',
    status: 'critical',
    statusLabel: 'Policy breach detected',
  },
  {
    id: 'response-orchestrator',
    name: 'Response Orchestrator Agent',
    subtitle: 'Synthesis + policy',
    status: 'healthy',
    statusLabel: 'Nominal',
  },
  {
    id: 'llm-routing',
    name: 'LLM Routing Agent',
    subtitle: 'Primary + fallback',
    status: 'warning',
    statusLabel: 'Elevated latency',
  },
  {
    id: 'evaluator',
    name: 'Evaluator Agent',
    subtitle: 'Golden sets · RAG',
    status: 'warning',
    statusLabel: 'Drift detected',
  },
  {
    id: 'compliance',
    name: 'Compliance Agent',
    subtitle: 'Policy enforcement',
    status: 'healthy',
    statusLabel: 'Nominal',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base Agent',
    subtitle: 'Vector store · Retrieval',
    status: 'healthy',
    statusLabel: 'Nominal',
  },
]

type Props = {
  open: boolean
  onClose: () => void
  incidentResolved: boolean
}

export function AgentClusterModal({ open, onClose, incidentResolved }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        dialogRef.current?.focus()
      })
    }
  }, [open])

  if (!open) return null

  const agents = incidentResolved
    ? CLUSTER_AGENTS.map((a) => ({ ...a, status: 'healthy' as const, statusLabel: 'Nominal' }))
    : CLUSTER_AGENTS

  const criticalCount = agents.filter((a) => a.status === 'critical').length
  const warningCount = agents.filter((a) => a.status === 'warning').length

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="cluster-modal"
        role="dialog"
        aria-label="Agent Cluster 7"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cluster-modal-header">
          <div>
            <h2 className="cluster-modal-title">Agent Cluster 7</h2>
            <p className="cluster-modal-subtitle">
              US East hub · {agents.length} agents
              {!incidentResolved && criticalCount > 0 ? (
                <span className="cluster-modal-badge cluster-modal-badge--critical">
                  {criticalCount} critical
                </span>
              ) : null}
              {!incidentResolved && warningCount > 0 ? (
                <span className="cluster-modal-badge cluster-modal-badge--warning">
                  {warningCount} warning
                </span>
              ) : null}
              {incidentResolved ? (
                <span className="cluster-modal-badge cluster-modal-badge--healthy">
                  All healthy
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            className="cluster-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ul className="cluster-agent-list">
          {agents.map((agent) => {
            const isCritical = agent.status === 'critical'
            const inner = (
              <div className={`cluster-agent-card cluster-agent-card--${agent.status}`}>
                <div className="cluster-agent-info">
                  <span className="cluster-agent-name">{agent.name}</span>
                  <span className="cluster-agent-sub">{agent.subtitle}</span>
                </div>
                <div className="cluster-agent-status">
                  <span className={`cluster-agent-dot cluster-agent-dot--${agent.status}`} />
                  <span className={`cluster-agent-status-text cluster-agent-status-text--${agent.status}`}>
                    {agent.statusLabel}
                  </span>
                </div>
                {isCritical && !incidentResolved ? (
                  <span className="cluster-agent-action">
                    Investigate →
                  </span>
                ) : null}
              </div>
            )

            return (
              <li key={agent.id}>
                {isCritical && !incidentResolved ? (
                  <Link to={ROUTES.agentCluster7} className="cluster-agent-link">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            )
          })}
        </ul>

        <div className="cluster-modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
