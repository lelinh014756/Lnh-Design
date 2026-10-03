import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";

/**
 * Vỏ chung cho nhóm route `(landing)`.
 *
 * Khác `ShowcaseShell`: không sidebar, không phiên đăng nhập — landing là bề
 * mặt công khai nên không có gì để gác ở đây.
 */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-dvh flex-col bg-background">
        <LandingHeader />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </div>
    </TooltipProvider>
  );
}

export default LandingShell;
