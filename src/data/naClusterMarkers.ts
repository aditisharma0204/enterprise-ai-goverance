/**
 * Agent cluster positions in **north-america.png pixel space** (1000×1106).
 * The SVG wraps map + markers in `translate(offsetX,0) scale(scale)` so dots align
 * with `preserveAspectRatio="xMidYMid meet"` letterboxing.
 */

export const NA_MAP_IMG_WIDTH = 1000
export const NA_MAP_IMG_HEIGHT = 1106
const NA_MAP_ZOOM = 1.83
const NA_MAP_PAN_X = -20
const NA_MAP_PAN_Y = 60

export type NaClusterStatus = 'healthy' | 'urgent' | 'elevated' | 'info'

export type NaClusterMarker = {
  id: string
  label: string
  /** X in PNG pixels (0–1000) */
  cx: number
  /** Y in PNG pixels (0–1106) */
  cy: number
}

/** 22 nodes — matches Global View “Node status” story */
export const NA_CLUSTER_MARKERS: NaClusterMarker[] = [
  { id: 'ca-van', label: 'Vancouver', cx: 248, cy: 392 },
  { id: 'ca-cgy', label: 'Calgary', cx: 308, cy: 352 },
  { id: 'ca-wpg', label: 'Winnipeg', cx: 382, cy: 362 },
  { id: 'ca-yyz', label: 'Toronto', cx: 512, cy: 388 },
  { id: 'ca-yul', label: 'Montreal', cx: 552, cy: 368 },
  { id: 'ca-hal', label: 'Halifax', cx: 622, cy: 378 },
  { id: 'us-sea', label: 'Seattle', cx: 238, cy: 442 },
  { id: 'us-sfo', label: 'San Francisco', cx: 218, cy: 498 },
  { id: 'us-lax', label: 'Los Angeles', cx: 208, cy: 542 },
  { id: 'us-phx', label: 'Phoenix', cx: 258, cy: 522 },
  { id: 'us-den', label: 'Denver', cx: 318, cy: 482 },
  { id: 'us-ord', label: 'Chicago', cx: 448, cy: 452 },
  { id: 'us-msp', label: 'Minneapolis', cx: 395, cy: 418 },
  { id: 'us-dfw', label: 'Dallas', cx: 368, cy: 548 },
  { id: 'us-iah', label: 'Houston', cx: 392, cy: 568 },
  { id: 'us-atl', label: 'Atlanta', cx: 522, cy: 512 },
  { id: 'us-mia', label: 'Miami', cx: 582, cy: 598 },
  { id: 'us-jfk', label: 'New York', cx: 568, cy: 448 },
  { id: 'us-bos', label: 'Boston', cx: 592, cy: 428 },
  { id: 'us-dca', label: 'Washington', cx: 558, cy: 462 },
  { id: 'us-ac7', label: 'Agent Cluster 7', cx: 402, cy: 472 },
  { id: 'mx-mex', label: 'Mexico City', cx: 392, cy: 805 },
]

/**
 * Rough contiguous U.S. hit target (PNG pixels). Tuned for this asset’s projection;
 * sits under cluster markers so urgent cluster remains clickable on top.
 */
export const US_MAP_HIT_PATH =
  'M 200 418 L 268 405 L 412 402 L 548 408 L 658 425 L 718 448 L 738 492 L 728 548 L 688 612 L 618 652 L 528 678 L 432 672 L 318 628 L 248 562 L 208 492 L 198 448 Z'

const ELEVATED_IDS = new Set(['us-dfw', 'us-ord'])
const INFO_IDS = new Set(['us-mia'])

export function naMapContentGroupTransform(
  viewBoxW = 1200,
  viewBoxH = 750,
): string {
  const baseScale = viewBoxH / NA_MAP_IMG_HEIGHT
  const scale = baseScale * NA_MAP_ZOOM
  const offsetX = (viewBoxW - NA_MAP_IMG_WIDTH * scale) / 2 + NA_MAP_PAN_X
  const offsetY = (viewBoxH - NA_MAP_IMG_HEIGHT * scale) / 2 + NA_MAP_PAN_Y
  return `translate(${offsetX} ${offsetY}) scale(${scale})`
}

export function naClusterStatuses(
  incidentResolved: boolean,
): Array<NaClusterMarker & { status: NaClusterStatus }> {
  return NA_CLUSTER_MARKERS.map((m) => {
    if (incidentResolved) {
      return { ...m, status: 'healthy' as const }
    }
    if (m.id === 'us-ac7') return { ...m, status: 'urgent' as const }
    if (ELEVATED_IDS.has(m.id)) return { ...m, status: 'elevated' as const }
    if (INFO_IDS.has(m.id)) return { ...m, status: 'info' as const }
    return { ...m, status: 'healthy' as const }
  })
}
