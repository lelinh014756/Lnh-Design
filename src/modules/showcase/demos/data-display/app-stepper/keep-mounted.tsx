"use client";

import { useState } from "react";

import {
  AppStepper,
  appStepperLabelsVi,
  type AppStepperStep,
} from "@/components/data-display/app-stepper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const STEPS: AppStepperStep[] = [1, 2, 3].map((n) => ({
  title: `Ghi chú ${n}`,
  content: <Input placeholder={`Gõ gì đó ở bước ${n} rồi chuyển bước`} className="max-w-xs" />,
}));

/**
 * Bật: input không-controlled giữ giá trị khi đổi bước. Tắt: bước ẩn bị
 * unmount, giá trị mất. `key` remount stepper để mỗi lần bật/tắt bắt đầu sạch.
 */
export default function AppStepperKeepMounted() {
  const [keep, setKeep] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Label className="flex w-fit items-center gap-2 font-mono text-xs font-normal">
        <Switch size="sm" checked={keep} onCheckedChange={setKeep} />
        keepMounted={String(keep)}
      </Label>
      <AppStepper
        key={String(keep)}
        steps={STEPS}
        keepMounted={keep}
        controls="buttons"
        labels={appStepperLabelsVi}
      />
    </div>
  );
}
