"use client";

import { useId, useState } from "react";
import { toast } from "sonner";

import {
  AppStepper,
  appStepperLabelsVi,
  type AppStepperStep,
} from "@/components/data-display/app-stepper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * `linear` chặn nhảy cóc; `beforeNext` async khoá điều hướng và hiện spinner ở
 * bước hiện tại tới khi xong. Sai thì bước chuyển sang trạng thái lỗi.
 */
export default function AppStepperValidatedWizard() {
  const inputId = useId();
  const [runKey, setRunKey] = useState(0);
  const [step, setStep] = useState(1);
  const [unitCode, setUnitCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<number, boolean>>>({});

  const reset = () => {
    setStep(1);
    setUnitCode("");
    setConfirmed(false);
    setErrors({});
    setRunKey((key) => key + 1);
  };

  const validate = async (current: number) => {
    await delay(700);
    const ok = current === 1 ? /^A\d{2}-\d{2}$/i.test(unitCode.trim()) : current === 2 ? confirmed : true;
    setErrors((prev) => ({ ...prev, [current]: !ok }));
    if (!ok) {
      toast.error(current === 1 ? "Mã căn phải có dạng A12-05" : "Cần xác nhận giá bán trước khi tiếp tục");
    }
    return ok;
  };

  const steps: AppStepperStep[] = [
    {
      title: "Chọn căn",
      error: errors[1],
      content: (
        <div className="grid max-w-xs gap-1.5">
          <Label htmlFor={inputId}>Mã căn</Label>
          <Input
            id={inputId}
            value={unitCode}
            onChange={(event) => setUnitCode(event.target.value)}
            placeholder="A12-05"
            aria-invalid={errors[1] || undefined}
          />
        </div>
      ),
    },
    {
      title: "Giá bán",
      error: errors[2],
      content: (
        <Label className="flex items-center gap-2 font-normal">
          <Checkbox
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
            aria-invalid={errors[2] || undefined}
          />
          Tôi xác nhận giá bán 3,2 tỷ đã gồm VAT
        </Label>
      ),
    },
    {
      title: "Gửi duyệt",
      content: (
        <div className="rounded-md border border-dashed px-4 py-6 text-center text-xs leading-5 text-muted-foreground">
          Căn {unitCode.trim().toUpperCase() || "—"} · 3,2 tỷ · chờ duyệt cấp phòng
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <AppStepper
        key={runKey}
        className="w-full"
        steps={steps}
        value={step}
        onValueChange={setStep}
        linear
        controls="buttons"
        completedTone="success"
        labels={appStepperLabelsVi}
        beforeNext={validate}
        onComplete={async () => {
          await delay(900);
          toast.success("Đã gửi hồ sơ", {
            description: `Căn ${unitCode.trim().toUpperCase()} đang chờ duyệt cấp phòng.`,
          });
        }}
      />
      <Button variant="ghost" size="sm" onClick={reset}>
        Làm lại từ đầu
      </Button>
    </div>
  );
}
