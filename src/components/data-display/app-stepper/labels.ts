import type { AppStepperLabels } from "./types"

export const appStepperLabelsEn: AppStepperLabels = {
  navLabel: "Steps",
  back: "Back",
  next: "Next",
  finish: "Finish",
  stepLabel: "Step {step}",
  progress: "Step {current} of {total}",
  statusActive: "In progress",
  statusCompleted: "Completed",
  statusPending: "Not started",
  statusError: "Needs attention",
  statusLoading: "Processing",
}

export const appStepperLabelsVi: AppStepperLabels = {
  navLabel: "Các bước thực hiện",
  back: "Quay lại",
  next: "Tiếp tục",
  finish: "Hoàn tất",
  stepLabel: "Bước {step}",
  progress: "Bước {current}/{total}",
  statusActive: "Đang thực hiện",
  statusCompleted: "Hoàn thành",
  statusPending: "Chưa bắt đầu",
  statusError: "Cần kiểm tra",
  statusLoading: "Đang xử lý",
}

/** Khoá mang giá trị `undefined` không được xoá mặc định — spread thẳng thì có. */
export function resolveAppStepperLabels(
  labels?: Partial<AppStepperLabels>
): AppStepperLabels {
  if (!labels) return appStepperLabelsEn
  const resolved: AppStepperLabels = { ...appStepperLabelsEn }
  for (const key of Object.keys(labels) as (keyof AppStepperLabels)[]) {
    const value = labels[key]
    if (value !== undefined) Object.assign(resolved, { [key]: value })
  }
  return resolved
}

/** Placeholder không có giá trị thì giữ nguyên — mẫu gõ sai vẫn đọc được, không ra "undefined". */
export function formatLabel(template: string, values: Record<string, number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
