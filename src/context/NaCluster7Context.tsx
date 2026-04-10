import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'aimc_na_cluster7_resolved'
const RESOLVED_EVENT = 'aimc-na-cluster7-resolved'

type NaCluster7ContextValue = {
  /** NA Order Processing Agent incident cleared after production deploy */
  naCluster7Resolved: boolean
  markNaCluster7Resolved: () => void
  /** Clear persisted demo state, go to Global View, and hard-reload for a clean run */
  restartDemo: () => void
}

const NaCluster7Context = createContext<NaCluster7ContextValue | null>(null)

function readStored(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function NaCluster7Provider({ children }: { children: ReactNode }) {
  const [naCluster7Resolved, setNaCluster7Resolved] = useState(readStored)

  useEffect(() => {
    const sync = () => setNaCluster7Resolved(readStored())
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener(RESOLVED_EVENT, sync)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(RESOLVED_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const markNaCluster7Resolved = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1')
    setNaCluster7Resolved(true)
    window.dispatchEvent(new Event(RESOLVED_EVENT))
  }, [])

  const restartDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore private mode / quota */
    }
    const onHome =
      window.location.pathname === '/' || window.location.pathname === ''
    if (onHome) {
      window.location.reload()
    } else {
      window.location.href = '/'
    }
  }, [])

  const value = useMemo(
    () => ({ naCluster7Resolved, markNaCluster7Resolved, restartDemo }),
    [naCluster7Resolved, markNaCluster7Resolved, restartDemo],
  )

  return (
    <NaCluster7Context.Provider value={value}>
      {children}
    </NaCluster7Context.Provider>
  )
}

export function useNaCluster7() {
  const ctx = useContext(NaCluster7Context)
  if (!ctx) {
    throw new Error('useNaCluster7 requires NaCluster7Provider')
  }
  return ctx
}
