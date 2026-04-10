import type { ReactNode } from 'react'

export type FlowNodeVariant = 'default' | 'active' | 'alert'

type FlowNodeProps = {
  nodeType: string
  title: string
  status: 'green' | 'amber'
  metrics: ReactNode
  variant?: FlowNodeVariant
  onInspect?: () => void
}

export function FlowNode({
  nodeType,
  title,
  status,
  metrics,
  variant = 'default',
  onInspect,
}: FlowNodeProps) {
  const classNames = ['node']
  if (variant === 'active') classNames.push('is-active')
  if (variant === 'alert') classNames.push('is-alert')
  if (onInspect) classNames.push('node--inspectable')

  return (
    <div
      className={classNames.join(' ')}
      role={onInspect ? 'button' : undefined}
      tabIndex={onInspect ? 0 : undefined}
      aria-label={onInspect ? `Open workflow details for ${title}` : undefined}
      onClick={onInspect}
      onKeyDown={
        onInspect
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onInspect()
              }
            }
          : undefined
      }
    >
      <div className="node-header">
        <span className="node-type">{nodeType}</span>
        <div
          className={`node-status ${status === 'green' ? 'status-green' : 'status-amber'}`}
        />
      </div>
      <div className="node-title">{title}</div>
      <div className="node-metrics">{metrics}</div>
    </div>
  )
}
