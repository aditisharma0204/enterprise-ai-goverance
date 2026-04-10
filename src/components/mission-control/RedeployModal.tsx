import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMissionCluster } from './MissionClusterContext'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function RedeployModal() {
  const { redeployOpen, setRedeployOpen, finishRedeploy } = useMissionCluster()
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [deployRevision, setDeployRevision] = useState<string | null>(null)

  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (step === 2 && progress >= 100) {
      setDeployRevision(
        (r) => r ?? `ag7-rem-${String(Math.floor(Date.now() / 1000)).slice(-6)}`,
      )
    }
  }, [step, progress])

  useEffect(() => {
    if (step !== 2) return
    if (progress >= 100) return
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100
        return p + 8
      })
    }, 220)
    return () => clearInterval(t)
  }, [step, progress])

  useEffect(() => {
    if (step === 2 && progress >= 100) {
      const t = setTimeout(() => setStep(3), 400)
      return () => clearTimeout(t)
    }
  }, [step, progress])

  useLayoutEffect(() => {
    if (redeployOpen) {
      if (!wasOpenRef.current) {
        setStep(0)
        setProgress(0)
        setDeployRevision(null)
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
  }, [redeployOpen, step])

  useEffect(() => {
    if (!redeployOpen) return

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 2) {
        e.preventDefault()
        setRedeployOpen(false)
      }
    }
    document.addEventListener('keydown', onDocKeyDown)
    return () => document.removeEventListener('keydown', onDocKeyDown)
  }, [redeployOpen, step, setRedeployOpen])

  useEffect(() => {
    if (!redeployOpen) return
    const modal = dialogRef.current
    if (!modal) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((n) => n.offsetParent !== null || n === document.activeElement)
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
  }, [redeployOpen, step])

  useEffect(() => {
    if (redeployOpen) return
    const prev = lastFocusRef.current
    lastFocusRef.current = null
    if (prev?.focus) {
      requestAnimationFrame(() => prev.focus())
    }
  }, [redeployOpen])

  if (!redeployOpen) return null

  const describedBy = `redeploy-desc-${step}`

  const closeFromBackdrop = () => {
    if (step !== 2) setRedeployOpen(false)
  }

  return (
    <div className="modal-backdrop" onClick={closeFromBackdrop}>
      <div
        ref={dialogRef}
        className="redeploy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="redeploy-title"
        aria-describedby={describedBy}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="redeploy-title" className="redeploy-title">
          Deploy to production
        </h2>

        {step === 0 ? (
          <>
            <p id="redeploy-desc-0" className="redeploy-copy">
              Push remediated configuration to the live agent cluster. This uses
              your standard release pipeline — no interruptive kill switch.
            </p>
            <ul className="redeploy-list">
              <li>Strict routing + raised compliance threshold</li>
              <li>Eval dataset guardrails (vector shard isolation)</li>
              <li>Optional guardian overrides (if enabled)</li>
            </ul>
            <div className="redeploy-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setRedeployOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(1)}
              >
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <p id="redeploy-desc-1" className="redeploy-copy">
              Confirm production deploy for <strong>Order Processing Agent</strong> in{' '}
              <strong>United States</strong> production. Traffic will shift as new
              tasks pick up the revision.
            </p>
            <label className="redeploy-check">
              <input type="checkbox" defaultChecked />
              I acknowledge this change affects customer-facing responses.
            </label>
            <div className="redeploy-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(0)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setProgress(0)
                  setStep(2)
                }}
              >
                Deploy now
              </button>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <p id="redeploy-desc-2" className="redeploy-copy">
              Rolling out revision to production…
            </p>
            <div
              className="redeploy-progress-wrap"
              role="progressbar"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-valuetext={`${progress}% complete`}
              aria-label="Deployment progress"
            >
              <div
                className="redeploy-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="redeploy-progress-label" aria-hidden>
              {progress}%
            </p>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <p
              id="redeploy-desc-3"
              className="redeploy-copy redeploy-success"
            >
              Live in production. New tasks are using the remediated
              configuration.
            </p>
            <p className="redeploy-meta">
              Revision{' '}
              <code>
                {deployRevision ??
                  `ag7-rem-${String(Math.floor(Date.now() / 1000)).slice(-6)}`}
              </code>{' '}
              · propagated to US production cell
            </p>
            <div className="redeploy-actions">
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => {
                  const rev =
                    deployRevision ??
                    `ag7-rem-${String(Math.floor(Date.now() / 1000)).slice(-6)}`
                  finishRedeploy(rev)
                  setRedeployOpen(false)
                }}
              >
                Done
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
