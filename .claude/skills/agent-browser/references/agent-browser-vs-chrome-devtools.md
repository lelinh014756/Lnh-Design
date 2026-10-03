# Browser automation comparison

Choose among MCP browser tools, skill `chrome-devtools-scripts` (Puppeteer scripts), and `agent-browser`.

**Naming:** MCP `chrome-devtools` (Claude Code) / `user-chrome-devtools` (Cursor) ≠ skill `chrome-devtools-scripts` (Puppeteer scripts).

## Feature Comparison

| Feature | Browser MCP | skill chrome-devtools-scripts | agent-browser |
|---------|-------------|----------------------|---------------|
| **Engine** | chrome-devtools-mcp / host CDP | Puppeteer | Playwright (via Rust CLI) |
| **Loaded cost** | Tool defs in every session when configured | 0 until scripts run | CLI / skill activation |
| **Refs system** | Snapshot / uid (host-dependent) | `[ref=e1]` YAML | `@e1` inline |
| **Session persistence** | Host / browser tab | `.browser-session.json` | Named sessions (`--session`) |
| **Screenshot** | Host `take_screenshot` | **Removed** (no `screenshot.js`) | Basic |
| **Network** | list / get request tools | `network.js` | `route` (no full console/network dump parity) |
| **Console** | list_console_messages | `console.js` with filters | Basic — **no direct equivalent** to filtered `console.js` |
| **WebSocket debug** | Limited | Full frames (`ws-full-debug.js`) | Limited |
| **Auth injection** | Limited / none for cookies+profile | `inject-auth.js`, profile, `--wait-for-login` | `state save/load` |
| **Video recording** | Usually none | Not available | Built-in `record` |
| **Multi-tab** | Often yes | Limited | Full support |
| **Cloud browsers** | Host-dependent | Manual | Browserbase native |
| **Custom scripts** | None | 20+ utilities + tmp scripts | CLI only |

## Token Efficiency Benchmarks

| Metric | agent-browser | skill chrome-devtools-scripts | Playwright MCP (ref) |
|--------|---------------|----------------------|----------------------|
| Homepage snapshot | ~280 chars | ~300-500 chars | ~8,247 chars |
| Context reduction | 93% vs MCP | 90% vs MCP | Baseline |
| Tool definitions | ~2K tokens | 0 (CLI scripts) | ~17K tokens |

**Conclusion:** Scripts and agent-browser stay cheap when MCP is absent. A loaded browser MCP trades tool-definition cost for zero script setup — use it when already in the session; do not add MCP only for one probe.

## Use Case Decision Tree

```
Need browser automation?
|
+-- Source of truth enough (Grep/Read)?
|   +-- YES --> stop (no browser)
|   +-- NO --> Continue
|
+-- Browser MCP already in session tool list?
|   (Claude: MCP chrome-devtools | Cursor: user-chrome-devtools)
|   +-- YES --> use MCP for navigate / evaluate / console / network
|   |         (take_screenshot only if visual proof required)
|   +-- NO --> Continue
|
+-- Need skill chrome-devtools-scripts niche?
|   (WS full frames, cookie/token inject, Chrome profile 2FA/SSO,
|    repeatable Puppeteer scripts)
|   +-- YES --> skill chrome-devtools-scripts (Puppeteer scripts)
|   +-- NO --> Continue
|
+-- Video / multi-tab / Browserbase / long autonomous session?
|   +-- YES --> agent-browser
|   +-- NO --> skill chrome-devtools-scripts scripts (default without MCP)
```

## Parallel Usage Patterns

```powershell
# Niche / no MCP: evaluate via skill
node "$env:SKILL_DIR/evaluate.js" --script "({ href: location.href, title: document.title })"

# Long autonomous session -> agent-browser
agent-browser --session test1 open https://example.com
agent-browser snapshot -i
agent-browser close
```

## Migration Guide

### From skill chrome-devtools-scripts to agent-browser

| skill chrome-devtools-scripts | agent-browser |
|-----------------------|---------------|
| `node navigate.js --url X` | `agent-browser open X` |
| `node aria-snapshot.js --url X` | `agent-browser open X && agent-browser snapshot -i` |
| `node select-ref.js --ref e5 --action click` | `agent-browser click @e5` |
| `node fill.js --selector "#email" --value "X"` | `agent-browser fill @e1 "X"` |
| `node console.js --types error` | No direct equivalent |
| `node network.js` | No direct equivalent |

### Key Differences

1. **Refs format:** `[ref=e5]` vs `@e5`
2. **Session:** File-based vs named sessions
3. **Commands:** Node scripts vs CLI commands
4. **Output:** JSON always vs JSON with `--json` flag

## When to Switch

**Use browser MCP when:** already loaded in this session and the task is navigate / evaluate / console / network (screenshot only if visual proof).

**Use skill chrome-devtools-scripts when:**
- No browser MCP in the session tool list
- Need WebSocket full-frame debugging
- Need cookie/token injection, Chrome profile, or `--wait-for-login`
- Need custom Puppeteer scripts

**Use agent-browser when:**
- Long-running autonomous automation
- Need video recording or PNG screenshots without MCP
- Cloud browsers (Browserbase)
- Multi-tab workflows
