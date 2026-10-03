import type { ComponentType } from "react";

/**
 * Map `slug → component demo`.
 *
 * Giá trị là component chứ không phải element: mỗi demo cần state riêng và
 * remount sạch khi khung xem tải lại, một element dựng sẵn thì không.
 */
export type PreviewMap = Record<string, ComponentType>;
