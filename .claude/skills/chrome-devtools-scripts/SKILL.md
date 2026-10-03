---
name: chrome-devtools-scripts
description: >-
  Puppeteer CLI scripts with persistent sessions (JSON output). Use when no browser
  MCP is available in the session, or for WebSocket full-frame debug, cookie/token
  bulk injection, Chrome-profile reuse with 2FA/SSO, or repeatable scripted flows.
  Not for source-only bugs; not when a browser MCP already covers
  navigate/evaluate/console/network. Distinct from MCP server chrome-devtools /
  Cursor user-chrome-devtools. No screenshot script — use MCP take_screenshot or
  evaluate/snapshot for verification.
license: Apache-2.0
argument-hint: "[url or task]"
metadata:
  version: "1.3.0"
---

# Chrome DevTools Scripts (Puppeteer)

Browser automation via Puppeteer scripts. All scripts output JSON. Naming: **skill `chrome-devtools-scripts`** — never confuse with MCP `chrome-devtools` / Cursor `user-chrome-devtools`.

## Runtime selection

1. **Source first** — Grep route/component anchor, then `Read(offset, limit)`.
2. **Browser MCP if already loaded** — check the session tool list (Claude Code: MCP `chrome-devtools`; Cursor: `user-chrome-devtools`). Never `npx`-probe to discover MCP.
3. **Else these scripts** — `navigate.js` → `evaluate.js` (curated) → `console.js` / `network.js`.
4. **`agent-browser`** — long autonomous sessions, video, multi-tab, or Browserbase only.
5. **Escape hatch** — custom Puppeteer under `.claude/chrome-devtools/tmp/` for WS frames, CDP domains, bulk auth.

Visual proof (rare): use MCP `take_screenshot` when MCP is loaded — this skill does **not** ship `screenshot.js`.

## Skill location

Skills: **project-scope > user-scope**. Detect once per session:

```powershell
# Windows / PowerShell (canonical)
if (Test-Path ".claude/skills/chrome-devtools-scripts/scripts") {
  $env:SKILL_DIR = ".claude/skills/chrome-devtools-scripts/scripts"
} elseif (Test-Path "$HOME/.claude/skills/chrome-devtools-scripts/scripts") {
  $env:SKILL_DIR = "$HOME/.claude/skills/chrome-devtools-scripts/scripts"
}
# Run: node "$env:SKILL_DIR/navigate.js" --url ...
```

```bash
# bash / WSL / macOS
SKILL_DIR=""
if [ -d ".claude/skills/chrome-devtools-scripts/scripts" ]; then
  SKILL_DIR=".claude/skills/chrome-devtools-scripts/scripts"
elif [ -d "$HOME/.claude/skills/chrome-devtools-scripts/scripts" ]; then
  SKILL_DIR="$HOME/.claude/skills/chrome-devtools-scripts/scripts"
fi
```

## Choosing your approach

| Scenario | Approach |
|----------|----------|
| Source-available sites | Read source first; write selectors directly |
| Unknown layouts | `aria-snapshot.js` for semantic discovery |
| Visual inspection | MCP `take_screenshot` if loaded; else `evaluate.js` / `aria-snapshot.js` |
| Debug issues | `console.js` / `network.js` + session storage |
| Auth-gated pages | See [authentication.md](./references/authentication.md) |

## Headed vs headless

Resolved by `resolveHeadless()` in `lib/browser.js`:

| Environment | Default |
|-------------|---------|
| macOS / Windows | Headed |
| Linux / WSL | Headless |
| CI (`CI`, `GITHUB_ACTIONS`, …) | Headless |

Override: `--headless true|false`.

## Quick start

```powershell
npm install --prefix $env:SKILL_DIR
node "$env:SKILL_DIR/navigate.js" --url https://example.com
# {"success": true, "url": "...", "title": "..."}
```

**Linux/WSL only:** run `"$SKILL_DIR/install-deps.sh"` first for Chrome system libs.

**Never** browse via `file://` — serve over HTTP first.

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
npx serve ./dist -p 3000
node "$env:SKILL_DIR/navigate.js" --url http://localhost:3000
```

## Session persistence

State persists via `.browser-session.json`. Scripts disconnect but keep the browser running unless `--close true`.

```powershell
node "$env:SKILL_DIR/navigate.js" --url https://example.com/login
node "$env:SKILL_DIR/fill.js" --selector "#email" --value "user@example.com"
node "$env:SKILL_DIR/click.js" --selector "button[type=submit]"
node "$env:SKILL_DIR/navigate.js" --url about:blank --close true
```

## Available scripts

Under `.claude/skills/chrome-devtools-scripts/scripts/`:

| Script | Purpose |
|--------|---------|
| `navigate.js` | Navigate / session close |
| `evaluate.js` | JS in page context |
| `console.js` / `network.js` | Console + HTTP capture |
| `click.js` / `fill.js` | Interactions |
| `snapshot.js` / `aria-snapshot.js` / `select-ref.js` | Discovery + ref actions |
| `performance.js` | Core Web Vitals |
| `ws-debug.js` / `ws-full-debug.js` | WebSocket (full frames) |
| `inject-auth.js` / `import-cookies.js` / `connect-chrome.js` | Auth / attach |

## Probe ladder (scripts path)

Same order as `.claude/rules/execution-policy.md` when MCP is absent:

1. `navigate.js`
2. `evaluate.js` — small curated payload
3. `console.js` / `network.js` when runtime hypothesis exists
4. `performance.js` / `aria-snapshot.js` / `snapshot.js` — specialized only

**Do not** chain all probe types for a normal UI question. Fail fast on `about:blank`, wrong URL, or detached session.

## Outputs

Store under `<project>/.claude/chrome-devtools/` (artifact dir — not the skill folder):

| Kind | Path |
|------|------|
| Snapshots | `.claude/chrome-devtools/snapshots/` |
| Logs | `.claude/chrome-devtools/logs/<session>/` |
| Custom scripts | `.claude/chrome-devtools/tmp/` |

```powershell
$session = Get-Date -Format "yyyyMMdd-HHmmss"
New-Item -ItemType Directory -Force -Path ".claude/chrome-devtools/logs/$session" | Out-Null

node "$env:SKILL_DIR/console.js" --url https://example.com --types error --duration 5000 `
  | Set-Content ".claude/chrome-devtools/logs/$session/console.json"
```

Root-cause patterns:

```powershell
node "$env:SKILL_DIR/console.js" --url https://example.com --types error,pageerror --duration 5000
node "$env:SKILL_DIR/network.js" --url https://example.com
```

## Authentication (summary)

| Method | Best for |
|--------|----------|
| `inject-auth.js` | Session cookies / Bearer tokens |
| `import-cookies.js` | Multi-cookie export from extension |
| `--use-default-profile` | 2FA / SSO / complex OAuth |
| `connect-chrome.js` | Attach to remote-debugging Chrome |
| `--wait-for-login` | Interactive OAuth/SSO in headed browser |

Canonical examples: [references/authentication.md](./references/authentication.md).

```powershell
node "$env:SKILL_DIR/inject-auth.js" --url https://site.com `
  --cookies '[{"name":"session","value":"abc123","domain":".site.com"}]'
node "$env:SKILL_DIR/navigate.js" --url https://site.com/dashboard
```

## Custom scripts

Write under `.claude/chrome-devtools/tmp/` (project root), importing from the skill `scripts/lib/`:

```powershell
New-Item -ItemType Directory -Force -Path .claude/chrome-devtools/tmp | Out-Null
```

## Reference

- `./references/authentication.md` — five auth methods
- `./references/cdp-domains.md` — CDP domains
- `./references/puppeteer-reference.md` — Puppeteer patterns
- `./references/performance-guide.md` — Core Web Vitals
- `./scripts/README.md` — per-script flags
