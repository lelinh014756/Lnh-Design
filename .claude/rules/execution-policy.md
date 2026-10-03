# Execution Policy

Tool/skill activation, token budget, code quality standards. **Activate only when materially changes outcome.**

## Skill Activation

**Principle:** Don't activate for completeness or ritual.

**Rule precedence:** `CLAUDE.md` = repo guardrails; `.claude/rules/*` = canonical policy. More specific wins. Negative rules win over generic recommendations.

| Task Shape | Activate | Conditionally | Skip |
|------------|----------|---------------|------|
| Component/page UI | `ui-builder` | `ui-styling` (shadcn), `frontend-design` (mockup) | `project-organization`, `bootstrap` |
| State/data logic | `ui-builder` | `react-best-practices` (perf), `docs-seeker` (external API), MCP `chrome-devtools` (runtime inspect) | `ui-styling` |
| Layout/navigation | `ui-builder` | `web-frameworks` (Next.js routing) | `project-organization` |
| Bug fix | *(none)* | MCP `chrome-devtools` (UI bug), `docs-seeker` (lib issue) | All others |
| Hotfix/trivial | *(none)* | — | All |

**Activation rules:**
- Code patterns change → `ui-builder`
- External library docs → `docs-seeker` (on-demand)
- UI from design/mockup → `frontend-design`
- Verify browser rendering → MCP `chrome-devtools` (default, project-registered); `chrome-devtools-scripts` only when MCP unavailable or special cases
- Default: **no extra skill** if task doesn't match matrix

**Negative rules:**
- No `brainstorm` for route-level UI audits, code explanation, scoped review without real decision branching
- No browser probe (MCP or scripts) if source code answers the question; no `chrome-devtools-scripts` while MCP `chrome-devtools` is loaded — outside the listed special cases
- No `docs-seeker` for internal codebase consistency; only external docs
- No stacking heavy skills unless next provides new capability

## Tool Preflight (Internal Gate)

Before each tool/skill call, silently verify:
- Current scope + blast radius?
- Source of truth for this task?
- Cheaper tool available? (`Grep` before `Read`, slice before full-file, source before browser)
- New capability or repeat workflow?
- Expected output larger than necessary?
- Fallback if tool fails/contradicts?

**Don't surface checklist to user.** Ask only for: missing/contradictory requirements, product/business decisions, destructive/hard-to-reverse/shared-state actions, explicit approval per safety rules.

## Token Budget

**Principle:** Optimize workflow before prose. Budgets below are soft guardrails by task shape, not strict gates.

| Task Shape | Tool Calls | Outputs >5KB | Full-file Reads | Heavy Skills |
|------------|-----------|--------------|-----------------|--------------|
| Quick Q&A, naming, narrow trade-off | 0-3 | 0 | 0 | 0 |
| Single-file fix or scoped read | 3-6 | 0-1 | Only if small or editing directly | 0 |
| Multi-file feature, UI audit, frontend bug needing runtime | 6-12 | 1 max, justified | Avoid; prefer slices | 1 max |
| Large feature, ambiguous bug, CI/CD, architecture, broad refactor | Per plan | Acceptable if output is source of truth | Acceptable, controlled | >1 in clear chain |

**Stop-loss rules:**
- After 2 probes: must have hypothesis or clear source of truth. If not, switch strategy vs continuing same branch
- Output >5KB needs explicit reason. If only for locate/summarize, wrong tool/payload chosen
- No full-read file >300 LOC without Grep anchor first, unless editing directly or sole source of truth
- No chain another tool if previous output contradicts itself (`about:blank`, blank screenshot, detached session, file doesn't match expected route)
- Browser verification: fail fast when runtime preflight untrustworthy (wrong URL, `about:blank`, detached, blocking runtime health issues like HMR/WebSocket failures)

## Browser Probe Ladder

**Principle:** Browser automation expensive. Use only when source code insufficient.

**Runtime preflight:** Before trusting browser output, verify from first probe: target URL matches intent, not `about:blank`, runtime health not contradicted by blocking console/network issues. Applies to MCP probes and scripts alike — do not skip preflight because the transport differs.

**Runtime selection (hard rule):** MCP `chrome-devtools` is the default browser runtime — project-registered in `.mcp.json`, so always loaded in this repo (Cursor: namespace `user-chrome-devtools`). Detect from the session tool list only — never `npx`-probe. Use skill `chrome-devtools-scripts` (Puppeteer scripts) only when:
1. MCP absent from tool list or failing
2. Special cases: WebSocket full-frame debug, cookie/token bulk injection, Chrome-profile reuse with 2FA/SSO, repeatable scripted flows

Do not confuse MCP `chrome-devtools` with skill `chrome-devtools-scripts`.

**Default order (MCP canonical):**
1. `Grep` route/component anchor
2. `Read(offset, limit)` slices
3. Navigate — MCP `navigate_page`
4. DOM/text probe — MCP `evaluate_script` with small, curated payload / `take_snapshot`
5. Console/network — MCP `list_console_messages` / `list_network_requests` once runtime hypothesis exists or health suspicious
6. Specialized audits only — MCP `performance_start_trace`, `lighthouse_audit`, `take_heapsnapshot`

**Scripts fallback mapping** (MCP unavailable only): `navigate.js` ↔ `navigate_page` · `evaluate.js` ↔ `evaluate_script` · `console.js`/`network.js` ↔ `list_console_messages`/`list_network_requests` · `aria-snapshot.js` ↔ `take_snapshot` · `performance.js` ↔ `performance_start_trace`. Skill has no `screenshot.js`.

**Do:**
- Curate `evaluate_script` payloads; pull only needed fields
- Normal UI verification: DOM/`evaluate_script` first → console/network
- Visual proof (rare): MCP `take_screenshot`
- Treat runtime health as evidence, not noise. If page/session health suspect, switch to diagnostics vs continuing interaction
- Stop when source of truth strong enough

**Don't:**
- Run `take_snapshot`, `evaluate_script`, performance trace together for normal UI question
- Prefer PNG screenshots over DOM/`evaluate_script` / console / network for ordinary UI questions
- Use `chrome-devtools-scripts` while MCP `chrome-devtools` is loaded (outside special cases)

## Package Integration

**Principle:** Adding package = 2 research steps, no deep dive.

1. **One** WebFetch on official docs (or `docs-seeker` once)
2. **One** narrow Grep to confirm exports/types needed
3. **Stop** — implement immediately

**Don't:**
- ❌ Spawn multiple researcher agents
- ❌ Scout package's full source
- ❌ Analyze third-party library architecture
- ❌ Dig into internals unless undocumented breaking behavior
- Follow codebase structure/standards in `./docs` during implementation
- No simulation/mocking; implement real call

## File Read Strategy

**3 Principles:**
1. **No re-read** unless edited or verifying state. Reuse context.
2. **Pass content to subagents.** They don't see session history; embed slice in prompt or they rediscover.
3. **Signature-first.** Read order: `type → export → import → signature → return → implementation`. Stop when enough.

**7-Step Flow:**
1. **Identify task shape** — bug fix / refactor / architecture review / flow tracing. Shape decides strategy.
2. **Repomix-map (only if repo unfamiliar)** — `analyze_project` → `grep_repomix_output` for tree, exports, entrypoints, module boundaries. Skip if know repo.
3. **Grep anchor** — symbol / route / config key / error message / function name. Grep returns line numbers + context, locates precisely without `Read`. If need discovery (don't know pattern), Glob folder, but prefer Grep.
4. **Read as little as possible** — `Read(offset, limit)` around Grep match. Prioritize signatures, imports, exports, types, return paths. No full-read for single section.
5. **Trace by flow** — `entrypoint → service → repo/db → external call`. Don't read by directory tree. Flow-based saves ~60-70% tokens vs directory-based.
6. **Confirm with tests** — read test/spec for function changing to understand expected behavior. Don't read entire test folder.
7. **Small patch → scoped verify** — change smallest region. Verify order: `typecheck > lint > test`. Typecheck catches issues fastest.

**Full-file Read guardrails:**
- Full-file `Read` right default only when: file small, editing directly, or sole source of truth
- For larger: Grep anchor → `Read(offset, limit)` each region → stop when signal enough
- If full-read but use <20% content to decide, workflow wasting tokens — back out

**Repomix navigation:**
- `grep_repomix_output("pattern")` → locate files/classes
- `read_repomix_output(lineRange)` → read specific sections
- `pack_codebase` → only when codebase has significant changes

**Don't:**
- ❌ `pack_codebase` over whole repo without grepping first
- ❌ Load full Repomix output — always limit by line range
- ❌ Pack files with secrets/credentials
- ❌ Commit temporary outputs

## State Boundary

Follow **ADR-001** (`docs/adr-001-state-boundary.md`):
- Server data → TanStack Query (`src/lib/query/`)
- Global UI state → Zustand (`src/store/`)
- Tree-scoped provider → React Context (`src/context/`)
- Module-scoped state → `src/modules/*/context/`
- Local state → `useState`/`useReducer`

**Rule:** If `XContext` and `XStore` both exist for the same domain → kill Context, use Store.

## Code Quality

**YAGNI — KISS — DRY**

**File standards:**
- **Naming**: kebab-case, meaningful, describes purpose. Long OK — LLM should understand purpose from name without reading content.
- **LOC limits**: components/hooks ≤500, pages/layouts/modules ≤700, config/generated ≤1000. Beyond → split by logical boundary.
- **Anti-overengineering**: avoid one-off abstractions/helpers. Extract only when ≥2-3 callers or repeated logic. No premature optimization.

**Code guidelines:**
- Read/follow codebase structure + code standards in `./docs` (`code-standards.md`, `system-architecture.md`, `design-guidelines.md`)
- No overly strict linting style, but **no syntax errors, code must compile**
- Prioritize functionality + readability over strict style enforcement
- Reasonable standards improving developer productivity
- `try/catch` error handling, follow security standards
- Delegate `code-reviewer` after meaningful implementation (see `workflow.md` → §4 for when to skip)

**Implementation:**
- Clean, readable, maintainable code
- Follow established architectural patterns (see `CLAUDE.md`, `docs/system-architecture.md`)
- Implement per specifications
- Handle edge cases, error scenarios
- No new "enhanced"/"v2" parallel files — update existing directly
- No simulation/mocking; ship real code (use `tester` for synthetic data, mark clearly)

### TypeScript Strict Mode

- Local dev phải chạy `pnpm tsc --noEmit` trước khi commit (CI/CD verify)
- Khi tạo interface/service: verify implementation match bằng cách assign cho type hoặc dùng `as InterfaceType` cast
- `catch (error)` phải cast trước khi truyền vào typed function:
  ```ts
  // ❌ error is unknown
  apiErrorMessage(error, fallback)
  // ✅ cast trước khi truyền
  apiErrorMessage(error as { error?: { message?: string } | null }, fallback)
  ```
- Mock service phải export đúng method names như interface. Dùng `as unknown as InterfaceType` khi interface và implementation không align (workaround tạm thời, ưu tiên fix interface)
- Khi build fail TypeScript → deploy bị block (Vercel build command phải include `pnpm tsc --noEmit`)

## i18n

- User-facing strings through dictionary in `@/lib/i18n` (VI/EN under `src/lib/i18n/dictionaries/`). No hardcoded Vietnamese/English when key exists for same concept.
- Locale state driven by `LocaleProvider` + `NEXT_LOCALE` cookie. `LanguageSwitcher` = canonical UI affordance.
- Add new copy: update both `vi` and `en` dictionaries in same change.

## Pre-commit/Push

- Run lint before commit (`pnpm lint`)
- Run tests before push when test infra present. **Don't ignore failing tests** to pass checks/CI
- Keep commits focused on actual code changes
- **No confidential data** (`.env`, API keys, DB credentials)
- Use Conventional Commits. Per `CLAUDE.md`, no `chore`/`docs` type for changes inside `.claude/`
- Clean, professional commit messages — no AI references

## Repo-Specific

- **Package manager**: **pnpm** (`pnpm-lock.yaml`). Don't mix npm/yarn.
- **Privacy hook (`@@PRIVACY_PROMPT@@`)**: when blocked, parse JSON between `@@PRIVACY_PROMPT_START@@` and `@@PRIVACY_PROMPT_END@@`, ask user via `AskUserQuestion`, proceed only on explicit approval. Full flow in `CLAUDE.md` → "Privacy block hook".
- **Plans gitignore**: don't commit inside `plans/` except `plans/templates/*`. Don't commit `.claude/session-state/`, `.claude/hooks/.logs/`, similar local-only agent state.
