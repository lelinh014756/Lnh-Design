# Icon provider adapter — lucide ⇄ hugeicons

Mục tiêu: đổi thư viện icon bằng 1 dòng import trong `src/components/general/app-icon.tsx`.

## Quyết định (user xác nhận 2026-10-04)
- `src/components/ui/**` (shadcn) giữ lucide — không đi qua AppIcon, miễn ESLint.
- Icon browser showcase → duyệt `ICON_NAMES` qua provider đang active (bỏ `lucide-react/dynamic`).
- Làm hết, active provider = hugeicons. **2026-10-04 09:26: user yêu cầu đổi active về lucide** (hugeicons giữ làm dự phòng).
- Provider giữ đủ key (`satisfies Record<IconName, T>`) để đổi qua lại được.

## Phases
| # | Phase | Status |
|---|---|---|
| 1 | `icon-providers/` (names, contract, lucide, hugeicons) + rewrite `app-icon.tsx` | done |
| 2 | Migrate ~50 file non-ui sang `<AppIcon icon="..."/>`; `AppButton.icon`, `TableExcelActionRow.icon`, `RefreshButton.icon` → `IconName` | done |
| 3 | Icon browser → registry; docs props table + comment nhắc lucide; regen `sources.json` | done |
| 4 | ESLint `no-restricted-imports` (miễn `ui/**`, `icon-providers/**`) | done |
| 5 | Active hugeicons; `tsc` + lint + build; kiểm tra UI trên browser | done |

## Ghi chú kỹ thuật
- Hugeicons set `stroke-width` trên từng `<path>` → class `stroke-[n]` trên `<svg>` không còn tác dụng; dùng prop `strokeWidth`.
- `HugeiconsIcon` = `forwardRef` + `createElement`, không hook → RSC-safe.
- `@hugeicons/core-free-icons` `sideEffects: false`, ESM per-icon → named import tree-shake được.
- Map hugeicons: `kebab-name` → `PascalNameIcon` (100/108 khớp), 8 icon map tay.
