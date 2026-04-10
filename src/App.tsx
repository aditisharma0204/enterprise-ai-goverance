import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GlobalViewPage } from './components/global-view/GlobalViewPage'
import { MissionControlPage } from './components/mission-control/MissionControlPage'
import { ROUTES } from './constants/routes'
import { NaCluster7Provider } from './context/NaCluster7Context'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NaCluster7Provider>
          <Routes>
            <Route path={ROUTES.home} element={<GlobalViewPage />} />
            <Route path={ROUTES.agentCluster7} element={<MissionControlPage />} />
          </Routes>
        </NaCluster7Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
