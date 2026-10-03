"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Tường lỗi quanh một demo.
 *
 * Trước đây iframe làm việc này miễn phí: demo hỏng thì chỉ khung đó trắng.
 * Render thẳng trong trang thì một demo ném lỗi sẽ hạ cả trang component, nên
 * tường phải dựng tay — và dựng ở cấp từng card, không phải cấp trang, để các
 * demo còn lại vẫn dùng được.
 */
export class DemoBoundary extends Component<
  { children: ReactNode; fallbackLabel: string },
  { message: string | null }
> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[showcase] demo lỗi", error, info.componentStack);
  }

  render() {
    if (this.state.message) {
      return (
        <div className="flex flex-col gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-5 text-sm">
          <p className="font-medium text-destructive">{this.props.fallbackLabel}</p>
          <code className="text-xs break-all text-muted-foreground">{this.state.message}</code>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DemoBoundary;
