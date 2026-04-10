import { useMemo, useState } from 'react'
import { useMissionCluster } from './MissionClusterContext'

type EdgeRow = {
  id: string
  from: string
  to: string
  rps: string
  err: string
  p95: string
  detail: string
  samples: string[]
}

const EDGES: EdgeRow[] = [
  {
    id: 'e1',
    from: 'Router Node-7',
    to: 'LLM Provider (Primary)',
    rps: '12.4k',
    err: '0.02%',
    p95: '38ms',
    detail:
      'Primary completion path. Majority of traffic is compliant; spikes correlate with eval dataset drift window.',
    samples: [
      'POST /v1/chat · usr_8x92a… · blocked after policy rewrite',
      'POST /v1/chat · usr_4m21p… · allowed with warning tag',
    ],
  },
  {
    id: 'e2',
    from: 'Router Node-7',
    to: 'Evaluation Dataset (Vector)',
    rps: '4.1k',
    err: '0.31%',
    p95: '112ms',
    detail:
      'Retriever + eval alignment. Elevated latency and error rate during drift; retrieval mixing production and eval shards.',
    samples: [
      'GET /index/query · hybrid topK=8 · eval shard hit ratio 34%',
      'Embedding batch · 512d · partial timeout on replica b-2',
    ],
  },
  {
    id: 'e3',
    from: 'LLM Provider (Primary)',
    to: 'Response Synthesizer',
    rps: '11.9k',
    err: '0.01%',
    p95: '41ms',
    detail:
      'Downstream synthesis and safety pass-through. Clean except when upstream eval context is poisoned.',
    samples: [
      'Stream merge · safety tier L2 · pass',
      'Stream merge · safety tier L2 · human-review queue +1',
    ],
  },
  {
    id: 'e4',
    from: 'Evaluation Dataset (Vector)',
    to: 'Response Synthesizer',
    rps: '3.8k',
    err: '0.18%',
    p95: '94ms',
    detail:
      'Context packaging for final response. Warning-stamped edges trace back to eval drift +14%.',
    samples: [
      'ctx_pack · tokens_in 4.2k · policy_score 0.71',
      'ctx_pack · tokens_in 6.1k · policy_score 0.62 (threshold 0.70)',
    ],
  },
  {
    id: 'e5',
    from: 'Public API',
    to: 'Router Node-7',
    rps: '14.2k',
    err: '0.04%',
    p95: '44ms',
    detail: 'Ingress path from API gateway into the agent cluster.',
    samples: [
      'JWT validate · org_na_west · rate_bucket 82% full',
      'Traceparent · 00-4bf92f3577b34da6…',
    ],
  },
]

export function EdgeTrafficView() {
  const { liveTick, remediated } = useMissionCluster()
  const [selected, setSelected] = useState<string>('e2')

  const jitter = (base: number, tick: number) =>
    base + (tick % 5) * (tick % 2 === 0 ? 1 : -1)

  const rows = useMemo(() => {
    return EDGES.map((e, i) => ({
      ...e,
      liveRps: jitter(100 + i * 17, liveTick + i),
    }))
  }, [liveTick])

  const active = rows.find((r) => r.id === selected) ?? rows[0]

  return (
    <div className="edge-traffic">
      <p className="sr-only">
        Live edge traffic table: each row is a connection between services with estimated
        requests per second, error rate, and latency. Select a row to read details and
        sample requests in the panel beside the table.
      </p>
      <div className="edge-traffic-head">
        <div className="edge-traffic-title">Live edge traffic</div>
        <div className="edge-traffic-sub">
          Select a connection to inspect recent interactions and error envelopes.
          {remediated ? (
            <span className="edge-traffic-ok"> · Traffic stabilizing post-remediation</span>
          ) : null}
        </div>
      </div>
      <div className="edge-traffic-body">
        <div className="edge-traffic-list mc-scroll">
          <table className="edge-table">
            <thead>
              <tr>
                <th>Edge</th>
                <th>RPS (est.)</th>
                <th>Err</th>
                <th>p95</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className={selected === r.id ? 'edge-table-row--active' : ''}
                >
                  <td>
                    <button
                      type="button"
                      className="edge-table-link"
                      onClick={() => setSelected(r.id)}
                    >
                      {r.from} → {r.to}
                    </button>
                  </td>
                  <td>
                    <span className="edge-live-val">{r.liveRps}</span>
                    <span className="edge-live-delta" aria-hidden>
                      {' '}
                      · live
                    </span>
                  </td>
                  <td>{r.err}</td>
                  <td>{r.p95}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="edge-traffic-detail mc-scroll">
          <div className="edge-detail-head">
            <span className="edge-detail-route">
              {active.from} → {active.to}
            </span>
            <span className="edge-detail-pill">Last 5m</span>
          </div>
          <p className="edge-detail-desc">{active.detail}</p>
          <h4 className="edge-detail-samples-title">Recent interaction samples</h4>
          <ul className="edge-detail-samples">
            {active.samples.map((s, i) => (
              <li key={i} className="edge-sample-item">
                <code>{s}</code>
              </li>
            ))}
          </ul>
          <div className="edge-stream-line">
            <span className="live-pulse-dot live-pulse-dot--sm" aria-hidden />
            Streaming updates on tick #{liveTick}
          </div>
        </div>
      </div>
    </div>
  )
}
