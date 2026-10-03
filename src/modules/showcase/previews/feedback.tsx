"use client";

import { toast } from "sonner";

import { EmptyListIllustration } from "@/components/illustrations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import type { PreviewMap } from "./types";

export const feedbackPreviews: PreviewMap = {
  alert: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert>
        <AlertTitle>Đã cài 4 item</AlertTitle>
        <AlertDescription>Chạy `pnpm tsc --noEmit` trước khi commit.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Ghi đè file đã sửa</AlertTitle>
        <AlertDescription>
          `data-table.tsx` có thay đổi cục bộ. Xem diff trước khi đồng ý.
        </AlertDescription>
      </Alert>
    </div>
  ),

  dialog: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Mở hộp thoại</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phát hành item ra registry công khai</DialogTitle>
          <DialogDescription>
            Chuyển một item từ nội bộ sang công khai sau khi đã publish coi như đã lộ. Cần hai người
            duyệt.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Để sau</Button>
          <Button>Gửi duyệt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),

  "alert-dialog": () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Gỡ item khỏi registry</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gỡ `@aurecook/data-table`?</AlertDialogTitle>
          <AlertDialogDescription>
            Repo nào đang cài item này sẽ không cập nhật được nữa. Việc gỡ không hoàn tác được.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction>Gỡ item</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),

  sheet: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Mở panel bộ lọc</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bộ lọc nâng cao</SheetTitle>
          <SheetDescription>
            Điều kiện lọc ghi vào URL — chia sẻ link là người nhận thấy đúng khung nhìn này.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),

  skeleton: () => (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  ),

  sonner: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" onClick={() => toast.success("Đã cài 4 item")}>
        Thành công
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.error("Không kết nối được registry")}
      >
        Lỗi
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.info("Có bản mới của @aurecook/tokens")}
      >
        Thông tin
      </Button>
    </div>
  ),

  "empty-states": () => (
    <div className="grid gap-8 py-2 md:grid-cols-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <EmptyListIllustration label="Chưa có dữ liệu" className="max-w-[13rem]" />
        <p className="text-sm font-medium">Chưa có item nào</p>
        <p className="max-w-xs text-xs leading-5 text-muted-foreground">
          Thêm item đầu tiên vào `registry/radix-mira/` rồi chạy `pnpm registry:build`.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ),
};
