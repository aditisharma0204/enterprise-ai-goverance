import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { IconChevronRight, IconRestart } from '../icons/AppIcons'

type Props = {
  onRestartDemo: () => void
}

export function GlobalSuccessStrip({ onRestartDemo }: Props) {
  return (
    <div className="global-success-strip">
      <div className="global-success-left">
        <div className="global-success-icon" aria-hidden>
          ✓
        </div>
        <div className="global-success-text-row">
          <span className="global-success-title">Agent Cluster-7 · Stable</span>
          <span className="global-success-desc">
            Remediation is live in US production. Topology and telemetry reflect
            normal policy alignment.
          </span>
        </div>
      </div>
      <div className="global-success-actions">
        <button type="button" className="global-demo-restart-btn" onClick={onRestartDemo}>
          <IconRestart />
          Run demo again
        </button>
        <Link to={ROUTES.agentCluster7} className="global-success-cta">
          View cluster
          <IconChevronRight />
        </Link>
      </div>
    </div>
  )
}
