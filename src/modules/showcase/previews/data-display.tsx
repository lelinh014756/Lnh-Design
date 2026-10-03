"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { PreviewMap } from "./types";

const ROWS = [
  { code: "HTX-014", name: "Hợp tác xã Tân Phú", area: "12,4 ha", status: "Đang hoạt động" },
  { code: "HTX-021", name: "Hợp tác xã Bình Minh", area: "8,1 ha", status: "Chờ duyệt" },
  { code: "HTX-033", name: "Hợp tác xã An Khê", area: "21,7 ha", status: "Tạm ngưng" },
];

export const dataDisplayPreviews: PreviewMap = {
  badge: () => (
    <div className="flex flex-wrap items-center gap-2.5">
      <Badge>Mặc định</Badge>
      <Badge variant="secondary">Nháp</Badge>
      <Badge variant="outline">Lưu trữ</Badge>
      <Badge variant="destructive">Quá hạn</Badge>
      <Badge variant="secondary" className="rounded-4xl">
        <span className="mr-1.5 size-1.5 rounded-full bg-primary" />
        Đang chạy
      </Badge>
    </div>
  ),

  card: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Sản lượng tháng 8</CardTitle>
        <CardDescription>Tổng hợp từ 14 vùng trồng đang hoạt động.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums tracking-tight">128,4 tấn</p>
        <p className="mt-1 text-sm text-muted-foreground">Tăng 6,2% so với tháng trước.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  ),

  avatar: () => (
    <div className="flex items-center gap-6">
      <Avatar>
        <AvatarImage src="/images/avatar-placeholder.png" alt="" />
        <AvatarFallback>LH</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {["LH", "TN", "PV", "QA"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  ),

  table: () => (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead className="text-right">Diện tích</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.code}>
              <TableCell className="font-mono text-xs">{row.code}</TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-right tabular-nums">{row.area}</TableCell>
              <TableCell>
                <Badge variant="secondary">{row.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),

  accordion: () => (
    <Accordion type="single" collapsible defaultValue="a" className="max-w-lg">
      <AccordionItem value="a">
        <AccordionTrigger>Cài một component thì kéo theo những gì?</AccordionTrigger>
        <AccordionContent>
          CLI đọc `registryDependencies` rồi cài đệ quy, cộng thêm gói npm khai trong
          `dependencies`. Bạn không phải tự lần theo cây phụ thuộc.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Cài đè lên file mình đã sửa thì sao?</AccordionTrigger>
        <AccordionContent>
          CLI hỏi trước khi ghi đè. Xem diff rồi mới quyết định — đừng bấm đồng ý theo phản xạ.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Đổi màu thương hiệu ở đâu?</AccordionTrigger>
        <AccordionContent>
          Trong `@aurecook/tokens`. Component thì copy được, còn token thì khoá version.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),

  collapsible: () => (
    <Collapsible className="max-w-md">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Xem 3 phụ thuộc registry
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 flex flex-col gap-1.5 rounded-lg border p-3 font-mono text-xs">
        <span>@aurecook/table-core</span>
        <span>@aurecook/table-chrome</span>
        <span>@aurecook/action-bar</span>
      </CollapsibleContent>
    </Collapsible>
  ),

  tooltip: () => (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Trỏ vào đây
            </Button>
          </TooltipTrigger>
          <TooltipContent>Item này chỉ phát hành nội bộ</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),

  popover: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Tuỳ chọn cột
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <p className="text-sm font-medium">Hiển thị cột</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Lựa chọn lưu theo từng người dùng, không theo từng phiên.
        </p>
      </PopoverContent>
    </Popover>
  ),
};
