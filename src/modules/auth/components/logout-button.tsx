"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/general/app-icon";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/lib/i18n/context";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { dict } = useT();

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.replace("/");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={logout} disabled={pending}>
      {pending ? <Spinner /> : <AppIcon icon="log-out" />}
      {dict.showcase.logout}
    </Button>
  );
}

export default LogoutButton;
