import { Link } from 'react-router-dom'
import { ROUTES, globalViewMapHref } from '../../constants/routes'

/**
 * Matches Global View `global-page-header` crumbs: accent links, neutral current.
 */
export function ContentHeader() {
  return (
    <div className="global-page-header mc-content-header">
      <div className="mc-content-header-text">
        <div className="global-breadcrumbs">
          <Link to={ROUTES.home} className="global-crumb-link">
            Global View
          </Link>
          <span className="global-crumb-sep">/</span>
          <Link to={globalViewMapHref('north-america')} className="global-crumb-link">
            North America
          </Link>
          <span className="global-crumb-sep">/</span>
          <Link to={globalViewMapHref('united-states')} className="global-crumb-link">
            United States
          </Link>
          <span className="global-crumb-sep">/</span>
          <span className="global-crumb-current">Order Processing Agent</span>
        </div>
        <h1 className="global-page-title">Cluster operations & dependency review</h1>
      </div>
    </div>
  )
}
