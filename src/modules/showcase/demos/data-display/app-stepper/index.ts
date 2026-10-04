import type { ComponentDemo, PropDoc } from "../../types";

import AppStepperBar from "./bar";
import AppStepperCentered from "./centered";
import AppStepperContainerCollapse from "./container-collapse";
import AppStepperControlled from "./controlled";
import AppStepperCustomControls from "./custom-controls";
import AppStepperDotLoading from "./dot-loading";
import AppStepperGuardError from "./guard-error";
import AppStepperIconStatus from "./icon-status";
import AppStepperIndicator from "./indicator";
import AppStepperInline from "./inline";
import AppStepperKeepMounted from "./keep-mounted";
import AppStepperManualStates from "./manual-states";
import AppStepperProgressCompact from "./progress-compact";
import AppStepperSizes from "./sizes";
import AppStepperStackedNoSeparator from "./stacked-no-separator";
import AppStepperValidatedWizard from "./validated-wizard";
import AppStepperVertical from "./vertical";
import AppStepperVerticalIndicator from "./vertical-indicator";
import AppStepperVerticalTitles from "./vertical-titles";

export const demos: ComponentDemo[] = [
  {
    id: "indicator",
    title: { vi: "Chỉ indicator", en: "Indicator only" },
    description: {
      vi: "Vòng số và đường nối, không nhãn. Tiêu đề vẫn thành `aria-label` của từng bước.",
      en: "Numbered circles and connectors, no labels. Titles still become each step's `aria-label`.",
    },
    snippet: `<AppStepper steps={steps} variant="indicator"
  completedTone="success" showCompletedIcon={false} />`,
    render: AppStepperIndicator,
  },
  {
    id: "dot-loading",
    title: { vi: "Marker chấm + loading", en: "Dot marker and loading" },
    description: {
      vi: "`marker=\"dot\"`: bước đang làm có chấm giữa, bước xong hiện dấu tick. `loading` chỉ hiện khi bước đó active.",
      en: "`marker=\"dot\"`: the active step shows a dot, finished steps a tick. `loading` only shows while that step is active.",
    },
    snippet: `steps[1].loading = true
<AppStepper variant="indicator" marker="dot" size="sm" />`,
    render: AppStepperDotLoading,
  },
  {
    id: "stacked-no-separator",
    title: { vi: "Stacked, không đường nối", en: "Stacked, no connectors" },
    description: {
      vi: "Indicator trên, tiêu đề dưới căn trái. Tắt đường nối khi các bước chỉ là mốc tham chiếu.",
      en: "Indicator on top, left-aligned title below. Drop the connectors when steps are just reference points.",
    },
    snippet: `<AppStepper variant="stacked" showSeparator={false} />`,
    render: AppStepperStackedNoSeparator,
  },
  {
    id: "icon-status",
    title: { vi: "Icon, nhãn bước, badge trạng thái", en: "Icons, step label, status badge" },
    description: {
      vi: "Icon riêng từng bước, dòng \"Bước N\" và badge tự đổi theo trạng thái. Chuỗi hiển thị đi vào bằng `labels`.",
      en: "Per-step icons, a \"Step N\" line and a status badge that follows the state. Copy comes in through `labels`.",
    },
    snippet: `<AppStepper variant="stacked" size="lg" showStepLabel showStatus
  controls="buttons" labels={appStepperLabelsVi} />`,
    render: AppStepperIconStatus,
  },
  {
    id: "centered",
    title: { vi: "Căn giữa + mô tả", en: "Centered with descriptions" },
    description: {
      vi: "Nhãn căn giữa dưới indicator. Khung hẹp hơn 28rem thì mô tả tự ẩn, vẫn đọc được bằng screen reader.",
      en: "Labels centered under each indicator. Below a 28rem container the descriptions hide visually but stay readable to screen readers.",
    },
    snippet: `<AppStepper variant="centered" steps={steps} />`,
    render: AppStepperCentered,
  },
  {
    id: "inline",
    title: { vi: "Inline", en: "Inline" },
    description: {
      vi: "Bố cục mặc định: indicator và nhãn cùng hàng, đường nối co giãn giữa các bước. Có hoặc không có mô tả.",
      en: "The default layout: indicator and label on one row, connectors stretching between steps. With or without descriptions.",
    },
    snippet: `<AppStepper steps={steps} /> // variant mặc định "inline"`,
    render: AppStepperInline,
  },
  {
    id: "bar",
    title: { vi: "Thanh từng bước có nhãn", en: "Labelled segment bar" },
    description: {
      vi: "Mỗi bước là một đoạn thanh, nhãn nằm dưới. Hợp với onboarding 3–5 bước.",
      en: "Each step is a bar segment with its label underneath. Suits 3–5 step onboarding.",
    },
    snippet: `<AppStepper variant="bar" />`,
    render: AppStepperBar,
  },
  {
    id: "progress-compact",
    title: { vi: "Thanh tiến độ + counter", en: "Progress bar and counter" },
    description: {
      vi: "Thanh liền khối, link Quay lại ẩn ở bước đầu, counter \"N / tổng\", nút Tiếp tục căn phải. Bấm từng đoạn để nhảy bước.",
      en: "Continuous bar, Back link hidden on the first step, an \"N / total\" counter and a right-aligned Next. Click a segment to jump.",
    },
    snippet: `<AppStepper variant="progress" controls="compact"
  onComplete={submit} />`,
    render: AppStepperProgressCompact,
  },
  {
    id: "vertical",
    title: { vi: "Dọc + mô tả", en: "Vertical with descriptions" },
    description: {
      vi: "Nav bên trái, nội dung bên phải; khung hẹp hơn 28rem thì xếp chồng. Dọc chỉ nhận `indicator` / `inline`.",
      en: "Nav on the left, content on the right; stacks below a 28rem container. Vertical accepts only `indicator` / `inline`.",
    },
    snippet: `<AppStepper orientation="vertical" variant="inline" />`,
    render: AppStepperVertical,
  },
  {
    id: "vertical-indicator",
    title: { vi: "Dọc chỉ indicator + loading", en: "Vertical indicator with loading" },
    description: {
      vi: "Bản dọc gọn nhất — thanh bên của sheet hoặc màn hình hẹp.",
      en: "The most compact vertical form — a sheet side rail or a narrow screen.",
    },
    snippet: `<AppStepper orientation="vertical" variant="indicator" />`,
    render: AppStepperVerticalIndicator,
  },
  {
    id: "vertical-titles",
    title: { vi: "Dọc chỉ tiêu đề", en: "Vertical, titles only" },
    description: {
      vi: "Không có mô tả — khoảng cách giữa các bước vẫn giữ đều.",
      en: "No descriptions — spacing between steps stays even.",
    },
    snippet: `<AppStepper orientation="vertical" steps={titlesOnly} />`,
    render: AppStepperVerticalTitles,
  },
  {
    id: "sizes",
    title: { vi: "Kích thước", en: "Sizes" },
    description: {
      vi: "`sm` / `md` / `lg` đổi đường kính vòng, cỡ icon và cỡ tiêu đề; vị trí đường nối tự tính theo biến CSS.",
      en: "`sm` / `md` / `lg` change circle diameter, icon and title size; connector offsets follow a CSS variable.",
    },
    snippet: `<AppStepper size="sm" | "md" | "lg" />`,
    render: AppStepperSizes,
  },
  {
    id: "container-collapse",
    title: { vi: "Thu gọn theo container", en: "Container collapse" },
    description: {
      vi: "Nhãn inline của bước chưa active tự ẩn khi khung hẹp; ngưỡng tăng theo số bước. Đo theo container nên đặt trong sheet/dialog vẫn đúng.",
      en: "Inline labels of inactive steps hide in narrow containers; the threshold grows with step count. Container-based, so it holds inside sheets and dialogs.",
    },
    snippet: `<div className="max-w-xs"><AppStepper steps={fiveSteps} /></div>`,
    render: AppStepperContainerCollapse,
  },
  {
    id: "controlled",
    title: { vi: "Controlled + Trước/Sau", en: "Controlled with Back/Next" },
    description: {
      vi: "Parent giữ `value`; `onValueChange` chỉ được gọi khi thực sự chuyển bước.",
      en: "The parent owns `value`; `onValueChange` fires only on an actual step change.",
    },
    snippet: `const [step, setStep] = useState(2)
<AppStepper value={step} onValueChange={setStep} controls="buttons" />`,
    render: AppStepperControlled,
  },
  {
    id: "validated-wizard",
    title: { vi: "Tuần tự + guard async", en: "Linear with async guard" },
    description: {
      vi: "Nhập mã căn dạng A12-05 và tick xác nhận để qua bước. Guard chạy 700ms: spinner ở bước hiện tại, mọi điều hướng bị khoá; sai thì bước chuyển trạng thái lỗi.",
      en: "Enter a unit code like A12-05 and tick the box to advance. The 700ms guard shows a spinner and locks navigation; a failure flags the step.",
    },
    snippet: `<AppStepper linear controls="buttons"
  beforeNext={async (step) => validate(step)} onComplete={submit} />`,
    render: AppStepperValidatedWizard,
  },
  {
    id: "guard-error",
    title: { vi: "Guard ném lỗi", en: "Throwing guard" },
    description: {
      vi: "Lỗi ném từ `beforeNext` / `onComplete` được bắt: không chuyển bước, chuyển cho `onError` (không truyền thì ghi `console.error`).",
      en: "Errors thrown by `beforeNext` / `onComplete` are caught: the step stays put and the error goes to `onError` (or `console.error` without it).",
    },
    snippet: `beforeNext={() => api.check()} // throws
onError={(error, step) => toast.error(...)}`,
    render: AppStepperGuardError,
  },
  {
    id: "manual-states",
    title: { vi: "Trạng thái đặt thủ công", en: "Manually set states" },
    description: {
      vi: "`completed` cho dữ liệu resume, `error` cho bước cần sửa, `disabled` cho bước chưa mở, `badge` cho nhãn phụ.",
      en: "`completed` for resumed data, `error` for steps needing a fix, `disabled` for unopened steps, `badge` for a side label.",
    },
    snippet: `{ completed: true } · { error: true }
{ disabled: true, badge: <Badge>Tuỳ chọn</Badge> }`,
    render: AppStepperManualStates,
  },
  {
    id: "custom-controls",
    title: { vi: "Cụm điều khiển tự dựng", en: "Custom controls" },
    description: {
      vi: "`renderControls` nhận api — `next` / `prev` / `goTo` trả `Promise<boolean>` — để thêm Lưu nháp hoặc xếp nút theo layout dialog.",
      en: "`renderControls` receives the api — `next` / `prev` / `goTo` return `Promise<boolean>` — to add Save draft or match a dialog layout.",
    },
    snippet: `renderControls={(api) => (
  <Button onClick={() => void api.next()}>…</Button>
)}`,
    render: AppStepperCustomControls,
  },
  {
    id: "keep-mounted",
    title: { vi: "keepMounted", en: "keepMounted" },
    description: {
      vi: "Bật: input không-controlled giữ giá trị khi đổi bước. Tắt: bước ẩn bị unmount, giá trị mất.",
      en: "On: uncontrolled inputs keep their value across steps. Off: hidden steps unmount and the value is lost.",
    },
    snippet: `<AppStepper keepMounted steps={stepsWithInputs} />`,
    render: AppStepperKeepMounted,
  },
];

export const props: PropDoc[] = [
  {
    name: "steps",
    type: "AppStepperStep[]",
    required: true,
    description: {
      vi: "`title`, `description`, `icon` (`IconName`), `badge`, `content`, `completed`, `disabled`, `loading`, `error`, `key`.",
      en: "`title`, `description`, `icon` (`IconName`), `badge`, `content`, `completed`, `disabled`, `loading`, `error`, `key`.",
    },
  },
  {
    name: "value / defaultValue",
    type: "number",
    default: "1",
    description: {
      vi: "Bước hiện tại, đánh số từ 1. Controlled / uncontrolled; giá trị ngoài khoảng bị kẹp về bước gần nhất.",
      en: "Current step, 1-based. Controlled / uncontrolled; out-of-range values clamp to the nearest step.",
    },
  },
  {
    name: "onValueChange",
    type: "(step: number) => void",
    description: {
      vi: "Chỉ bắn sau khi `beforeNext` cho qua.",
      en: "Fires only after `beforeNext` passes.",
    },
  },
  {
    name: "variant",
    type: '"indicator" | "inline" | "stacked" | "centered" | "bar" | "progress"',
    default: '"inline"',
    description: {
      vi: "Bố cục nav. `indicator` và `progress` không có nhãn chữ.",
      en: "Nav layout. `indicator` and `progress` have no text labels.",
    },
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: {
      vi: "Dọc chỉ nhận `indicator` / `inline` — ép ở tầng type.",
      en: "Vertical accepts only `indicator` / `inline` — enforced by the type.",
    },
  },
  {
    name: "marker",
    type: '"number" | "dot"',
    default: '"number"',
    description: {
      vi: "Nội dung vòng tròn khi bước không có icon.",
      en: "Circle content when the step has no icon.",
    },
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: {
      vi: "Vòng 20 / 24 / 32px; vị trí đường nối tự tính theo biến CSS.",
      en: "20 / 24 / 32px circles; connector offsets follow a CSS variable.",
    },
  },
  {
    name: "completedTone",
    type: '"primary" | "success"',
    default: '"primary"',
    description: {
      vi: "Màu bước xong và đường nối. `success` dùng `green-600`, không cần token riêng.",
      en: "Color of finished steps and connectors. `success` uses `green-600`, no extra token needed.",
    },
  },
  {
    name: "showCompletedIcon",
    type: "boolean",
    default: "true",
    description: { vi: "Dấu tick khi xong; tắt để giữ số.", en: "Tick on completion; turn off to keep the number." },
  },
  {
    name: "showSeparator",
    type: "boolean",
    default: "true",
    description: { vi: "Đường nối giữa các bước.", en: "Connectors between steps." },
  },
  {
    name: "showStepLabel / showStatus",
    type: "boolean",
    default: "false",
    description: {
      vi: "Dòng \"Bước N\" / badge trạng thái tự đổi theo bước.",
      en: "\"Step N\" line / status badge that follows the step state.",
    },
  },
  {
    name: "linear",
    type: "boolean",
    default: "false",
    description: {
      vi: "Chặn nhảy tới bước mà các bước trước nó chưa xong. Bước `disabled` được coi là đã qua.",
      en: "Blocks jumping past unfinished steps. `disabled` steps count as passed.",
    },
  },
  {
    name: "beforeNext",
    type: "(step: number) => boolean | Promise<boolean>",
    description: {
      vi: "Guard tiến tới. Async thì hiện spinner và khoá điều hướng; kết quả về trễ sau khi bước đã đổi từ ngoài sẽ bị bỏ.",
      en: "Forward guard. Async shows a spinner and locks navigation; late results after an external step change are dropped.",
    },
  },
  {
    name: "onComplete",
    type: "() => void | Promise<void>",
    description: {
      vi: "Bấm Hoàn tất ở bước cuối, sau khi `beforeNext` cho qua. Không truyền thì nút cuối bị khoá.",
      en: "Finish on the last step, after `beforeNext` passes. Without it the last button is disabled.",
    },
  },
  {
    name: "onError",
    type: "(error: unknown, step: number) => void",
    description: {
      vi: "Lỗi ném từ `beforeNext` / `onComplete`. Không truyền thì ghi `console.error`.",
      en: "Errors thrown by `beforeNext` / `onComplete`. Without it they go to `console.error`.",
    },
  },
  {
    name: "controls",
    type: '"none" | "buttons" | "compact"',
    default: '"none"',
    description: { vi: "Cụm điều khiển dựng sẵn.", en: "Built-in control row." },
  },
  {
    name: "renderControls",
    type: "(api: AppStepperApi) => ReactNode",
    description: {
      vi: "Thay cụm điều khiển. api: `step`, `total`, `isFirst`, `isLast`, `isPending`, `isFinished`, `canFinish`, `next`, `prev`, `goTo`.",
      en: "Replaces the controls. api: `step`, `total`, `isFirst`, `isLast`, `isPending`, `isFinished`, `canFinish`, `next`, `prev`, `goTo`.",
    },
  },
  {
    name: "labels",
    type: "Partial<AppStepperLabels>",
    default: "appStepperLabelsEn",
    description: {
      vi: "Ghi đè từng nhãn hoặc truyền nguyên `appStepperLabelsVi`. `stepLabel` / `progress` là chuỗi mẫu có `{step}`, `{current}`, `{total}`.",
      en: "Override single labels or pass `appStepperLabelsVi`. `stepLabel` / `progress` are templates with `{step}`, `{current}`, `{total}`.",
    },
  },
  {
    name: "keepMounted",
    type: "boolean",
    default: "false",
    description: {
      vi: "Giữ DOM các bước ẩn — input không-controlled không mất giá trị khi đổi bước.",
      en: "Keeps hidden steps mounted so uncontrolled inputs keep their value.",
    },
  },
  {
    name: "className / navClassName / panelClassName",
    type: "string",
    description: {
      vi: "Gắn lên khung ngoài / nav / panel nội dung.",
      en: "Applied to the wrapper / nav / content panel.",
    },
  },
];
