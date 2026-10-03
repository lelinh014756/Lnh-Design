import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type AppToolBarProps = {
    children: ReactNode;
    className?: string;
};

/** Toolbar row: filters left, actions right. Use with AppToolBarFilters + AppToolBarActions. */
export function AppToolBar({ children, className }: AppToolBarProps) {
    return (
        <div className={cn(
            "flex flex-wrap items-center justify-between gap-3 mb-1 transition-all duration-200"
            , className)}>{children}</div>
    );
}

/** Left section: search input + filter controls. */
export function AppToolBarFilters({ children, className }: AppToolBarProps) {
    return (
        <div className={cn(
            "flex min-w-0 flex-1 flex-wrap items-center gap-2", className)}>
            {children}
        </div>
    );
}

/** Right section: action buttons. */
export function AppToolBarActions({ children, className }: AppToolBarProps) {
    return (
        <div className={cn("flex shrink-0 items-center gap-2"
            , className)}>
            {children}
        </div>
    );
}