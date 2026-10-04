"use client";

import { ButtonIntent, type ButtonIntentTone } from "@/components/general/app-button";

const TONES: { intent: ButtonIntentTone; label: string }[] = [
  { intent: "success", label: "Duyệt" },
  { intent: "warning", label: "Tạm giữ" },
  { intent: "destructive", label: "Từ chối" },
  { intent: "info", label: "Xem log" },
];

/** Màu theo nghĩa hành động; độ đậm theo `variant`: nền đặc, viền nhạt, hoặc chỉ tô chữ. */
export default function AppButtonIntents() {
  return (
    <div className="flex flex-col gap-3">
      {([undefined, "outline", "ghost"] as const).map((variant) => (
        <div key={variant ?? "solid"} className="flex flex-wrap items-center gap-3">
          {TONES.map(({ intent, label }) => (
            <ButtonIntent key={intent} intent={intent} variant={variant}>
              {label}
            </ButtonIntent>
          ))}
        </div>
      ))}
    </div>
  );
}
