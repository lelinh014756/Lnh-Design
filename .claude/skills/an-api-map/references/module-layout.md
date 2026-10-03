# Module Layout — `src/modules/<name>/`

Convention chuẩn của module trong Landsoft-One-Web. Script scan dựa vào cấu trúc này.

## Cấu trúc thư mục

```
src/modules/<name>/
├── components/         # UI components (sheet, tab, panel, screen)
│   ├── <subdomain>/    # vd: project/, project-forms/, project-staff/
│   └── *.tsx           # shared components
├── hooks/              # React Query hooks
│   ├── use-<entity>-query.ts
│   └── use-<entity>-list-state.ts
├── services/           # API/Mock adapters + factories
│   ├── <entity>-api-adapter.ts      # API thật
│   ├── <entity>-mock-adapter.ts     # Mock data
│   ├── <entity>-service-factory.ts  # Factory switch mock/api
│   └── <entity>-service.ts          # Public service interface
├── lib/                # Mappers, validators, utilities
├── types/              # TypeScript types + DTOs
├── mock/               # Mock data files
├── constants/          # Constants + enums
└── utils/              # Formatters + helpers
```

## Detection Patterns

### API Adapter (`services/*-api-adapter.ts`)

```typescript
import { axiosClient } from "@/lib/api/axios-client";

export const projectsApiAdapter = {
  list: async (params) => {
    const response = await axiosClient.post("/projects/search", params);
    return handleApiOK(response);
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return handleApiOK(response);
  },
  // ...
};
```

**Extract:** method name, HTTP verb, URL path

### Service Factory (`services/*-service-factory.ts`)

```typescript
export function getProjectsService() {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return projectsMockAdapter;
  }
  return projectsApiAdapter;
}
```

**Flag:** `🔄 mock/api switchable`

### React Query Hooks (`hooks/use-*-query.ts`)

```typescript
export const projectsKeys = {
  all: ["projects"] as const,
  list: (params) => [...projectsKeys.all, "list", params] as const,
  detail: (id) => [...projectsKeys.all, "detail", id] as const,
};

export function useProjectsList(params) {
  return useQuery({
    queryKey: projectsKeys.list(params),
    queryFn: () => projectsService.list(params),
    staleTime: ...,
  });
}
```

**Extract:** queryKey pattern, queryFn target, staleTime/gcTime

### Cache Tiers

| Tier | Pattern trong code |
|------|--------------------|
| LOOKUP | `...CACHE_DURATIONS.LOOKUP` hoặc `...lookupQueryDefaults` |
| USER_DATA | `CACHE_DURATIONS.USER_DATA` hoặc `staleTime: 1000 * 60 * 5` |
| LIST_QUERY_DEFAULTS | `...LIST_QUERY_DEFAULTS` |
| default | không có staleTime/gcTime explicit |

### Screen Components (`components/**/*.tsx`)

| Pattern | Loại |
|---------|------|
| `*-sheet.tsx` | Sheet/modal |
| `*-tab.tsx` | Tab content |
| `*-panel.tsx` | Panel/inspector |
| `*-screen.tsx` | Full page |
| `*-dialog.tsx` | Dialog |

**Extract:** tên file, hooks được gọi trong file (regex `use\w+\(`)

## Limitations

- Script dùng regex, không phải AST parser
- Edge cases cần manual review:
  - Hooks gọi qua wrapper custom
  - Lazy load qua `enabled` flag phức tạp
  - Dynamic query keys (computed trong function)
- Nếu script miss gì → grep manual bằng `rg` + check output
