# Output Template Structure

Markdown template cho file `plans/reports/api-map-{date}-{module}.md`.

## Template

```markdown
# API Map — Module {module}

> Auto-generated bởi skill `/api-map`. KHÔNG edit tay — regenerate bằng `/api-map {module}`.
> Generated: {YYYY-MM-DD} | Scope: `src/modules/{module}`

## Tổng quan

| Màn hình / Route | Tích hợp API | Mock | Ghi chú |
|------------------|:---:|:---:|---------|
| {screen name} | ✅ | — | |
| {screen name} | 🔄 | ✅ | Có factory switch mock/api |

Legend: ✅ API thật | 🔄 mock/api switchable qua factory | 🧪 mock-only

---

## 1. {Screen Name}

{Description ngắn}

### APIs fire on mount ({count} calls)

| # | Hook | Endpoint | Cache | Ghi chú |
|---|------|----------|-------|---------|
| 1 | `useHook()` | `GET /endpoint` | LOOKUP | description |

### UI actions (nếu có)

| Trigger | Hook | Endpoint | Invalidate | Ghi chú |
|---------|------|----------|------------|---------|
| Submit form | `useMutation()` | `POST /endpoint` | `["module"]` | |

---

## Reverse Index — Endpoint → Screens

| Endpoint | Hooks | Screens dùng |
|----------|-------|--------------|
| `GET /endpoint` | `useHook` | screen 1, screen 2 |

---

## Invalidate Flow Map

```
useMutation1 ────┐
useMutation2 ────┤
useMutation3 ────┤──► invalidate ["module"] (all)
                  └─► triggers refetch list + detail + lookup
```

---

## Cache Tiers Reference

| Tier | staleTime | gcTime | Áp dụng |
|------|-----------|--------|---------|
| `LOOKUP` | ∞ | 24h | list of endpoints |
| `USER_DATA` | 5min | 30min | list of endpoints |
```

## Section Ordering Rules

1. **Tổng quan** — luôn đầu tiên, scan tất cả screens
2. **Per-screen sections** — sort theo:
   - List page (`*-list-screen.tsx`) trước
   - Detail sheets (`*-sheet.tsx`) sau
   - Sub-screens (tab, dialog) cuối
3. **Reverse Index** — sort theo HTTP verb (GET → POST → PUT → PATCH → DELETE)
4. **Invalidate Flow** — group theo mutation namespace
5. **Cache Tiers** — sort theo staleTime (∞ → 30min → 5min → default)

## Per-Screen Section Content

| Field | Source |
|-------|--------|
| Screen name | File name without extension (vd: `create-sheet.tsx` → "Create Sheet") |
| Hooks fire on mount | Grep `useQuery\|useMutation\|use[A-Z]\w+Query` trong file |
| Cache tier | Từ hook definition (LOOKUP/USER_DATA/default) |
| Lazy flag | `enabled:` clause trong useQuery |
| UI actions | Từ hooks có `useMutation` |

## Notes Best Practices

- **Lazy load flag:** ghi rõ điều kiện (vd: "chỉ khi provinceId != null")
- **Cache tier:** luôn kèm staleTime/gcTime values trong ghi chú
- **Endpoints:** dùng backtick để wrap URL
- **Invalidate keys:** ghi rõ query key pattern bị invalidate
