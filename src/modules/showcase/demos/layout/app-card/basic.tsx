"use client";

import { AppCard } from "@/components/layout/app-card";
import { Button } from "@/components/ui/button";

/** Header nhận `title` chuỗi hoặc node; `action` nằm bên phải cùng hàng. */
export default function AppCardBasic() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AppCard title="Thông tin hợp đồng">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Mã</dt>
          <dd>HD-2048</dd>
          <dt className="text-muted-foreground">Khách hàng</dt>
          <dd>Công ty Mẫu</dd>
          <dt className="text-muted-foreground">Hiệu lực</dt>
          <dd>01/06/2026 – 31/05/2027</dd>
        </dl>
      </AppCard>

      <AppCard
        title="Ghi chú nội bộ"
        action={
          <Button variant="outline" size="sm">
            Thêm ghi chú
          </Button>
        }
      >
        <p className="text-sm leading-6 text-muted-foreground">
          Không có header thì card chỉ còn phần thân — bỏ cả `title` lẫn `action` là cách dùng hợp lệ.
        </p>
      </AppCard>
    </div>
  );
}
