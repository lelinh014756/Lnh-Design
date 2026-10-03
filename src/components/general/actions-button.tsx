import * as React from "react";
import { memo, useMemo, useState } from "react";
import AppIcon, { type IconName } from "@/components/general/app-icon";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NoteConfirmDialog } from "../feedback";
import { AlertDialogStatus, type AlertStateType } from "../feedback";
import {
    CLUSTER_CONFIG,
    CONFIRM_TEMPLATES,
    DROPDOWN_VARIANT_CLASSES,
    fillTemplate,
    I18N,
    OUTLINE_VARIANT_CLASSES,
    PRESET_CONFIG,
} from "@/config/actions-button";
import type { ActionPreset, ActionVariant, ClusterConfig, ClusterKey, ConfirmKey } from "@/config/actions-button";

export interface ActionConfirm {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export interface ActionItem {
    preset: ActionPreset;
    /** Định danh ổn định cho React key. Bỏ trống → fallback `${preset}-${index}` */
    id?: string;
    title?: string;
    icon?: IconName;
    variant?: ActionVariant;
    state?: AlertStateType;
    /** `false` → ẨN H�N item khỏi UI. Khác với `disabled`. */
    enabled?: boolean;
    /** `true` → RENDER item nhưng xám + không click được. Khác với `enabled: false`. */
    disabled?: boolean;
    /** Lý do bị chặn — hiện trong tooltip khi `disabled: true`. */
    disabledReason?: string;
    onClick?: (note?: string) => void;
    showTitle?: boolean;
    confirm?: ActionConfirm;
    /**
     * Nhãn nhóm. Item CÓ `group` LUÔN nằm trong dropdown "more",
     * bọc trong DropdownMenuGroup + DropdownMenuLabel.
     * Item KHÔNG có `group` nằm ở direct slot (tràn maxVisible thì vào dropdown, không label).
     */
    group?: string;
    /**
     * Gom item vào 1 nút dropdown riêng đặt ở direct slot (icon + tooltip),
     * metadata lấy từ `CLUSTER_CONFIG[cluster]`.
     *
     * ƯU TIÊN CAO HƠN `group`: item có `cluster` KHÔNG BAO GIỜ nằm trong dropdown "more",
     * kể cả khi khai báo kèm `group`.
     * Precedence: `cluster` > `group` > (direct slot).
     */
    cluster?: ClusterKey;
    /** Opt-in để render NoteConfirmDialog thay vì AlertDialogStatus */
    needsNote?: boolean;
    /** Label cho textarea. Default: dict.system.common.actions.noteLabel ?? "Lý do" */
    noteLabel?: string;
    /** Bắt buộc nhập note. Default: false */
    noteRequired?: boolean;
    className?: string;
}

export interface ActionsButtonProps {
    items: ActionItem[];
    name: string;
    entityData?: { id: number | string; name: string };
    isLoading?: boolean;
    maxVisible?: number;
    moreTitle?: string;
    className?: string;
}

function ActionsButtonComponent({
    items,
    name,
    entityData,
    isLoading = false,
    maxVisible = 3,
    moreTitle,
    className,
}: ActionsButtonProps) {
    const [activeConfirmItem, setActiveConfirmItem] = useState<ActionItem | null>(null);
    const [activeNoteItem, setActiveNoteItem] = useState<ActionItem | null>(null);

    const defaultNoteLabel = "Lý do";

    const isDestructive = (item: ActionItem) =>
        (item.variant ?? PRESET_CONFIG[item.preset].variant) === "destructive";

    const { directItems, overflowItems, groups, clusters, needsMore } = useMemo(() => {
        const visible = items.filter((i) => i.enabled !== false);

        // Precedence: cluster > group > direct
        const clustered = visible.filter((i) => i.cluster);
        const grouped = visible.filter((i) => !i.cluster && i.group);
        const ungrouped = visible.filter((i) => !i.cluster && !i.group);

        // ─── Gom cluster, giữ thứ tự khai báo ───
        const clusterOrder: ClusterKey[] = [];
        const clusterMap = new Map<ClusterKey, ActionItem[]>();
        for (const item of clustered) {
            const key = item.cluster as ClusterKey;
            if (!clusterMap.has(key)) {
                clusterOrder.push(key);
                clusterMap.set(key, []);
            }
            clusterMap.get(key)!.push(item);
        }
        // Lọc cluster rỗng TRƯỚC khi tính budget — budget phải khớp số nút thực render.
        const clusterList = clusterOrder
            .map((key) => ({ key, config: CLUSTER_CONFIG[key], items: clusterMap.get(key)! }))
            .filter((c) => c.items.length > 0);

        // Destructive xuống cuối mỗi cluster — đồng bộ hành vi group
        for (const c of clusterList) {
            c.items.sort((a, b) => Number(isDestructive(a)) - Number(isDestructive(b)));
        }

        // ─── Gom group (GIỮ NGUYÊN logic cũ) ───
        const order: string[] = [];
        const map = new Map<string, ActionItem[]>();
        for (const item of grouped) {
            const key = item.group as string;
            if (!map.has(key)) {
                order.push(key);
                map.set(key, []);
            }
            map.get(key)!.push(item);
        }

        // Destructive xuống cuối mỗi group (sort ổn định → giữ thứ tự tương đối phần còn lại)
        for (const key of order) {
            map.get(key)!.sort((a, b) => Number(isDestructive(a)) - Number(isDestructive(b)));
        }

        // ─── Ngân sách slot (non-circular) ───
        const budget = maxVisible - clusterList.length;
        const more = grouped.length > 0 || ungrouped.length > budget;
        const directBudget = Math.max(0, more ? budget - 1 : budget);

        return {
            directItems: ungrouped.slice(0, directBudget),
            overflowItems: ungrouped.slice(directBudget),
            groups: order.map((label) => ({ label, items: map.get(label)! })),
            clusters: clusterList,
            needsMore: more,
        };
    }, [items, maxVisible]);

    const resolveTitle = (item: ActionItem): string => {
        if (item.title) return item.title;
        const preset = PRESET_CONFIG[item.preset];
        if (preset.i18nKey) {
            const value = I18N[preset.i18nKey];
            if (value) return value as string;
        }
        return item.preset;
    };

    const resolveConfirm = (item: ActionItem) => {
        const preset = PRESET_CONFIG[item.preset];
        const key = item.preset.toLowerCase() as ConfirmKey;
        const tpl = preset.needsConfirm ? CONFIRM_TEMPLATES[key] ?? null : null;
        const defaults = tpl
            ? {
                title: fillTemplate(tpl.title, name, entityData?.name),
                description: fillTemplate(tpl.description, name, entityData?.name),
                confirmText: tpl.confirmText,
            }
            : null;
        return {
            title: item.confirm?.title ?? defaults?.title ?? "",
            description: item.confirm?.description ?? defaults?.description ?? "",
            confirmText: item.confirm?.confirmText ?? defaults?.confirmText ?? "Xác nhận",
            cancelText: item.confirm?.cancelText ?? I18N.actionCancel,
        };
    };

    const handleItemClick = (item: ActionItem) => {
        if (item.disabled) return;
        const preset = PRESET_CONFIG[item.preset];
        if (item.needsNote) {
            setActiveNoteItem(item);
        } else if (preset.needsConfirm || item.confirm) {
            setActiveConfirmItem(item);
        } else {
            item.onClick?.();
        }
    };

    const renderDirectItem = (item: ActionItem, index: number) => {
        const preset = PRESET_CONFIG[item.preset];
        const Icon = item.icon ?? preset.icon;
        const variant = item.variant ?? preset.variant;
        const title = resolveTitle(item);
        const showTitle = item.showTitle;
        const isDisabled = isLoading || item.disabled === true;
        const key = item.id ?? `${item.preset}-${index}`;

        const TriggerButton = (
            <Button
                variant="outline"
                size={showTitle ? "sm" : "icon-sm"}
                disabled={isDisabled}
                aria-label={title}
                className={cn(
                    showTitle && "gap-2 px-3",
                    OUTLINE_VARIANT_CLASSES[variant],
                    // !showTitle && GHOST_VARIANT_CLASSES[variant],
                    item.className,
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                }}
            >
                {Icon && <AppIcon icon={Icon} size={14} className="size-3.5" aria-hidden />}
                {showTitle && <span>{title}</span>}
            </Button>
        );

        if (showTitle) return <React.Fragment key={key}>{TriggerButton}</React.Fragment>;

        return (
            <Tooltip key={key}>
                <TooltipTrigger asChild>{TriggerButton}</TooltipTrigger>
                <TooltipContent>
                    {item.disabled && item.disabledReason ? item.disabledReason : title}
                </TooltipContent>
            </Tooltip>
        );
    };

    const renderDropdownItem = (item: ActionItem, index: number) => {
        const preset = PRESET_CONFIG[item.preset];
        const Icon = item.icon ?? preset.icon;
        const variant = item.variant ?? preset.variant;
        const title = resolveTitle(item);
        const isDisabled = isLoading || item.disabled === true;

        return (
            <DropdownMenuItem
                key={item.id ?? `${item.preset}-${index}`}
                disabled={isDisabled}
                title={item.disabled ? item.disabledReason : undefined}
                onSelect={(e) => {
                    if (item.needsNote || preset.needsConfirm || item.confirm) {
                        e.preventDefault(); // giữ dropdown mở, để dialog tiếp quản
                    }
                    e.stopPropagation();
                    handleItemClick(item);
                }}
                className={cn("cursor-pointer gap-2", DROPDOWN_VARIANT_CLASSES[variant])}
            >
                <AppIcon icon={Icon} size={15} aria-hidden />
                <span>{title}</span>
            </DropdownMenuItem>
        );
    };

    const renderDropdownTrigger = ({
        triggerKey, icon, iconSize, iconClassName, title, variant, content,
    }: {
        triggerKey: string;
        icon: IconName;
        iconSize: number;
        iconClassName: string;
        title: string;
        variant: ActionVariant;
        content: React.ReactNode;
    }) => (
        <Tooltip key={triggerKey}>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            type="button"
                            disabled={isLoading}
                            aria-label={title}
                            className={OUTLINE_VARIANT_CLASSES[variant]}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AppIcon icon={icon} size={iconSize} className={iconClassName} aria-hidden />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-56"
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{title}</TooltipContent>
        </Tooltip>
    );

    const renderMoreButton = () =>
        renderDropdownTrigger({
            triggerKey: "__more",
            icon: "ellipsis-vertical",
            iconSize: 12,
            iconClassName: "size-3",
            title: moreTitle ?? I18N.more,
            variant: "default",
            content: (
                <>
                    {/* 1. Overflow ungrouped — flat, không label */}
                    {overflowItems.map(renderDropdownItem)}

                    {/* 2. Các group — label + separator */}
                    {groups.map((g, gi) => (
                        <React.Fragment key={g.label}>
                            {(gi > 0 || overflowItems.length > 0) && <DropdownMenuSeparator />}
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    {g.label}
                                </DropdownMenuLabel>
                                {g.items.map(renderDropdownItem)}
                            </DropdownMenuGroup>
                        </React.Fragment>
                    ))}
                </>
            ),
        });

    const renderClusterButton = (c: { key: ClusterKey; config: ClusterConfig; items: ActionItem[] }) =>
        renderDropdownTrigger({
            triggerKey: `__cluster-${c.key}`,
            icon: c.config.icon,
            iconSize: 14,
            iconClassName: "size-3.5",
            title: c.config.title,
            variant: c.config.variant,
            content: c.items.map(renderDropdownItem),
        });

    const activeConfirm = activeConfirmItem ? resolveConfirm(activeConfirmItem) : null;
    const activeState: AlertStateType = activeConfirmItem
        ? (activeConfirmItem.state ?? PRESET_CONFIG[activeConfirmItem.preset].alertState)
        : "warning";

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            {directItems.map(renderDirectItem)}
            {clusters.map(renderClusterButton)}
            {needsMore && renderMoreButton()}

            {activeConfirmItem && activeConfirm && (
                <AlertDialogStatus
                    isLoading={isLoading}
                    open={!!activeConfirmItem}
                    onOpenChange={(open) => {
                        if (!open) setActiveConfirmItem(null);
                    }}
                    state={activeState}
                    title={activeConfirm.title}
                    description={activeConfirm.description}
                    confirmText={activeConfirm.confirmText}
                    cancelText={activeConfirm.cancelText}
                    onCancel={() => { setActiveConfirmItem(null) }}
                    onConfirm={() => {
                        activeConfirmItem.onClick?.();
                        setActiveConfirmItem(null);
                    }}
                />
            )}

            {activeNoteItem && (
                <NoteConfirmDialog
                    open={!!activeNoteItem}
                    onOpenChange={(open) => { if (!open) setActiveNoteItem(null); }}
                    title={resolveTitle(activeNoteItem)}
                    description={resolveConfirm(activeNoteItem).description}
                    noteLabel={activeNoteItem.noteLabel ?? defaultNoteLabel}
                    noteRequired={activeNoteItem.noteRequired ?? false}
                    onConfirm={(note) => {
                        activeNoteItem.onClick?.(note);
                        setActiveNoteItem(null);
                    }}
                    onCancel={() => { setActiveNoteItem(null); }}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}

const ActionsButton = memo(ActionsButtonComponent);
export default ActionsButton;

