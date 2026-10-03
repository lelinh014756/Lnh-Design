"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/lib/i18n/context";

type ErrorKey = "invalid" | "required" | "networkError" | null;

/**
 * Form đăng nhập.
 *
 * Sau khi đăng nhập thành công gọi `router.refresh()` trước khi điều hướng:
 * cookie phiên vừa được đặt, mà layout phía server đã render với bản không có
 * cookie — thiếu bước này thì trang đích hiện trạng thái chưa đăng nhập cho tới
 * lần tải tiếp theo.
 */
export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ErrorKey>(null);
  const router = useRouter();
  const { dict } = useT();
  const t = dict.auth;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("required");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError(response.status === 401 ? "invalid" : "networkError");
        return;
      }

      router.refresh();
      router.replace(redirectTo);
    } catch {
      setError("networkError");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm flex-col gap-5" noValidate>
      <Field>
        <FieldLabel htmlFor="email">{t.email}</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder={t.emailPlaceholder}
          aria-invalid={error === "invalid" || error === "required"}
          disabled={pending}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">{t.password}</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={t.passwordPlaceholder}
          aria-invalid={error === "invalid" || error === "required"}
          disabled={pending}
        />
        {error && <FieldError>{t[error]}</FieldError>}
      </Field>

      <Button type="submit" disabled={pending} className="mt-1">
        {pending && <Spinner />}
        {pending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}

export default LoginForm;
