import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useNaCluster7 } from '../../context/NaCluster7Context'
import { useTheme } from '../../context/ThemeContext'

type NavItem = {
  id: string
  label: string
  /** `null` = not shipped in v1; shown as roadmap (disabled). */
  to: string | null
  badge?: 'alert'
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', to: null },
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

function SunIcon() {
  return (
    <svg className="theme-toggle-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="theme-toggle-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}

export function TrustOpsHeader() {
  const { naCluster7Resolved, restartDemo } = useNaCluster7()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to={ROUTES.home} className="logo logo-link">
          <div className="logo-icon logo-icon--mark">
            <LogoBolt />
          </div>
          AI Mission Control
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
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <SunIcon />
          <span className={`theme-toggle-track${isDark ? ' theme-toggle-track--dark' : ''}`}>
            <span className="theme-toggle-thumb" />
          </span>
          <MoonIcon />
        </button>
      </div>
    </header>
  )
}
