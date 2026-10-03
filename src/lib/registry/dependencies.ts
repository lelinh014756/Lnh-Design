export interface DependencyEntry {
  name: string;
  source: "registry" | "npm";
}

/**
 * Gộp hai danh sách của registry item thành một danh sách phẳng đã gắn nhãn nguồn.
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
      name: `@aurecook/${name}`,
      source: "registry" as const,
    })),
    ...(item.dependencies ?? []).map((name) => ({ name, source: "npm" as const })),
  ];
}
