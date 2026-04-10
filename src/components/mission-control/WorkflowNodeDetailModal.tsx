import { useEffect, useLayoutEffect, useRef } from 'react'
import { useMissionCluster } from './MissionClusterContext'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const DETAILS: Record<
  string,
  { title: string; subtitle: string; steps: { name: string; status: string }[] }
> = {
  agent: {
    title: 'Router Node-7',
    subtitle: 'Agent runtime · CI workflow',
    steps: [
      { name: 'Build agent image (main)', status: 'pass · 4m ago' },
      { name: 'Eval harness · golden prompts', status: 'warn · drift +14%' },
      { name: 'Canary · 5% traffic', status: 'pass' },
      { name: 'Sign & attest (SLSA)', status: 'pass' },
    ],
  },
  llm: {
    title: 'LLM Provider (Primary)',
    subtitle: 'Model routing · quotas',
    steps: [
      { name: 'Route policy · strict mode eligible', status: 'ready' },
      { name: 'Token budget · org NA', status: '82% consumed (5m)' },
      { name: 'Fallback chain', status: 'disabled when strict on' },
    ],
  },
  vector: {
    title: 'Evaluation Dataset',
    subtitle: 'Vector index · eval alignment',
    steps: [
      { name: 'Shard eval-na-2', status: 'hot · mixed prod traffic' },
      { name: 'Embedding model text-embedding-3', status: 'v2 locked' },
      { name: 'Drift detector', status: 'firing · +14% vs baseline' },
    ],
  },
  agg: {
    title: 'Response Synthesizer',
    subtitle: 'Safety synthesis · output policy',
    steps: [
      { name: 'Safety tier L2', status: 'pass' },
      { name: 'Human review queue', status: 'depth 3' },
      { name: 'Redaction ruleset v14', status: 'active' },
    ],
  },
}

export function WorkflowNodeDetailModal() {
  const { workflowNodeDetail, setWorkflowNodeDetail, remediated } =
    useMissionCluster()

  const open = Boolean(workflowNodeDetail)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  useLayoutEffect(() => {
    if (open) {
      if (!wasOpenRef.current) {
        lastFocusRef.current = document.activeElement as HTMLElement | null
      }
      wasOpenRef.current = true
      const id = requestAnimationFrame(() => {
        dialogRef.current
          ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
          ?.focus()
      })
      return () => cancelAnimationFrame(id)
    }
    wasOpenRef.current = false
    return undefined
  }, [open, workflowNodeDetail])

  useEffect(() => {
    if (!open) return

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setWorkflowNodeDetail(null)
      }
    }
    document.addEventListener('keydown', onDocKeyDown)
    return () => document.removeEventListener('keydown', onDocKeyDown)
  }, [open, setWorkflowNodeDetail])

  useEffect(() => {
    if (!open) return
    const modal = dialogRef.current
    if (!modal) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    modal.addEventListener('keydown', onKeyDown)
    return () => modal.removeEventListener('keydown', onKeyDown)
  }, [open, workflowNodeDetail, remediated])

  useEffect(() => {
    if (open) return
    const prev = lastFocusRef.current
    lastFocusRef.current = null
    if (prev?.focus) {
      requestAnimationFrame(() => prev.focus())
    }
  }, [open])

  if (!workflowNodeDetail) return null

  const meta = DETAILS[workflowNodeDetail]
  if (!meta) return null

  return (
    <div
      className="modal-backdrop"
      onClick={() => setWorkflowNodeDetail(null)}
    >
      <div
        ref={dialogRef}
        className="workflow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workflow-modal-title"
        aria-describedby="workflow-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="workflow-modal-head">
          <div>
            <h2 id="workflow-modal-title" className="workflow-modal-title">
              {meta.title}
            </h2>
            <p className="workflow-modal-sub">{meta.subtitle}</p>
          </div>
          <button
            type="button"
            className="workflow-modal-close"
            onClick={() => setWorkflowNodeDetail(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p id="workflow-modal-desc" className="workflow-modal-lead">
          Zoomed view of the node pipeline (CI + runtime checks). Use this to
          correlate policy drift with build and deployment stages.
        </p>
        {remediated ? (
          <p className="workflow-modal-banner workflow-modal-banner--ok">
            Remediation applied — eval alignment and strict routing are updating;
            redeploy to roll changes to production traffic.
          </p>
        ) : null}
        <ol className="workflow-modal-steps">
          {meta.steps.map((s) => (
            <li key={s.name} className="workflow-modal-step">
              <span className="workflow-step-name">{s.name}</span>
              <span className="workflow-step-status">{s.status}</span>
            </li>
          ))}
        </ol>
        <div className="workflow-modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setWorkflowNodeDetail(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
