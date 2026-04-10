import { Route, Routes } from 'react-router-dom'
import { GlobalViewPage } from './components/global-view/GlobalViewPage'
import { MissionControlPage } from './components/mission-control/MissionControlPage'
import { ROUTES } from './constants/routes'
import { NaCluster7Provider } from './context/NaCluster7Context'

function App() {
  return (
    <NaCluster7Provider>
      <Routes>
        <Route path={ROUTES.home} element={<GlobalViewPage />} />
        <Route path={ROUTES.agentCluster7} element={<MissionControlPage />} />
      </Routes>
    </NaCluster7Provider>
  )
}

export default App
