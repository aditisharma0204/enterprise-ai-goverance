import '../../globalView.css'
import '../../missionControl.css'
import { TrustOpsHeader } from '../shell/TrustOpsHeader'
import { AppSidebar } from './AppSidebar'
import { BlastRadiusGraph } from './BlastRadiusGraph'
import { ContentHeader } from './ContentHeader'
import { AgentForcePanel } from './AgentForcePanel'
import { EdgeTrafficView } from './EdgeTrafficView'
import { GraphCanvas } from './GraphCanvas'
// import { InvestigationModeTabs } from './InvestigationModeTabs'
import {
  MissionClusterProvider,
  useMissionCluster,
  type InvestigationMode,
} from './MissionClusterContext'
import { RedeployModal } from './RedeployModal'
import { WorkflowNodeDetailModal } from './WorkflowNodeDetailModal'

const INVESTIGATION_REGION_LABEL: Record<InvestigationMode, string> = {
  blast: 'Blast radius service graph',
  workflow: 'Workflow architecture',
  edges: 'Live traffic between services',
}

function MissionControlBody() {
  const { investigationMode } = useMissionCluster()

  return (
    <div className="mission-root">
      <div className="app-window">
        <TrustOpsHeader />

        <div className="app-body">
          <AppSidebar />

          <main className="content-area">
            <ContentHeader />

            <div className="workspace">
              <div className="workspace-main">
                <div
                  className="investigation-viewport mc-scroll"
                  role="region"
                  aria-label={INVESTIGATION_REGION_LABEL[investigationMode]}
                >
                  {investigationMode === 'blast' ? <BlastRadiusGraph /> : null}
                  {investigationMode === 'workflow' ? <GraphCanvas /> : null}
                  {investigationMode === 'edges' ? <EdgeTrafficView /> : null}
                </div>
              </div>
              <AgentForcePanel />
            </div>
          </main>
        </div>
      </div>

      <WorkflowNodeDetailModal />
      <RedeployModal />
    </div>
  )
}

export function MissionControlPage() {
  return (
    <MissionClusterProvider>
      <MissionControlBody />
    </MissionClusterProvider>
  )
}
