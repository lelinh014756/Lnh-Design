# Frontend Verification

Verify frontend implementations using a **browser MCP if already loaded in the session**, or skill `chrome-devtools-scripts` (Puppeteer scripts) as fallback. Prefer DOM/console over PNG screenshots.

## Applicability Check

**Skip entirely if task is NOT frontend-related.** Frontend indicators:
- Files modified: `*.tsx`, `*.jsx`, `*.vue`, `*.svelte`, `*.html`, `*.css`, `*.scss`
- Changes to: components, layouts, pages, styles, DOM structure, UI behavior
- Keywords: render, display, layout, responsive, animation, visual, UI, UX

If none match, skip this technique.

## Step 1: Detect Browser MCP Availability

Check the **session tool list only** — never `npx`-probe:

- Claude Code: MCP server named `chrome-devtools` (tools already registered)
- Cursor: namespace `user-chrome-devtools`

Do not confuse MCP `chrome-devtools` with skill `chrome-devtools-scripts` (Puppeteer scripts).

**Available** → Proceed to Step 2A (browser MCP)
**Not available** → Proceed to Step 2B (skill scripts fallback)

## Step 2A: Browser MCP Available — Direct Verification

Use the loaded MCP tools to verify the implementation. Ensure the dev server is running first. Apply runtime preflight: target URL matches intent, not `about:blank`, page title/snapshot sane.

### Navigate & Inspect

1. Navigate → `http://localhost:3000` (or project dev URL)
2. `take_snapshot` / evaluate — confirm structure and key text
3. `list_console_messages` (errors) and network tools as needed
4. `take_screenshot` **only** if layout/CSS visual proof is required

### Verification Checklist

1. **Content** — Text, data rendered as expected (snapshot / evaluate)
2. **Interactions** — Click / type via MCP when needed
3. **Console errors** — Prefer list_console_messages
4. **Layout** — Only if visual; then MCP screenshot

## Step 2B: Browser MCP NOT Available — Fallback to skill `chrome-devtools-scripts`

```powershell
if (Test-Path ".claude/skills/chrome-devtools-scripts/scripts") {
  $env:SKILL_DIR = ".claude/skills/chrome-devtools-scripts/scripts"
} elseif (Test-Path "$HOME/.claude/skills/chrome-devtools-scripts/scripts") {
  $env:SKILL_DIR = "$HOME/.claude/skills/chrome-devtools-scripts/scripts"
}

npm install --prefix $env:SKILL_DIR 2>$null

node "$env:SKILL_DIR/navigate.js" --url http://localhost:3000
node "$env:SKILL_DIR/evaluate.js" --script "({ href: location.href, title: document.title })"
node "$env:SKILL_DIR/console.js" --url http://localhost:3000 --types error,pageerror --duration 5000
```

```bash
SKILL_DIR=".claude/skills/chrome-devtools-scripts/scripts"
[ -d "$SKILL_DIR" ] || SKILL_DIR="$HOME/.claude/skills/chrome-devtools-scripts/scripts"
npm install --prefix "$SKILL_DIR" 2>/dev/null
node "$SKILL_DIR/navigate.js" --url http://localhost:3000
node "$SKILL_DIR/evaluate.js" --script "({ href: location.href, title: document.title })"
node "$SKILL_DIR/console.js" --url http://localhost:3000 --types error,pageerror --duration 5000
```

This skill has **no** `screenshot.js`. If PNG proof is required and MCP is unavailable, note the gap or use `agent-browser screenshot`.

If the skill is also unavailable, skip verification and note:
> "Frontend verification skipped — no browser MCP or chrome-devtools-scripts skill available."

## Step 3: Analyze Results

1. **Check evaluate / snapshot** — URL, title, key DOM
2. **Check console** — Zero errors = pass
3. **Compare with expected** — Match specs or user description
4. **Document findings** in the verification report

## Integration with Verification Protocol

```
Standard verification → Tests pass → Build succeeds → Frontend verification → Claim complete
```

Report format:
```
## Frontend Verification
- Method: [browser MCP | chrome-devtools-scripts | skipped]
- URL / title: ...
- Console errors: [none | list]
- DOM check: [pass | issues found]
- Visual (MCP screenshot): [n/a | pass | issues]
```
