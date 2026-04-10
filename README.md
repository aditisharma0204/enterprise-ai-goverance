# TrustOps — Enterprise AI Governance

A command-center UI for monitoring, governing, and remediating AI agent clusters in production. Built for IT director-level operators managing enterprise AI deployments.

**Live demo:** [trustops-enterprise-ai-gov-5c102193b1cd.herokuapp.com](https://trustops-enterprise-ai-gov-5c102193b1cd.herokuapp.com/)

## What it does

TrustOps provides real-time observability across a fleet of AI agents deployed in production. The demo scenario walks through an incident where an Order Processing Agent breaches its domain policy, and an operator uses the **Agentforce** conversational panel to triage, remediate, and redeploy.

### Key screens

- **Global View** — North America map with 22 agent cluster markers. Zoom into the United States to see hub topology, routers, and individual agents. Click **Agent Cluster 7** to open the cluster modal.
- **Agent Cluster Modal** — Lists all agents in a cluster with health status. Critical agents link directly into Mission Control.
- **Mission Control** — Service dependency graph showing the blast radius of a failing agent, with live session counts and token rates. The graph visually reacts to each step of the Agentforce conversation.
- **Agentforce Panel** — Conversational interface for human-in-the-loop intervention: stop traffic, retrain, redeploy. Typing animations, thinking indicators, and policy breach tooltips.

### Interaction flow

1. Agentforce surfaces a policy breach on Order Processing Agent (3 warnings/min)
2. Operator asks "What are my options?" — three remediation steps presented
3. "Stop all traffic" — graph dims the agent node, edges fade, sessions drop
4. "Retrain" — Evaluator Agent pulses blue as data flows, then turns green on success
5. "Launch it" — agent reactivates, all edges turn green, incident resolved

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Vanilla CSS with custom properties (dark theme) |
| Hosting | Heroku (Node.js buildpack + `serve`) |

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Serve production build locally
npm start
```

Requires Node.js 20.x.

## Project structure

```
src/
  components/
    global-view/       # Global map, topology, telemetry panels, cluster modal
    mission-control/   # Service graph, Agentforce panel, workflow, edge traffic
    icons/             # SVG icon components
    shell/             # App header, navigation chrome
  constants/           # Route definitions
  context/             # Global state (NaCluster7Context)
  data/                # Cluster markers, alert seed data
  hooks/               # Shared hooks
  globalView.css       # Global view styles
  missionControl.css   # Mission control styles
  dark-theme.css       # Design tokens
```

## Deployment

The app deploys to Heroku via git push:

```bash
git push heroku main
```

Heroku runs `heroku-postbuild` (which calls `npm run build`), then serves the static `dist/` folder via the `serve` package.
