import { useCallback, useRef, type KeyboardEvent } from 'react'
import type { InvestigationMode } from './MissionClusterContext'

const MODES: { id: InvestigationMode; label: string; hint: string }[] = [
  {
    id: 'blast',
    label: 'Blast radius',
    hint: 'CMDB & service graph',
  },
  {
    id: 'workflow',
    label: 'Workflow',
    hint: 'Architecture nodes',
  },
  {
    id: 'edges',
    label: 'Live edges',
    hint: 'Traffic & interactions',
  },
]

type Props = {
  mode: InvestigationMode
  onChange: (m: InvestigationMode) => void
}

export function InvestigationModeTabs({ mode, onChange }: Props) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  const focusIndex = useCallback((i: number) => {
    const len = MODES.length
    const idx = ((i % len) + len) % len
    btnRefs.current[idx]?.focus()
  }, [])

  const onToolbarKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const i = MODES.findIndex((m) => m.id === mode)
      if (i < 0) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const ni = (i + 1) % MODES.length
        onChange(MODES[ni].id)
        focusIndex(ni)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const ni = (i - 1 + MODES.length) % MODES.length
        onChange(MODES[ni].id)
        focusIndex(ni)
      } else if (e.key === 'Home') {
        e.preventDefault()
        onChange(MODES[0].id)
        focusIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        const last = MODES.length - 1
        onChange(MODES[last].id)
        focusIndex(last)
      }
    },
    [mode, onChange, focusIndex],
  )

  return (
    <div
      className="investigation-tabs"
      role="toolbar"
      aria-label="Investigation view"
      onKeyDown={onToolbarKeyDown}
    >
      {MODES.map((m, index) => (
        <button
          key={m.id}
          ref={(el) => {
            btnRefs.current[index] = el
          }}
          type="button"
          aria-pressed={mode === m.id}
          className={`investigation-tab${mode === m.id ? ' investigation-tab--active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          <span className="investigation-tab-label">{m.label}</span>
          <span className="investigation-tab-hint">{m.hint}</span>
        </button>
      ))}
    </div>
  )
}
