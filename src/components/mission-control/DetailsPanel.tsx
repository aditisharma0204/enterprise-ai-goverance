import { useState } from 'react'
import { useMissionCluster } from './MissionClusterContext'

const THRESHOLD_PRESETS = [
  { value: 90, label: '90%', hint: 'More throughput' },
  { value: 95, label: '95%', hint: 'Balanced' },
  { value: 98, label: '98%', hint: 'Tighter' },
  { value: 100, label: '100%', hint: 'Maximum' },
] as const

export function DetailsPanel() {
  const {
    remediated,
    applyRemediations,
    warningsPerMin,
    sessions,
    setRedeployOpen,
    redeployComplete,
    deployRevisionId,
  } = useMissionCluster()

  const [strictMode, setStrictMode] = useState(true)
  const [guardianOverrides, setGuardianOverrides] = useState(false)
  const [threshold, setThreshold] = useState<number>(95)

  const remediationSection = (
    <section
      className="remediation-section"
      aria-labelledby="remediation-heading"
    >
      <header className="remediation-section-header">
        <p className="remediation-kicker">Controls</p>
        <h3 className="remediation-heading" id="remediation-heading">
          Tighten answers before deploy
        </h3>
        <p className="remediation-intro">
          Live traffic updates only after you deploy — not from this preview.
        </p>
      </header>

      <fieldset className="remediation-fieldset">
        <legend className="sr-only">Safety behavior settings</legend>

        <div className="remediation-block">
          <div className="remediation-block-main">
            <span className="remediation-control-name">Strict mode</span>
            <span className="remediation-control-hint">
              Approved path only — no backup engines.
            </span>
          </div>
          <label className="toggle remediation-toggle">
            <input
              type="checkbox"
              checked={strictMode}
              onChange={(e) => setStrictMode(e.target.checked)}
              disabled={remediated}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="remediation-separator" />

        <div
          className="remediation-block remediation-block--stack"
          role="group"
          aria-labelledby="threshold-legend"
        >
          <div className="remediation-range-top">
            <span className="remediation-control-name" id="threshold-legend">
              Block threshold
            </span>
            <span className="remediation-threshold-value" aria-live="polite">
              {threshold}%
            </span>
          </div>
          <p className="remediation-control-hint remediation-control-hint--tight">
            Higher blocks more edge-case replies.
          </p>
          <div
            className="remediation-threshold-presets"
            role="radiogroup"
            aria-label="How strict to block answers"
          >
            {THRESHOLD_PRESETS.map((p) => (
              <label
                key={p.value}
                className={`remediation-preset${threshold === p.value ? ' remediation-preset--active' : ''}${remediated ? ' remediation-preset--disabled' : ''}`}
              >
                <input
                  type="radio"
                  name="policy-threshold"
                  value={p.value}
                  checked={threshold === p.value}
                  onChange={() => setThreshold(p.value)}
                  disabled={remediated}
                  className="sr-only"
                />
                <span className="remediation-preset-value">{p.label}</span>
                <span className="remediation-preset-hint">{p.hint}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="remediation-separator" />

        <div className="remediation-block">
          <div className="remediation-block-main">
            <span className="remediation-control-name">Human review first</span>
            <span className="remediation-control-hint">
              Queue risky cases for a person before send.
            </span>
          </div>
          <label className="toggle remediation-toggle">
            <input
              type="checkbox"
              checked={guardianOverrides}
              onChange={(e) => setGuardianOverrides(e.target.checked)}
              disabled={remediated}
            />
            <span className="slider" />
          </label>
        </div>
      </fieldset>
    </section>
  )

  return (
    <div className="details-panel">
      <div
        className={`panel-header${
          redeployComplete
            ? ' panel-header--deployed'
            : remediated
              ? ' panel-header--success'
              : ''
        }`}
      >
        <div
          className={`panel-title${
            redeployComplete
              ? ' panel-title--deployed'
              : remediated
                ? ' panel-title--success'
                : ''
          }`}
        >
          <span className="icon">
            {redeployComplete ? '✓' : remediated ? '✓' : '⚠'}
          </span>
          {redeployComplete
            ? 'Deployment complete'
            : remediated
              ? 'Fix staged'
              : 'Off-policy answers'}
        </div>
        <span
          className={`badge${
            redeployComplete
              ? ' badge-success'
              : remediated
                ? ' badge-success'
                : ' badge-warning'
          }`}
        >
          {redeployComplete
            ? 'Live'
            : remediated
              ? 'Ship'
              : 'Urgent'}
        </span>
      </div>

      <div className="panel-body">
        {redeployComplete ? (
          <div className="deploy-complete-card" role="status">
            <div className="deploy-complete-card-icon" aria-hidden>
              ✓
            </div>
            <div className="deploy-complete-card-body">
              <h3 className="deploy-complete-card-title">Live on production</h3>
              <p className="deploy-complete-card-lead">
                Safer settings are active. Panel stays for your incident log.
              </p>
              {deployRevisionId ? (
                <p className="deploy-complete-revision">
                  <code>{deployRevisionId}</code> · Cluster-7 · US prod
                </p>
              ) : null}
              <ul className="deploy-complete-checklist">
                <li>Strict path + threshold on new traffic</li>
                <li>Checks from testing now on live requests</li>
                <li>No warning spike in the last 5 min</li>
              </ul>
            </div>
          </div>
        ) : null}

        {!redeployComplete ? (
          <>
            <aside
              className={`details-impact-strip${remediated ? ' details-impact-strip--staged' : ''}`}
              aria-label="Exposure while this issue is open"
            >
              <div className="details-impact-metric">
                <span className="details-impact-value">~18.2K</span>
                <span className="details-impact-label">People/hr exposed</span>
              </div>
              <div className="details-impact-metric">
                <span className="details-impact-value">4</span>
                <span className="details-impact-label">Apps degraded</span>
              </div>
              <div className="details-impact-metric">
                <span className="details-impact-value">~0.04%</span>
                <span className="details-impact-label">Revenue drag (est.)</span>
              </div>
            </aside>
            <p className="details-impact-footnote">Modeled snapshot · not audited.</p>
            <details className="details-impact-more">
              <summary className="details-impact-more-summary">Why it matters</summary>
              <div className="details-impact-more-body">
                <p>
                  One view of exposure across shoppers, systems, and order flow —
                  not a single KPI. Delay means more bad answers, busier support, and
                  higher brand and compliance risk.
                </p>
                {remediated ? (
                  <p className="details-impact-more-follow">
                    Deploy to align production and close the gap.
                  </p>
                ) : null}
              </div>
            </details>
          </>
        ) : null}

        {remediationSection}

        <div className="divider" />

        <div className="validation-card">
          <h3 className="section-title">Warning rate</h3>
          <div className="validation-row">
            <span className="validation-label">Signals / min</span>
            <span className="validation-values">
              <span className="validation-before">
                Before · <strong>3</strong>
              </span>
              <span
                className={
                  remediated ? 'validation-after' : 'validation-current'
                }
              >
                After · <strong>{warningsPerMin}</strong>
              </span>
            </span>
          </div>
          <p className="validation-hint">
            {remediated
              ? 'Test slice looks better — ship to reach real traffic.'
              : 'Apply fix, then drive this toward zero.'}
          </p>
          {redeployComplete ? (
            <p className="validation-deployed">Matches live traffic · watch investigations.</p>
          ) : null}
        </div>

        <div className="divider" />

        <div>
          <h3 className="section-title">Samples (5 min)</h3>

          <div className="log-list">
            {sessions.map((s, i) => (
              <div
                key={`${s.id}-${i}`}
                className={`log-item${remediated ? ' log-item--faded' : ''}`}
              >
                <div className="log-header">
                  <span className="log-id">{s.id}</span>
                  <span
                    className={`badge ${s.badge === 'danger' ? 'badge-danger' : 'badge-warning'}`}
                  >
                    {s.badge === 'danger' ? 'High Risk' : 'Med Risk'}
                  </span>
                </div>
                <div className="log-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-footer panel-footer--stack">
        {!remediated ? (
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={applyRemediations}
          >
            Apply fix to this cluster
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => setRedeployOpen(true)}
              disabled={redeployComplete}
            >
              {redeployComplete
                ? 'Deployed to production'
                : 'Deploy to production…'}
            </button>
            {!redeployComplete ? (
              <p className="panel-footer-hint">Standard production rollout.</p>
            ) : (
              <p className="panel-footer-hint panel-footer-hint--success">No further action.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
