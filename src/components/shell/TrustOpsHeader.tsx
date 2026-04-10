import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useNaCluster7 } from '../../context/NaCluster7Context'

type NavItem = {
  id: string
  label: string
  /** `null` = not shipped in v1; shown as roadmap (disabled). */
  to: string | null
  badge?: 'alert'
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', to: null },
  { id: 'mission', label: 'Mission Control', to: ROUTES.agentCluster7, badge: 'alert' },
  { id: 'governance', label: 'Governance', to: null },
  { id: 'compliance', label: 'Compliance Reports', to: null },
]

function LogoBolt() {
  return (
    <svg
      className="logo-mark-svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  )
}

export function TrustOpsHeader() {
  const { naCluster7Resolved, restartDemo } = useNaCluster7()

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to={ROUTES.home} className="logo logo-link">
          <div className="logo-icon logo-icon--mark">
            <LogoBolt />
          </div>
          TrustOps AI
        </Link>
        <nav className="header-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const badge =
              item.badge === 'alert' && item.id === 'mission' && naCluster7Resolved ? (
                <span className="nav-pill-badge nav-pill-badge--clear">Stable</span>
              ) : item.badge === 'alert' ? (
                <span className="nav-pill-badge nav-pill-badge--amber">Alert</span>
              ) : null

            if (item.to) {
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}
                >
                  {item.label}
                  {badge}
                </NavLink>
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                className="nav-pill nav-pill--roadmap"
                disabled
                aria-label={`${item.label}, not available in this demo. Planned for a future release. Version 1 includes Global View and Mission Control only.`}
                title="Planned for a future release (v1 is Global View + Mission Control)."
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
      <div className="header-right">
        <button
          type="button"
          className="header-demo-restart"
          onClick={() => restartDemo()}
          title="Clear saved demo state and return to the start of the scenario"
        >
          Restart demo
        </button>
        <div className="metric-pill">System Trust Score: 98.7%</div>
        <button type="button" className="btn btn-primary btn-header">
          Global Settings
        </button>
      </div>
    </header>
  )
}
