# Agent & design workflow (Cursor)

This project includes the **[design-skills](https://github.com/ghaida/design-skills)** pack locally as **`design-skills-main/`**. Cursor loads **`/.cursor/rules/design-skills-team.mdc`** so the coding agent knows when to use those roles.

## Quick invoke

Say what you need in natural language, or name the role:

- **Strategist** — frame the problem, brief, hypotheses (`agent-01-strategist.md`)
- **Systems Architect** — blueprints, dependencies, failure modes (`agent-02-systems-architect.md`)
- **Flow Designer** — flows, navigation, interactions, type (`agent-03-flow-designer.md`)
- **Handoff Specialist** — specs, edge cases, QA-ish plans (`agent-04-handoff-specialist.md`)
- **Creative Director** — visual direction, tokens, design system (`agent-05-creative-director.md`)
- **Philosopher** — expansive mode, reframe, brainstorm (`agent-06-philosopher.md`)

Each agent has a deeper playbook in **`design-skills-main/skills/<role>/SKILL.md`**.

## Where to look

| Resource | Path |
|----------|------|
| When to use which agent | `design-skills-main/agents/HOW-TO-USE.md` |
| Agent prompts | `design-skills-main/agents/agent-0*.md` |
| Skill implementations | `design-skills-main/skills/*/SKILL.md` |
| Cursor rule (always on) | `.cursor/rules/design-skills-team.mdc` |

## This product

**Agentic Mission Control** — enterprise observability / governance UI (Vite, React, TypeScript). Prefer concrete ties to existing routes (`src/constants/routes.ts`), shells, and CSS token layers (`missionControl.css`, `globalView.css`, `dark-theme.css`) when design output touches implementation.

**Primary reviewer persona (v1):** IT director–level operator (e.g. retail enterprise context). Copy and hierarchy should read as **operational risk and governance**, not only low-level SRE jargon. **v1 layout:** desktop-first; `.mission-root` enforces a minimum width for review sessions.
