# Cache Tiers Reference

Source: `src/lib/query/query-client.ts`

## Định nghĩa

```typescript
export const CACHE_DURATIONS = {
  LOOKUP:  { staleTime: Infinity,         gcTime: 1000 * 60 * 60 * 24 },
  USER_DATA: { staleTime: 1000 * 60 * 5,  gcTime: 1000 * 60 * 30 },
  DASHBOARD: { staleTime: 1000 * 30,      gcTime: 1000 * 60 * 10 },
} as const;
```

## Áp dụng

| Tier | staleTime | gcTime | Use case |
|------|-----------|--------|----------|
| `LOOKUP` | ∞ | 24h | Catalogs, combobox data (investors, provinces, projects list) — ít thay đổi |
| `USER_DATA` | 5min | 30min | Owned data, lists with filters, detail pages |
| `DASHBOARD` | 30s | 10min | Metrics, real-time stats |
| `LIST_QUERY_DEFAULTS` | 30min | 10min | Paginated lists với `keepPreviousData` |
| default (QueryClient) | 5min | 10min | Fallback khi không specify |

## Detection Patterns trong code

```typescript
// LOOKUP tier
export const lookupQueryDefaults = {
  ...CACHE_DURATIONS.LOOKUP,
  meta: { persist: true },
} as const;

useQuery({
  queryKey: [...],
  queryFn: ...,
  ...lookupQueryDefaults,
});

// USER_DATA tier
useQuery({
  queryKey: [...],
  queryFn: ...,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
});

// LIST_QUERY_DEFAULTS
useQuery({
  queryKey: [...],
  queryFn: ...,
  staleTime: 30 * 60 * 1000,
  ...LIST_QUERY_DEFAULTS,
});
```

## Khi nào dùng tier nào?

- **Combobox/select options** → LOOKUP (load 1 lần, dùng mãi)
- **Project/Property detail** → USER_DATA (có thể stale sau 5min, refetch khi cần)
- **Dashboard widgets** → DASHBOARD (cần fresh data)
- **Paginated tables** → LIST_QUERY_DEFAULTS (giữ data cũ khi fetch page mới)

## Lưu ý cho Cache Invalidation

- LOOKUP tier `staleTime: Infinity` → KHÔNG tự refetch, phải `invalidateQueries` thủ công
- USER_DATA tier → refetch khi `refetchOnWindowFocus` hoặc sau staleTime
- Mutation nào thay đổi lookup data → PHẢI invalidate `["lookup", ...]` key
