"use client";

import { AppCard } from "@/components/layout/app-card";

const ROWS = Array.from({ length: 14 }, (_, index) => ({
  id: `NV${String(index + 1).padStart(3, "0")}`,
  name: `Nhân sự mẫu ${index + 1}`,
}));

/**
 * Mặc định body bọc `Scroller` với trần 20rem: danh sách dài không đẩy cả trang.
 * `scroll={false}` tắt trần đó cho nội dung tự nó đã cao có kiểm soát.
 */
export default function AppCardScrolling() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AppCard title="Mặc định — có trần chiều cao">
        <ul className="divide-y text-sm">
          {ROWS.map((row) => (
            <li key={row.id} className="flex justify-between py-1.5">
              <span>{row.name}</span>
              <code className="text-xs text-muted-foreground">{row.id}</code>
            </li>
          ))}
        </ul>
      </AppCard>

      <AppCard title="scroll={false} — cao theo nội dung" scroll={false} bodyClassName="px-4 py-4">
        <ul className="divide-y text-sm">
          {ROWS.slice(0, 5).map((row) => (
            <li key={row.id} className="flex justify-between py-1.5">
              <span>{row.name}</span>
              <code className="text-xs text-muted-foreground">{row.id}</code>
            </li>
          ))}
        </ul>
      </AppCard>
    </div>
  );
}
