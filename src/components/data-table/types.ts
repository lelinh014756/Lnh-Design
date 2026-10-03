import type { ColumnSort, Row, RowData } from "@tanstack/react-table";
import type { DataTableConfig } from "./config";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    queryKeys?: QueryKeys;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.ComponentType<React.ComponentProps<"svg">>;
  }
}

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.ComponentType<React.ComponentProps<"svg">>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

/**
 * Hình dạng một điều kiện lọc.
 *
 * Khai ở đây chứ không suy ra từ zod schema trong `lib/parsers.ts`: parser đó
 * thuộc lớp đồng bộ URL và là một registry item RIÊNG (`data-table-url`). Nếu
 * type nằm bên đó thì cài `data-table` một mình sẽ vỡ. Chiều phụ thuộc phải là
 * parser → type, không bao giờ ngược lại.
 */
export interface FilterItemSchema {
  id: string;
  value: string | string[];
  variant: FilterVariant;
  operator: FilterOperator;
  filterId: string;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}
