# Project Roadmap: Demo-BE
_Last updated: 2026-10-12_

## Phase Status

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | Core Platform | ✅ Done | 100% |
| 1 — P1.1 | MVP Auth | ✅ Done | 100% | Production 2026-09-29 |
| 1 — P1.2 | Audit Log | 🔄 In progress | |
| 2 | Reporting (W5–W8) | 📋 Planning | 0% |

## Phase 1 — Core Platform (W1–W4) ✅

### P1.1: Auth ✅ Done (Production 2026-09-29)
> ⚠️ **Breaking Change (2026-10-01):** token cũ không còn hiệu lực (commit `15fa772`).
- [x] Login JWT
- [x] Role engine
- [ ] SSO (deferred to Phase 2+)

### P1.2: Audit Log 🔄
- [x] Hash chain engine
- [ ] Retention job

## Phase 2 — Reporting (W5–W8) 📋

### P2.1: Monthly report 🔜 Planning
- [ ] Report template
- [ ] Export PDF

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Role cache stale after reassign | High | Fixed c611e2b |
