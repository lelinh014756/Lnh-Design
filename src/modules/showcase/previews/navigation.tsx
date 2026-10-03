"use client";

import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { PreviewMap } from "./types";

export const navigationPreviews: PreviewMap = {
  tabs: function TabsPreview() {
    const [value, setValue] = useState("preview");
    return (
      <Tabs value={value} onValueChange={setValue} className="max-w-lg">
        <TabsList>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
          <TabsTrigger value="code">Mã nguồn</TabsTrigger>
          <TabsTrigger value="deps">Phụ thuộc</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="pt-4 text-sm text-muted-foreground">
          Khung xem trước chạy trong iframe, đổi viewport không tải lại demo.
        </TabsContent>
        <TabsContent value="code" className="pt-4 font-mono text-xs text-muted-foreground">
          pnpm dlx shadcn@latest add @aurecook/tabs
        </TabsContent>
        <TabsContent value="deps" className="pt-4 text-sm text-muted-foreground">
          Không có phụ thuộc registry nào.
        </TabsContent>
      </Tabs>
    );
  },

  "dropdown-menu": () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Hành động
          <ChevronRightIcon className="rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Item registry</DropdownMenuLabel>
        <DropdownMenuItem>Chép lệnh cài</DropdownMenuItem>
        <DropdownMenuItem>Mở registry JSON</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Gỡ khỏi registry</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),

  command: () => (
    <Command className="max-w-sm rounded-lg border">
      <CommandInput placeholder="Tìm component…" />
      <CommandList className="max-h-56">
        <CommandEmpty>Không có kết quả nào.</CommandEmpty>
        <CommandGroup heading="Component">
          <CommandItem>Button</CommandItem>
          <CommandItem>Data Table</CommandItem>
          <CommandItem>Sheet</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Token">
          <CommandItem>--primary</CommandItem>
          <CommandItem>--brand-secondary</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),

};
