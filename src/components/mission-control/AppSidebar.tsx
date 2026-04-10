import { IconWorkspace } from '../icons/AppIcons'

/** Slim layout rail; views are switched from the investigation tabs. */
export function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Mission layout">
      <div className="sidebar-mark" aria-hidden>
        <IconWorkspace size={22} />
      </div>
    </aside>
  )
}
