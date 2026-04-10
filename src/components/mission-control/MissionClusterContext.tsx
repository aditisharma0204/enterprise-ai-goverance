import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNaCluster7 } from '../../context/NaCluster7Context'

export type InvestigationMode = 'blast' | 'workflow' | 'edges'

export type ClusterPhase =
  | 'alert'
  | 'traffic-stopped'
  | 'retraining'
  | 'retrain-complete'
  | 'deploying'
  | 'healthy'

export type SessionLog = {
  id: string
  badge: 'danger' | 'warning'
  desc: string
}

type MissionClusterContextValue = {
  investigationMode: InvestigationMode
  setInvestigationMode: (m: InvestigationMode) => void
  remediated: boolean
  applyRemediations: () => void
  warningsPerMin: number
  liveTick: number
  secondsSinceSync: number
  sessions: SessionLog[]
  redeployOpen: boolean
  setRedeployOpen: (v: boolean) => void
  redeployComplete: boolean
  deployRevisionId: string | null
  finishRedeploy: (revisionId: string) => void
  workflowNodeDetail: string | null
  setWorkflowNodeDetail: (id: string | null) => void
  trafficStopped: boolean
  setTrafficStopped: (v: boolean) => void
  clusterPhase: ClusterPhase
  setClusterPhase: (p: ClusterPhase) => void
}

const MissionClusterContext = createContext<MissionClusterContextValue | null>(
  null,
)

const SEED_SESSIONS: SessionLog[] = [
  {
    id: 'usr_8x92a…',
    badge: 'danger',
    desc: 'Prompt bypass detected regarding electrical wiring instructions.',
  },
  {
    id: 'usr_4m21p…',
    badge: 'warning',
    desc: 'Borderline content generation outside domain bounds.',
  },
  {
    id: 'usr_9k33c…',
    badge: 'warning',
    desc: 'Elevated token usage on unsupported tool invocation path.',
  },
]

export function MissionClusterProvider({ children }: { children: ReactNode }) {
  const { markNaCluster7Resolved } = useNaCluster7()
  const [investigationMode, setInvestigationMode] =
    useState<InvestigationMode>('blast')
  const [remediated, setRemediated] = useState(false)
  const [warningsPerMin, setWarningsPerMin] = useState(3)
  const [liveTick, setLiveTick] = useState(0)
  const [secondsSinceSync, setSecondsSinceSync] = useState(0)
  const [sessions, setSessions] = useState<SessionLog[]>(SEED_SESSIONS)
  const [redeployOpen, setRedeployOpen] = useState(false)
  const [redeployComplete, setRedeployComplete] = useState(false)
  const [deployRevisionId, setDeployRevisionId] = useState<string | null>(null)
  const [workflowNodeDetail, setWorkflowNodeDetail] = useState<string | null>(
    null,
  )
  const [trafficStopped, setTrafficStopped] = useState(false)
  const [clusterPhase, setClusterPhase] = useState<ClusterPhase>('alert')

  useEffect(() => {
    const id = setInterval(() => setLiveTick((n) => n + 1), 2800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSecondsSinceSync((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setSecondsSinceSync(0)
  }, [liveTick])

  useEffect(() => {
    if (remediated || liveTick === 0 || liveTick % 2 !== 0) return
    setSessions((prev) => {
      if (prev.length >= 9) return prev
      const n = prev.length + 1
      return [
        ...prev,
        {
          id: `usr_live_${n}b7…`,
          badge: n % 3 === 0 ? 'danger' : 'warning',
          desc:
            n % 3 === 0
              ? 'Policy evaluator flagged DIY home-repair guidance in chat transcript.'
              : 'Session crossed domain guardrail with elevated completion tokens.',
        },
      ]
    })
  }, [liveTick, remediated])

  const applyRemediations = useCallback(() => {
    setRemediated(true)
    setWarningsPerMin(0)
  }, [])

  const finishRedeploy = useCallback(
    (revisionId: string) => {
      setRedeployComplete(true)
      setDeployRevisionId(revisionId)
      markNaCluster7Resolved()
    },
    [markNaCluster7Resolved],
  )

  const value = useMemo(
    () => ({
      investigationMode,
      setInvestigationMode,
      remediated,
      applyRemediations,
      warningsPerMin,
      liveTick,
      secondsSinceSync,
      sessions,
      redeployOpen,
      setRedeployOpen,
      redeployComplete,
      deployRevisionId,
      finishRedeploy,
      workflowNodeDetail,
      setWorkflowNodeDetail,
      trafficStopped,
      setTrafficStopped,
      clusterPhase,
      setClusterPhase,
    }),
    [
      investigationMode,
      remediated,
      applyRemediations,
      warningsPerMin,
      liveTick,
      secondsSinceSync,
      sessions,
      redeployOpen,
      redeployComplete,
      deployRevisionId,
      finishRedeploy,
      workflowNodeDetail,
      trafficStopped,
      clusterPhase,
    ],
  )

  return (
    <MissionClusterContext.Provider value={value}>
      {children}
    </MissionClusterContext.Provider>
  )
}

export function useMissionCluster() {
  const ctx = useContext(MissionClusterContext)
  if (!ctx) {
    throw new Error('useMissionCluster requires MissionClusterProvider')
  }
  return ctx
}
