/**
 * Agent cluster positions in **north-america.png pixel space** (13860×7520).
 * The new basemap is a tight crop of the US/Canada/Mexico region with state borders.
 * The SVG wraps map + markers in a transform so dots align with the image.
 */

export const NA_MAP_IMG_WIDTH = 13860
export const NA_MAP_IMG_HEIGHT = 7520

export type NaClusterStatus = 'healthy' | 'urgent' | 'elevated' | 'info'

export type NaClusterMarker = {
  id: string
  label: string
  /** X in PNG pixels (0–13860) */
  cx: number
  /** Y in PNG pixels (0–7520) */
  cy: number
}

/** 43 nodes — Canada, US, and Mexico. All safely inland on landmass. */
export const NA_CLUSTER_MARKERS: NaClusterMarker[] = [
  // Canada
  { id: 'ca-van', label: 'Vancouver', cx: 3500, cy: 1900 },
  { id: 'ca-cgy', label: 'Calgary', cx: 3900, cy: 1750 },
  { id: 'ca-wpg', label: 'Winnipeg', cx: 5200, cy: 1800 },
  { id: 'ca-yyz', label: 'Toronto', cx: 7400, cy: 2400 },
  { id: 'ca-yul', label: 'Montreal', cx: 8100, cy: 2150 },
  { id: 'ca-ott', label: 'Ottawa', cx: 7800, cy: 2250 },

  // US Northwest
  { id: 'us-sea', label: 'Seattle', cx: 3500, cy: 2700 },
  { id: 'us-por', label: 'Portland', cx: 3500, cy: 2900 },
  { id: 'us-boi', label: 'Boise', cx: 3800, cy: 3000 },

  // US Northern tier
  { id: 'us-msp', label: 'Minneapolis', cx: 5400, cy: 2900 },
  { id: 'us-det', label: 'Detroit', cx: 7200, cy: 3000 },

  // US Northeast
  { id: 'us-bos', label: 'Boston', cx: 8700, cy: 3000 },
  { id: 'us-jfk', label: 'New York', cx: 8500, cy: 3250 },
  { id: 'us-dca', label: 'Washington', cx: 8200, cy: 3500 },
  { id: 'us-phl', label: 'Philadelphia', cx: 8400, cy: 3350 },
  { id: 'us-pit', label: 'Pittsburgh', cx: 7700, cy: 3200 },

  // US West
  { id: 'us-sfo', label: 'San Francisco', cx: 3400, cy: 3600 },
  { id: 'us-lax', label: 'Los Angeles', cx: 3500, cy: 4050 },
  { id: 'us-phx', label: 'Phoenix', cx: 3800, cy: 4200 },
  { id: 'us-den', label: 'Denver', cx: 4200, cy: 3500 },

  // US Central / Texas
  { id: 'us-ord', label: 'Chicago', cx: 6300, cy: 3100 },
  { id: 'us-kci', label: 'Kansas City', cx: 5400, cy: 3600 },
  { id: 'us-okc', label: 'Oklahoma City', cx: 5100, cy: 4000 },
  { id: 'us-dfw', label: 'Dallas', cx: 5200, cy: 4350 },
  { id: 'us-aus', label: 'Austin', cx: 5000, cy: 4550 },
  { id: 'us-sat', label: 'San Antonio', cx: 4900, cy: 4650 },
  { id: 'us-iah', label: 'Houston', cx: 5500, cy: 4750 },

  // US Southeast / Gulf states
  { id: 'us-nsh', label: 'Nashville', cx: 6700, cy: 3850 },
  { id: 'us-mem', label: 'Memphis', cx: 6200, cy: 4100 },
  { id: 'us-bir', label: 'Birmingham', cx: 6700, cy: 4200 },
  { id: 'us-nol', label: 'New Orleans', cx: 6100, cy: 4800 },
  { id: 'us-atl', label: 'Atlanta', cx: 7100, cy: 4150 },
  { id: 'us-clt', label: 'Charlotte', cx: 7700, cy: 3850 },
  { id: 'us-tam', label: 'Tampa', cx: 7400, cy: 4900 },
  { id: 'us-orl', label: 'Orlando', cx: 7600, cy: 4800 },
  { id: 'us-jax', label: 'Jacksonville', cx: 7500, cy: 4600 },
  { id: 'us-mia', label: 'Miami', cx: 7800, cy: 5100 },
  { id: 'us-lrk', label: 'Little Rock', cx: 5800, cy: 4200 },
  { id: 'us-jks', label: 'Jackson', cx: 6300, cy: 4500 },

  // Agent USW-7 (central US)
  { id: 'us-ac7', label: 'Agent USW-7', cx: 6500, cy: 3600 },

  // Mexico
  { id: 'mx-mty', label: 'Monterrey', cx: 4700, cy: 5500 },
  { id: 'mx-mex', label: 'Mexico City', cx: 4600, cy: 6200 },
  { id: 'mx-gdl', label: 'Guadalajara', cx: 4100, cy: 6000 },
]

/**
 * Rough contiguous U.S. hit target (image pixels). Tuned for this asset's
 * projection; sits under cluster markers so the urgent cluster remains clickable.
 */
export const US_MAP_HIT_PATH =
  'M 2000 2600 L 3500 2500 L 5500 2600 L 7800 2800 L 9400 3100 L 9800 3800 L 9500 4600 L 8500 5400 L 7600 5700 L 6200 5500 L 5000 5200 L 3800 4800 L 2800 4500 L 2200 3800 L 2000 3100 Z'

const ELEVATED_IDS = new Set(['us-dfw', 'us-ord'])
const INFO_IDS = new Set(['us-mia'])

export function naMapContentGroupTransform(
  viewBoxW = 1200,
  viewBoxH = 750,
): string {
  const scaleX = viewBoxW / NA_MAP_IMG_WIDTH
  const scaleY = viewBoxH / NA_MAP_IMG_HEIGHT
  const scale = Math.max(scaleX, scaleY)
  const offsetX = (viewBoxW - NA_MAP_IMG_WIDTH * scale) / 2
  const offsetY = (viewBoxH - NA_MAP_IMG_HEIGHT * scale) / 2
  return `translate(${offsetX.toFixed(1)} ${offsetY.toFixed(1)}) scale(${scale.toFixed(6)})`
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
