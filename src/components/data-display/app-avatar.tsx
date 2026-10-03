"use client";

import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface AppAvatarProps {
  className?: string;
  fullName?: string | null;
  src?: string | null;
}

/** Chữ cái đầu của họ và tên: "Trần Thị Bảy" → "TB". */
function getInitials(fullName?: string | null): string {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

const AppAvatar = ({ className, fullName, src }: AppAvatarProps) => (
  <Avatar className={cn("border border-primary/60 shadow-sm", className)}>
    {src ? <AvatarImage src={src} alt={fullName ?? "Ảnh đại diện"} className="bg-primary/20" /> : null}
    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
      {getInitials(fullName)}
    </AvatarFallback>
  </Avatar>
);

export default memo(AppAvatar);
