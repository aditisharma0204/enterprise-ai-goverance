import { useState } from 'react'

const ICONS = [
  { id: 'grid', symbol: '⊞' },
  { id: 'k8s', symbol: '⎈' },
  { id: 'cmd', symbol: '⌘' },
  { id: 'export', symbol: '⍄' },
] as const

export function AppSidebar() {
  const [activeId, setActiveId] = useState<string>('k8s')

  return (
    <aside className="app-sidebar" aria-label="Tools">
      {ICONS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`sidebar-icon${activeId === item.id ? ' active' : ''}`}
          onClick={() => setActiveId(item.id)}
        >
          {item.symbol}
        </button>
      ))}
      <button type="button" className="sidebar-icon settings">
        ⚙
      </button>
    </aside>
  )
}
