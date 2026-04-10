import { useMemo, useState } from 'react'
import { useMissionCluster } from './MissionClusterContext'

type EdgeRow = {
  id: string
  /** Short, leadership-friendly label in the table */
  tableLabel: string
  /** Underlying system names for operators who need them */
  systemPath: string
  err: string
  p95: string
  plainLead: string
  technicalNote: string
  examples: string[]
}

const EDGES: EdgeRow[] = [
  {
    id: 'e1',
    tableLabel: 'AI routing → production model',
    systemPath: 'Router Node-7 → LLM Provider (Primary)',
    err: '0.02%',
    p95: '38ms',
    plainLead:
      'This is the busiest path: after traffic is routed, it calls the primary model that most shoppers see. Right now it is healthy—most requests succeed quickly.',
    technicalNote:
      'Telemetry: completion path; short spikes lined up with evaluation-dataset drift windows.',
    examples: [
      'A shopper request was stopped after an automatic policy rewrite blocked the reply.',
      'Another request was allowed through but tagged so support could review it later.',
    ],
  },
  {
    id: 'e2',
    tableLabel: 'AI routing → test / evaluation search',
    systemPath: 'Router Node-7 → Evaluation Dataset (Vector)',
    err: '0.31%',
    p95: '112ms',
    plainLead:
      'Here the system pulls in test and benchmark content to check answers against known-good examples. Higher errors and slower responses usually mean “training or test data is leaking into live retrieval,” which confuses the model.',
    technicalNote:
      'Retriever latency elevated; eval shard hit ratio abnormal vs. production baseline.',
    examples: [
      'About one in three lookups hit evaluation data instead of only production catalogs.',
      'A batch of embedding lookups timed out on a replica—signals congestion or misrouting.',
    ],
  },
  {
    id: 'e3',
    tableLabel: 'Production model → answer assembly',
    systemPath: 'LLM Provider (Primary) → Response Synthesizer',
    err: '0.01%',
    p95: '41ms',
    plainLead:
      'After the model drafts a reply, this step merges streams, applies safety checks, and formats the final answer. It is normally quiet unless bad context was fed in from upstream.',
    technicalNote:
      'Downstream synthesis tier L2; anomalies trace to poisoned eval context when present.',
    examples: [
      'Standard merge: safety checks passed and the reply went out.',
      'One stream was sent to the human-review queue after an automated risk flag.',
    ],
  },
  {
    id: 'e4',
    tableLabel: 'Test search → answer assembly',
    systemPath: 'Evaluation Dataset (Vector) → Response Synthesizer',
    err: '0.18%',
    p95: '94ms',
    plainLead:
      'Test or benchmark snippets get packaged into the same “final answer” step. When this path looks noisy, eval material may be influencing customer-facing responses.',
    technicalNote:
      'Context packaging shows warning-stamped edges; drift estimate +14% vs. control window.',
    examples: [
      'A large context bundle scored below the policy threshold—reply held for review.',
      'A second bundle was closer to the line; still allowed but logged for audit.',
    ],
  },
  {
    id: 'e5',
    tableLabel: 'Internet traffic → AI routing',
    systemPath: 'Public API → Router Node-7',
    err: '0.04%',
    p95: '44ms',
    plainLead:
      'This is the front door: apps and websites send customer traffic into the cluster through the API gateway. Think of it as “everything entering the AI stack.”',
    technicalNote:
      'Ingress via API gateway; JWT org validation and rate buckets within normal range.',
    examples: [
      'Traffic validated for the expected retail org; usage sat below the rate limit.',
      'Distributed tracing IDs show normal handoff from gateway to router.',
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
        Table of links between services with estimated load, error rate, and
        latency. Select a row to open the detail panel.
      </p>
      <div className="edge-traffic-head">
        <div className="edge-traffic-title">Live traffic between services</div>
        <div className="edge-traffic-sub">
          Select a row for detail.
          {remediated ? (
            <span className="edge-traffic-ok"> · Post-remediation</span>
          ) : null}
        </div>
      </div>
      <div className="edge-traffic-body">
        <div className="edge-traffic-list mc-scroll">
          <table className="edge-table">
            <thead>
              <tr>
                <th>Connection</th>
                <th>
                  Req/sec <span className="edge-th-hint">(est.)</span>
                </th>
                <th>Error rate</th>
                <th>
                  Typical latency <span className="edge-th-hint">(p95)</span>
                </th>
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
                      <span className="edge-table-link-primary">{r.tableLabel}</span>
                      <span className="edge-table-link-system">{r.systemPath}</span>
                    </button>
                  </td>
                  <td>
                    <span className="edge-live-val">{r.liveRps}</span>
                    <span className="edge-live-delta" aria-hidden>
                      {' '}
                      · active
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
            <span className="edge-detail-route">{active.tableLabel}</span>
            <span className="edge-detail-pill">Last 5 minutes</span>
          </div>
          <p className="edge-detail-system" aria-label="Technical path">
            {active.systemPath}
          </p>
          <p className="edge-detail-lead">{active.plainLead}</p>
          <p className="edge-detail-technical">
            <span className="edge-detail-technical-label">Technical note · </span>
            {active.technicalNote}
          </p>
          <h4 className="edge-detail-samples-title">
            Recent examples (illustrative)
          </h4>
          <ul className="edge-detail-samples">
            {active.examples.map((s, i) => (
              <li key={i} className="edge-sample-item">
                {s}
              </li>
            ))}
          </ul>
          <div className="edge-stream-line">
            <span className="live-pulse-dot live-pulse-dot--sm" aria-hidden />
            Numbers refresh on a short timer (demo) · tick {liveTick}
          </div>
        </div>
      </div>
    </div>
  )
}
