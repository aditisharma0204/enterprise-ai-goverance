import { useCallback, useEffect, useRef, useState } from 'react'
import { useMissionCluster } from './MissionClusterContext'

type MsgRole = 'agent' | 'user' | 'status'

interface ChatMessage {
  id: string
  role: MsgRole
  body: string
  policyRef?: string
  metrics?: { label: string; value: string }[]
  actions?: { id: string; label: string }[]
  statusType?: 'progress' | 'success' | 'info'
  progressPct?: number
  /** Fire a graph-phase change right after this message appears */
  phaseEffect?: 'stop-traffic' | 'retraining' | 'retrain-complete' | 'deploying' | 'deploy-done'
}

const POLICY_CLAUSE =
  '§4.2 Domain Boundary Enforcement — The agent must not generate responses outside its approved knowledge domain. Any request that falls outside the declared scope must be declined with a standard boundary message.'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'af-1',
    role: 'agent',
    body: 'Order Processing Agent has 3 policy warnings/min. I detected a prompt bypass on usr_8x92a… — the agent responded to electrical wiring instructions outside its approved domain.',
    policyRef: POLICY_CLAUSE,
    metrics: [
      { label: 'People/hr exposed', value: '~18.2K' },
      { label: 'Apps degraded', value: '4' },
      { label: 'Revenue drag (est.)', value: '~0.04%' },
    ],
  },
]

interface Turn {
  userText: string
  thinkMs: number
  responses: ChatMessage[]
}

const TURNS: Turn[] = [
  {
    userText: 'What are my options?',
    thinkMs: 1800,
    responses: [
      {
        id: 'af-2',
        role: 'agent',
        body: 'I recommend three steps:',
        actions: [
          { id: 'add-data', label: '1. Add to eval dataset — capture failing interactions as new test cases' },
          { id: 'retrain', label: '2. Retrain agent — run evals against the updated dataset' },
          { id: 'launch', label: '3. Relaunch agent — deploy the retrained version to production' },
        ],
      },
      {
        id: 'af-2b',
        role: 'agent',
        body: 'I can also stop all traffic or shut down the agent entirely while we fix this. What would you like to do?',
      },
    ],
  },
  {
    userText: 'Stop all traffic to Order Processing Agent',
    thinkMs: 1200,
    responses: [
      {
        id: 'af-3',
        role: 'status',
        body: 'Traffic to Order Processing Agent stopped (0%). All requests rerouted to fallback cluster.',
        statusType: 'success',
        phaseEffect: 'stop-traffic',
      },
    ],
  },
  {
    userText: 'Add the failing interactions to the eval dataset and retrain',
    thinkMs: 1000,
    responses: [
      {
        id: 'af-4a',
        role: 'status',
        body: 'Adding 3 flagged interactions to eval dataset…',
        statusType: 'progress',
        progressPct: 100,
        phaseEffect: 'retraining',
      },
      {
        id: 'af-4b',
        role: 'status',
        body: '✓ Dataset updated — 3 cases added',
        statusType: 'success',
      },
      {
        id: 'af-4c',
        role: 'status',
        body: 'Starting retrain against updated evals…',
        statusType: 'progress',
        progressPct: 100,
      },
      {
        id: 'af-4d',
        role: 'status',
        body: '✓ Retrain complete — policy compliance: 98.4% (was 91.2%)',
        statusType: 'success',
        phaseEffect: 'retrain-complete',
      },
      {
        id: 'af-5',
        role: 'agent',
        body: 'Warning rate dropped to 0/min on the test slice. Ready to relaunch. Should I deploy to production?',
      },
    ],
  },
  {
    userText: 'Yes, launch it',
    thinkMs: 800,
    responses: [
      {
        id: 'af-6a',
        role: 'status',
        body: 'Deploying retrained agent to production…',
        statusType: 'progress',
        progressPct: 100,
        phaseEffect: 'deploying',
      },
      {
        id: 'af-6b',
        role: 'status',
        body: '✓ Live — revision ag7-rem-481726 propagated to US production',
        statusType: 'success',
        phaseEffect: 'deploy-done',
      },
      {
        id: 'af-7',
        role: 'agent',
        body: 'Traffic restored to 100%. Order Processing Agent is active and monitoring for new warnings. No further action required.',
      },
    ],
  },
]

const STARTER_PROMPTS = [
  { id: 'sp-options', text: 'What are my options?' },
  { id: 'sp-stop', text: 'Stop all traffic' },
  { id: 'sp-policy', text: 'Show the breached policy' },
]

export function AgentForcePanel() {
  const {
    applyRemediations,
    finishRedeploy,
    setTrafficStopped,
    setClusterPhase,
  } = useMissionCluster()

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [turnIdx, setTurnIdx] = useState(0)
  const [busy, setBusy] = useState(false)
  const [trafficPct, setTrafficPct] = useState(100)
  const [phase, setPhase] = useState<'alert' | 'remediating' | 'deployed'>('alert')
  const [thinking, setThinking] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [typing, setTyping] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (threadRef.current) {
        threadRef.current.scrollTo({
          top: threadRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  }, [])

  useEffect(scrollToBottom, [messages, thinking, scrollToBottom])

  const applyMsgEffect = useCallback(
    (effect?: string) => {
      if (!effect) return
      switch (effect) {
        case 'stop-traffic':
          setTrafficPct(0)
          setTrafficStopped(true)
          setClusterPhase('traffic-stopped')
          break
        case 'retraining':
          setClusterPhase('retraining')
          break
        case 'retrain-complete':
          applyRemediations()
          setPhase('remediating')
          setClusterPhase('retrain-complete')
          break
        case 'deploying':
          setClusterPhase('deploying')
          break
        case 'deploy-done':
          setTrafficPct(100)
          setTrafficStopped(false)
          finishRedeploy('ag7-rem-481726')
          setPhase('deployed')
          setClusterPhase('healthy')
          break
      }
    },
    [applyRemediations, finishRedeploy, setTrafficStopped, setClusterPhase],
  )

  const typeIntoInput = useCallback(
    (text: string): Promise<void> =>
      new Promise((resolve) => {
        setInputValue('')
        setTyping(true)
        inputRef.current?.focus()
        let i = 0
        function tick() {
          if (i <= text.length) {
            setInputValue(text.slice(0, i))
            i++
            typingRef.current = setTimeout(tick, 28 + Math.random() * 22)
          } else {
            setTyping(false)
            resolve()
          }
        }
        tick()
      }),
    [],
  )

  const playTurn = useCallback(
    async (idx: number) => {
      if (idx >= TURNS.length || busy) return
      setBusy(true)
      const turn = TURNS[idx]

      await typeIntoInput(turn.userText)
      await new Promise((r) => setTimeout(r, 300))

      setMessages((prev) => [
        ...prev,
        { id: `u-${idx}`, role: 'user', body: turn.userText },
      ])
      setInputValue('')

      setThinking(true)
      await new Promise((r) => setTimeout(r, turn.thinkMs))
      setThinking(false)

      for (let i = 0; i < turn.responses.length; i++) {
        const msg = turn.responses[i]
        if (i > 0 && (msg.statusType === 'success' || msg.role === 'agent')) {
          await new Promise((r) => setTimeout(r, 800))
        } else if (i > 0) {
          await new Promise((r) => setTimeout(r, 400))
        }
        setMessages((prev) => [...prev, msg])
        applyMsgEffect(msg.phaseEffect)
      }

      setTurnIdx(idx + 1)
      setBusy(false)
    },
    [busy, applyMsgEffect, typeIntoInput],
  )

  const handleStarterClick = useCallback(
    (text: string) => {
      if (busy || turnIdx >= TURNS.length) return
      void typeIntoInput(text)
    },
    [busy, turnIdx, typeIntoInput],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (busy || turnIdx >= TURNS.length) return
      void playTurn(turnIdx)
    },
    [busy, turnIdx, playTurn],
  )

  const handleInputClick = useCallback(() => {
    if (busy || turnIdx >= TURNS.length) return
    if (!typing && inputValue.length === 0) {
      void playTurn(turnIdx)
    }
  }, [busy, turnIdx, typing, inputValue, playTurn])

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [])

  const headerStatus = phase === 'deployed'
    ? 'deployed'
    : phase === 'remediating'
      ? 'remediating'
      : 'alert'

  const done = turnIdx >= TURNS.length

  return (
    <div className="af-panel">
      <div className={`af-header af-header--${headerStatus}`}>
        <div className="af-header-left">
          <img
            className="af-logo"
            src={`${import.meta.env.BASE_URL}agentforce-icon.png`}
            alt=""
            aria-hidden
          />
          <span className="af-brand">Agentforce</span>
        </div>
        <div className="af-header-right">
          <span className={`af-status-chip af-status-chip--${headerStatus}`}>
            {phase === 'deployed'
              ? '✓ Resolved'
              : phase === 'remediating'
                ? 'Remediating'
                : trafficPct === 0
                  ? 'Traffic: stopped'
                  : `Traffic: ${trafficPct}%`}
          </span>
        </div>
      </div>

      <div className="af-thread" ref={threadRef}>
        {messages.map((m) => (
          <div key={m.id} className={`af-msg af-msg--${m.role} af-msg-enter`}>
            {m.role === 'agent' ? (
              <div className="af-msg-bubble af-msg-bubble--agent">
                <p className="af-msg-text">{m.body}</p>
                {m.policyRef ? (
                  <div className="af-policy-ref">
                    <span className="af-policy-badge">Policy breach</span>
                    <span className="af-policy-clause">{m.policyRef}</span>
                  </div>
                ) : null}
                {m.metrics ? (
                  <div className="af-metrics-row">
                    {m.metrics.map((met) => (
                      <div key={met.label} className="af-metric">
                        <span className="af-metric-value">{met.value}</span>
                        <span className="af-metric-label">{met.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {m.actions ? (
                  <div className="af-actions-list">
                    {m.actions.map((a) => (
                      <div key={a.id} className="af-action-item">{a.label}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : m.role === 'user' ? (
              <div className="af-msg-bubble af-msg-bubble--user">
                <p className="af-msg-text">{m.body}</p>
              </div>
            ) : (
              <div className={`af-status-msg af-status-msg--${m.statusType ?? 'info'}`}>
                {m.statusType === 'progress' ? (
                  <div className="af-progress-wrap">
                    <div className="af-progress-bar" style={{ width: `${m.progressPct ?? 0}%` }} />
                  </div>
                ) : null}
                <p className="af-status-text">{m.body}</p>
              </div>
            )}
          </div>
        ))}

        {thinking ? (
          <div className="af-msg af-msg--agent af-msg-enter">
            <div className="af-thinking">
              <span className="af-thinking-dot" />
              <span className="af-thinking-dot" />
              <span className="af-thinking-dot" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="af-input-area">
        {!done && !busy ? (
          <div className="af-prompts-above">
            {STARTER_PROMPTS.map((sp) => (
              <button
                key={sp.id}
                type="button"
                className="af-quick-chip"
                onClick={() => handleStarterClick(sp.text)}
              >
                {sp.text}
              </button>
            ))}
          </div>
        ) : done ? (
          <div className="af-prompts-above">
            <span className="af-quick-done">✓ Session complete</span>
          </div>
        ) : null}
        <form className="af-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="af-input"
            placeholder={
              done
                ? 'Session complete'
                : busy
                  ? 'Agentforce is responding…'
                  : 'Ask Agentforce…'
            }
            value={inputValue}
            readOnly
            onClick={handleInputClick}
          />
          <button
            type="submit"
            className={`af-send-btn${inputValue.length > 0 ? ' af-send-btn--active' : ''}`}
            disabled={done || busy}
            aria-label="Send"
          >
            ↵
          </button>
        </form>
      </div>
    </div>
  )
}
