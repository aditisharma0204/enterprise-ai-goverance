// import { Link } from 'react-router-dom'
// import { ROUTES } from '../../constants/routes'
// import { IconChevronRight, IconRestart } from '../icons/AppIcons'

type Props = {
  onRestartDemo: () => void
}

export function GlobalSuccessStrip({ onRestartDemo: _onRestartDemo }: Props) {
  return (
    <div className="global-success-strip">
      <div className="global-success-left">
        <div className="global-success-icon" aria-hidden>
          ✓
        </div>
        <div className="global-success-text-row">
          <span className="global-success-title">Order Processing Agent · Stable</span>
          <span className="global-success-desc">
            The fix has been deployed. All US agents are running normally and following policy.
          </span>
        </div>
      </div>
      {/* Actions hidden for demo: restart + view cluster */}
    </div>
  )
}
