import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error in React tree:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#e4e4ec',
          background: '#101018', padding: 40, textAlign: 'center',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ fontSize: 15, color: '#9d9db5', maxWidth: 480, marginBottom: 24 }}>
            An unexpected error occurred. Reload the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', fontSize: 14, fontWeight: 600,
              background: '#4488ff', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
