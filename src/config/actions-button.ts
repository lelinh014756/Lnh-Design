import type { IconName } from "@/components/general/app-icon";
import type { AlertStateType } from "@/components/feedback/alert-dialog-status";

export type ActionPreset =
    | "EDIT"
    | "VIEW"
    | "DELETE"
    | "LOCK"
    | "UNLOCK"
    | "DEACTIVATE"
    | "REACTIVATE"
    | "RESET_PASSWORD"
    | "REFRESH"
    | "ADD"
    | "APPROVE"
    | "CANCEL"
    | "DEFAULT"
    | "IMAGE"
    | "PRINT"
    | "HISTORY"
    | "TRANSFER"
    | "RESERVE"
    | "DEPOSIT"
    | "DEAL"
    | "RECEIPT"
    | "DISTRIBUTE";

export type ActionVariant =
    | "default"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | "purple"
    | "orange"
    | "cyan";

/** Key của cluster. Union type → typo bị TS chặn lúc compile, không cần runtime guard. */
export type ClusterKey = "FUND";

export type ClusterConfig = {
    icon: IconName;
    /** Dùng cho cả tooltip lẫn aria-label của nút trigger. */
    title: string;
    variant: ActionVariant;
};

/**
 * Registry metadata cho cluster button.
 * Item khai báo `cluster: <key>` sẽ được gom vào 1 nút dropdown ở direct slot.
 */
export const CLUSTER_CONFIG: Record<ClusterKey, ClusterConfig> = {
    FUND: {
        icon: "wallet",
        title: "Nạp/rút quỹ",
        variant: "success",
    },
};

type PresetI18nKey =
    | "actionEdit"
    | "actionView"
    | "actionDelete"
    | "actionLock"
    | "actionUnlock"
    | "actionDeactivate"
    | "actionReactivate"
    | "actionRefresh"
    | "actionAdd"
    | "actionApprove"
    | "actionCancel";

export type ConfirmKey = "lock" | "unlock" | "delete" | "deactivate" | "reactivate";

export type PresetConfig = {
    icon: IconName;
    variant: ActionVariant;
    alertState: AlertStateType;
    needsConfirm: boolean;
    destructive: boolean;
    i18nKey: PresetI18nKey | null;
};

export const PRESET_CONFIG: Record<ActionPreset, PresetConfig> = {
    EDIT: { icon: "pencil", variant: "primary", alertState: "info", needsConfirm: false, destructive: false, i18nKey: "actionEdit" },
    VIEW: { icon: "info", variant: "info", alertState: "info", needsConfirm: false, destructive: false, i18nKey: "actionView" },
    DELETE: { icon: "trash-2", variant: "destructive", alertState: "error", needsConfirm: true, destructive: true, i18nKey: "actionDelete" },
    LOCK: { icon: "lock", variant: "warning", alertState: "warning", needsConfirm: true, destructive: false, i18nKey: "actionLock" },
    UNLOCK: { icon: "lock-open", variant: "warning", alertState: "warning", needsConfirm: true, destructive: false, i18nKey: "actionUnlock" },
    DEACTIVATE: { icon: "power-off", variant: "warning", alertState: "warning", needsConfirm: false, destructive: false, i18nKey: "actionDeactivate" },
    REACTIVATE: { icon: "power", variant: "success", alertState: "success", needsConfirm: false, destructive: false, i18nKey: "actionReactivate" },
    RESET_PASSWORD: { icon: "shield-check", variant: "primary", alertState: "info", needsConfirm: false, destructive: false, i18nKey: null },
    REFRESH: { icon: "refresh-cw", variant: "info", alertState: "info", needsConfirm: false, destructive: false, i18nKey: "actionRefresh" },
    ADD: { icon: "plus", variant: "success", alertState: "info", needsConfirm: false, destructive: false, i18nKey: "actionAdd" },
    APPROVE: { icon: "circle-check", variant: "success", alertState: "success", needsConfirm: true, destructive: false, i18nKey: "actionApprove" },
    CANCEL: { icon: "x", variant: "warning", alertState: "warning", needsConfirm: true, destructive: false, i18nKey: "actionCancel" },
    DEFAULT: { icon: "ellipsis", variant: "default", alertState: "info", needsConfirm: false, destructive: false, i18nKey: null },
    IMAGE: { icon: "image", variant: "info", alertState: "info", needsConfirm: false, destructive: false, i18nKey: null },
    PRINT: { icon: "printer", variant: "info", alertState: "info", needsConfirm: false, destructive: false, i18nKey: null },
    HISTORY: { icon: "timer", variant: "info", alertState: "info", needsConfirm: false, destructive: false, i18nKey: null },
    TRANSFER: { icon: "arrow-left-right", variant: "success", alertState: "success", needsConfirm: false, destructive: false, i18nKey: null },
    RESERVE: { icon: "clock", variant: "warning", alertState: "warning", needsConfirm: false, destructive: false, i18nKey: null },
    DEPOSIT: { icon: "shield-check", variant: "success", alertState: "success", needsConfirm: false, destructive: false, i18nKey: null },
    DEAL: { icon: "file-signature", variant: "success", alertState: "success", needsConfirm: false, destructive: false, i18nKey: null },
    RECEIPT: { icon: "receipt-text", variant: "warning", alertState: "warning", needsConfirm: false, destructive: false, i18nKey: null },
    DISTRIBUTE: { icon: "layers", variant: "success", alertState: "success", needsConfirm: false, destructive: false, i18nKey: null },
};

export const OUTLINE_VARIANT_CLASSES: Record<ActionVariant, string> = {
    default: "",
    destructive: "text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10",
    success: "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/20",
    warning: "text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-950/20",
    info: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-950/20",
    primary: "text-primary border-primary/20 bg-primary/5 hover:bg-primary/10",
    secondary: "text-secondary border-secondary/20 bg-secondary/5 hover:bg-secondary/10",
    purple: "text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-900/30 dark:bg-purple-950/20",
    orange: "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 dark:border-orange-900/30 dark:bg-orange-950/20",
    cyan: "text-cyan-600 border-cyan-200 bg-cyan-50 hover:bg-cyan-100 dark:border-cyan-900/30 dark:bg-cyan-950/20",
};

export const DROPDOWN_VARIANT_CLASSES: Record<ActionVariant, string> = {
    default: "",
    destructive: "text-destructive focus:text-destructive focus:bg-destructive/10",
    success: "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/30",
    warning: "text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/30",
    info: "text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-950/30",
    primary: "text-primary focus:text-primary focus:bg-primary/10",
    secondary: "text-secondary focus:text-secondary focus:bg-secondary/10",
    purple: "text-purple-600 focus:text-purple-600 focus:bg-purple-50 dark:focus:bg-purple-950/30",
    orange: "text-orange-600 focus:text-orange-600 focus:bg-orange-50 dark:focus:bg-orange-950/30",
    cyan: "text-cyan-600 focus:text-cyan-600 focus:bg-cyan-50 dark:focus:bg-cyan-950/30",
};

/** Màu cho nút icon-only (`variant="ghost"`). Chỉ text color + hover bg, không border/bg tĩnh. */
export const GHOST_VARIANT_CLASSES: Record<ActionVariant, string> = {
    default: "text-muted-foreground hover:text-foreground hover:bg-muted",
    destructive: "text-destructive hover:bg-destructive/10",
    success: "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30",
    warning: "text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30",
    info: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30",
    primary: "text-primary hover:bg-primary/10",
    secondary: "text-secondary hover:bg-secondary/10",
    purple: "text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30",
    orange: "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/30",
    cyan: "text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/30",
};

// ─── Inlined i18n strings (Vietnamese) ───────────────────────────────────────

export const I18N: Record<string, string> = {
    actionEdit: "Chỉnh sửa",
    actionView: "Xem",
    actionDelete: "Xóa",
    actionLock: "Khóa",
    actionUnlock: "Mở khóa",
    actionDeactivate: "Vô hiệu hoá",
    actionReactivate: "Kích hoạt lại",
    actionRefresh: "Làm mới",
    actionAdd: "Thêm",
    actionApprove: "Phê duyệt",
    actionCancel: "Hủy",
    more: "Thêm",
    noteLabel: "Lý do",
};

export const CONFIRM_TEMPLATES: Record<ConfirmKey, { title: string; description: string; confirmText: string }> = {
    lock: {
        title: "Khóa {name} {entityName}?",
        description: "Bạn có chắc chắn muốn khóa {name} {entityName}?",
        confirmText: "Khóa",
    },
    unlock: {
        title: "Mở khóa {name} {entityName}?",
        description: "Bạn có chắc chắn muốn mở khóa {name} {entityName}?",
        confirmText: "Mở khóa",
    },
    delete: {
        title: "Xóa {name} {entityName}?",
        description: "Bạn có chắc chắn muốn xóa {name} {entityName}? Hành động này không thể hoàn tác.",
        confirmText: "Xóa",
    },
    deactivate: {
        title: "Hủy kích hoạt {name} {entityName}?",
        description: "Bạn có chắc chắn muốn hủy kích hoạt {name} {entityName}?",
        confirmText: "Hủy kích hoạt",
    },
    reactivate: {
        title: "Kích hoạt lại {name} {entityName}?",
        description: "Bạn có chắc chắn muốn kích hoạt lại {name} {entityName}?",
        confirmText: "Kích hoạt lại",
    },
};

/**
 * Điền `{name}` và `{entityName}` vào template.
 * `\s*` trước `{entityName}` nuốt luôn khoảng trắng thừa khi entityName vắng mặt.
 * - Có `entityName` → `Xóa Điểm thu "Toà nhà A"?`
 * - Không có       → `Xóa Điểm thu?`
 */
export const fillTemplate = (tpl: string, name: string, entityName?: string): string =>
    tpl
        .replace(/\{name\}/g, name)
        .replace(/\s*\{entityName\}/g, entityName ? ` "${entityName}"` : "");
