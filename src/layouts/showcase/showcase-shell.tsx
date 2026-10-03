"use client";

import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ShowcaseHeader } from "./showcase-header";

/**
 * Vỏ chung cho mọi trang showcase.
 *
 * Không gác quyền ở đây — `src/proxy.ts` đã chặn `/internal/**` từ trước, shell
 * chỉ lo bố cục.
 *
 * `SidebarProvider` chạy ở chế độ không kiểm soát: nó tự lưu trạng thái vào
 * cookie `sidebar_state` và bắt phím tắt Cmd/Ctrl+B. Bọc thêm store bên ngoài
 * sẽ làm mất phần lưu trạng thái đó.
 *
 * Header nằm NGOÀI `SidebarProvider` về mặt thị giác (sticky full-width) nhưng
 * trong cây React nó phải nằm trong, vì `SidebarTrigger` cần context.
 */
export function ShowcaseShell({
  sidebar,
  footer,
  defaultSidebarOpen = true,
  children,
}: {
  sidebar?: ReactNode;
  footer?: ReactNode;
  defaultSidebarOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider defaultOpen={defaultSidebarOpen} className="flex-col">
        <ShowcaseHeader hasSidebar={Boolean(sidebar)} />
        <div className="flex w-full flex-1 items-stretch">
          {sidebar}
          <SidebarInset className="flex h-dvh max-h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background transition-all duration-300 ease-in-out xl:h-full xl:max-h-full">
            <div className="mx-auto min-h-0 w-full max-w-(--container-max-width) flex-1 overflow-x-clip overflow-y-auto bg-primary/3">
              {children}
            </div>
            {footer}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default ShowcaseShell;
