"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { loadDemos } from "@/modules/showcase/demos/registry";
import { previewRegistry } from "@/modules/showcase/previews";

/**
 * Sân khấu bên trong iframe.
 *
 * Ba việc: áp theme theo query, đo chiều cao thật rồi báo lên trang mẹ, và
 * render demo.
 *
 * `ResizeObserver` bám vào phần tử bọc chứ không `document.body`: body luôn cao
 * bằng viewport nên số đo trả về sẽ là chiều cao iframe hiện tại — dùng nó để
 * đặt chiều cao iframe là một vòng lặp tự khẳng định, khung không bao giờ co
 * lại được.
 */
export function PreviewStage({
  name,
  demo,
  theme,
}: {
  name: string;
  /** Id demo của component nhiều demo; bỏ trống thì dùng bảng demo đơn. */
  demo?: string;
  theme: "light" | "dark";
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [Loaded, setLoaded] = useState<ComponentType | null>(null);

  // Demo nhiều bản nạp lười theo slug: khung này thường chỉ dựng cho MỘT demo,
  // kéo cả bảng về đây là trả phí cho thứ không hiện.
  useEffect(() => {
    if (!demo) return;
    let alive = true;

    loadDemos(name)
      .then((demos) => {
        if (alive) setLoaded(() => demos.find((entry) => entry.id === demo)?.render ?? null);
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, [name, demo]);

  const Demo = demo ? Loaded : previewRegistry[name];

  // Chạy trước lượt sơn để không thấy nháy sáng rồi mới sang tối.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const post = () => {
      window.parent.postMessage(
        { type: "lnhdesign:height", name, value: stage.getBoundingClientRect().height },
        window.location.origin,
      );
    };

    const observer = new ResizeObserver(post);
    observer.observe(stage);
    post();

    // Font tải xong làm đổi chiều cao sau lần đo đầu; ResizeObserver bắt được,
    // nhưng gửi thêm một lần ở đây để khung đúng ngay cả khi observer bị
    // gộp nhịp.
    document.fonts?.ready.then(post).catch(() => undefined);

    return () => observer.disconnect();
  }, [name]);

  if (!Demo) {
    return (
      <div ref={stageRef} className="grid min-h-40 place-items-center px-5 py-10 text-center">
        <p className="text-sm text-muted-foreground">Item này chưa có bản demo.</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div ref={stageRef} className="w-full bg-background px-5 py-8 md:px-8">
        <Demo />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default PreviewStage;
