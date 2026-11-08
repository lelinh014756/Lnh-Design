export interface DependencyEntry {
  name: string;
  source: "registry" | "npm";
}

/**
 * Gộp hai danh sách của registry item thành một danh sách phẳng đã gắn nhãn nguồn.
 *
 * Tên registry giữ nguyên văn: builder đã ghi kèm namespace (`@lnhdesign/x`),
 * còn tên trần theo quy ước shadcn là item của registry mặc định — gắn thêm
 * namespace nào cũng là đổi nghĩa.
 *
 * Đặt ở module thuần chứ không cạnh dialog: dialog là `"use client"`, và hàm
 * export từ đó thì Server Component gọi không được — nó chỉ thấy một client
 * reference.
 */
export function toDependencyEntries(item: {
  registryDependencies?: string[];
  dependencies?: string[];
}): DependencyEntry[] {
  return [
    ...(item.registryDependencies ?? []).map((name) => ({
      name,
      source: "registry" as const,
    })),
    ...(item.dependencies ?? []).map((name) => ({ name, source: "npm" as const })),
  ];
}
