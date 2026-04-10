import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function baseProps(size: number, props: IconProps) {
  const { size: _s, width, height, ...rest } = props
  return {
    width: width ?? size,
    height: height ?? size,
    fill: 'none' as const,
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    ...rest,
  }
}

export function IconChevronRight(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function IconExport(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  )
}

export function IconSliders(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  )
}

export function IconTrendUp({ className, ...props }: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg
      {...p}
      className={['telemetry-trend-icon', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )
}

export function IconZoomIn(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )
}

export function IconZoomOut(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  )
}

export function IconExpand(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  )
}

export function IconRestart(props: IconProps) {
  const p = baseProps(24, props)
  return (
    <svg {...p} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}
