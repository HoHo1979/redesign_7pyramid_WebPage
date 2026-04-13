# Agent Skills Locations

This file tracks the source locations of the skills copied to this folder and provides instructions for synchronizing them across different machines.

**Central Repository:** `https://github.com/HoHo1979/AgentSkills.git`

---

## Synchronization & Update Guide

### 1. Setup on a New Machine
To get started on a different computer, clone the central repository:
```bash
git clone https://github.com/HoHo1979/AgentSkills.git
cd AgentSkills
```

### 2. Pulling Skills (Remote to Local)
To install or update skills from this repository into your local LLM directories:

- **Claude:** `cp -r ClaudeSkills/* ~/.claude/skills/`
- **Gemini:** `cp -r GeminiSkills/* ~/.gemini/antigravity/skills/`
- **ChatGPT/OpenClaw:** `cp -r ChatGPTSkills/* ~/.openclaw/workspace/skills/`
- **Copilot:** (Locate your active version's `builtin-skills` directory first)
  `cp -r CopilotSkills/* <path_to_builtin_skills>/`

### 3. Pushing Skills (Local to Remote)
If you have created or updated skills locally and want to push them to the central repository:

1. **Sync from Local to Repo Folder:**
   ```bash
   # Example for Claude
   cp -r ~/.claude/skills/<new-skill-name> ClaudeSkills/
   ```
2. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Add/Update skill: <skill-name>"
   git push origin main
   ```

---

## Claude Skills
- **Source:** `/Users/homacmini/.claude/skills/`
- **Destination:** `/Volumes/Expansion/AgentSkills/ClaudeSkills/`
- **Installation Status:** [All Installed]
- **Skills:**
  - adapt
  - animate
  - arrange
  - audit
  - bolder
  - clarify
  - colorize
  - critique
  - delight
  - distill
  - docs
  - enhance-seo-geo
  - extract
  - find-seo-geo
  - find-skills
  - firebase-ai-logic
  - firebase-app-hosting-basics
  - firebase-auth-basics
  - firebase-basics
  - firebase-data-connect
  - firebase-firestore-basics
  - firebase-hosting-basics
  - flutter-animation
  - flutter-architecture
  - flutter-environment-setup-linux
  - flutter-environment-setup-macos
  - flutter-environment-setup-windows
  - flutter-layout
  - flutter-routing-and-navigation
  - flutter-theming
  - frontend-design
  - harden
  - implementation-seo-geo
  - migrate-riverpod3
  - normalize
  - onboard
  - optimize
  - overdrive
  - pdfs
  - polish
  - quieter
  - spreadsheets
  - suno-song-creator
  - teach-impeccable
  - typeset
  - webapp-testing

## Gemini Skills
- **Source:** `/Users/homacmini/.gemini/antigravity/skills/`
- **Destination:** `/Volumes/Expansion/AgentSkills/GeminiSkills/`
- **Installation Status:** [All Installed]
- **Skills:**
  - design-md
  - enhance-prompt
  - enhance-seo-geo
  - find-skills
  - firebase-ai-logic
  - firebase-app-hosting-basics
  - firebase-auth-basics
  - firebase-basics
  - firebase-data-connect
  - firebase-firestore-basics
  - firebase-hosting-basics
  - react-components
  - remotion
  - shadcn-ui
  - stitch-loop

## Copilot Skills
- **Source (homacmini):** `/Users/homacmini/.copilot/pkg/universal/1.0.24/builtin-skills/`
- **Source (james):** `/Users/james/.copilot/pkg/universal/1.0.21/builtin-skills/`
- **Destination:** `/Volumes/Expansion/AgentSkills/CopilotSkills/`
- **Installation Status:** [All Installed]
- **Skills:**
  - customize-cloud-agent

## ChatGPT / OpenAI Skills
- **Source (homacmini):** `/Users/homacmini/.openclaw/workspace/skills/`
- **Source (james):** `/Users/james/.openclaw/workspace/skills/`
- **Destination:** `/Volumes/Expansion/AgentSkills/ChatGPTSkills/`
- **Note:** ChatGPT skills are primarily cloud-based. Local skills found are related to the OpenClaw/OpenAI integration and custom workspace agents.
- **Installation Status:** [All Installed]
- **Skills:**
  - agent-bridge-messenger
  - card-name-overlay
  - dist
  - gemini-ask
  - image-send-line
  - lisa-au-software-sales
  - qiming-inventory
  - rxai-blog
  - SECURITY_AGENT (in `ChatGPTSkills/SECURITY_AGENT.md`)
