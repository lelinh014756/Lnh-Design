/** Hướng đọc của bảng. Khai tại đây thay vì import từ nơi khác: cụm bảng phải
 *  tự chứa để cài được sang repo trống. */
export type Direction = "ltr" | "rtl";

/**
 * Shared table core types.
 *
 * These mirror the Material React Table option surface — the parts MRT adds on
 * top of TanStack Table — so a screen written against MRT reads the same here.
 *
 * Three deliberate deviations from MRT:
 *   1. Column renderers stay lowercase (`cell` / `header` / `footer`). MRT
 *      capitalizes them only to avoid colliding with TanStack's own keys; we
 *      *are* TanStack, so there is nothing to collide with.
 *   2. `mui*Props` become `slotProps.*`. Same `object | (ctx) => object` shape,
 *      no MUI.
 *   3. `sx` tokens become Tailwind classes.
 */

import type {
  Cell,
  Column,
  ColumnDef,
  Header,
  Row,
  RowData,
  TableOptions,
  TableState,
  Table as TanstackTable,
} from "@tanstack/react-table";

// ─── Display columns ─────────────────────────────────────────────────────────

/**
 * Ids of the columns the core injects. Mirrors MRT's `mrt-row-*` namespace.
 *
 * These are a **public API**: user column layout preferences are persisted by
 * id, so renaming one silently invalidates stored settings.
 */
export const DISPLAY_COLUMN_IDS = {
  select: "dt-row-select",
  numbers: "dt-row-numbers",
  expand: "dt-row-expand",
  actions: "dt-row-actions",
} as const;

export type DisplayColumnId =
  (typeof DISPLAY_COLUMN_IDS)[keyof typeof DISPLAY_COLUMN_IDS];

export const DISPLAY_COLUMN_ID_LIST = Object.values(
  DISPLAY_COLUMN_IDS,
) as DisplayColumnId[];

export function getIsDisplayColumn(
  columnId: string,
): columnId is DisplayColumnId {
  return (DISPLAY_COLUMN_ID_LIST as string[]).includes(columnId);
}

// ─── Presentation ────────────────────────────────────────────────────────────

export type Density = "compact" | "comfortable" | "spacious";

/**
 * `semantic` renders real `<table>` markup (better a11y and printing).
 * `grid` renders CSS grid — required for virtualization, used by the data grid.
 */
export type LayoutMode = "semantic" | "grid";

export type ColumnAlign = "start" | "center" | "end";

// ─── Extra state ─────────────────────────────────────────────────────────────

/** State MRT owns that TanStack Table has no concept of. */
export interface TableExtraState {
  density: Density;
  isFullScreen: boolean;
  showColumnFilters: boolean;
  showGlobalFilter: boolean;
  showAlertBanner: boolean;
  showSkeletons: boolean;
  showProgressBars: boolean;
  isLoading: boolean;
}

export type TableCoreState = TableState & TableExtraState;

// ─── Slot props ──────────────────────────────────────────────────────────────

export type SlotProp<TContext, TProps> =
  | TProps
  | ((context: TContext) => TProps);

/**
 * Element-agnostic attribute bag. The two renderers mount slots on different
 * elements (semantic `<thead>` / `<td>` vs. CSS-grid `<div>`), so this stays
 * ref-free rather than pinning one element type.
 */
export type SlotElementProps = React.HTMLAttributes<HTMLElement>;

type TableContext<TData> = { table: TanstackTable<TData> };

export interface TableSlotProps<TData> {
  paper?: SlotProp<TableContext<TData>, SlotElementProps>;
  container?: SlotProp<TableContext<TData>, SlotElementProps>;
  topToolbar?: SlotProp<TableContext<TData>, SlotElementProps>;
  bottomToolbar?: SlotProp<TableContext<TData>, SlotElementProps>;
  head?: SlotProp<TableContext<TData>, SlotElementProps>;
  headRow?: SlotProp<TableContext<TData>, SlotElementProps>;
  headCell?: SlotProp<
    TableContext<TData> & { header: Header<TData, unknown> },
    SlotElementProps
  >;
  body?: SlotProp<TableContext<TData>, SlotElementProps>;
  bodyRow?: SlotProp<
    TableContext<TData> & { row: Row<TData> },
    SlotElementProps
  >;
  bodyCell?: SlotProp<
    TableContext<TData> & { cell: Cell<TData, unknown> },
    SlotElementProps
  >;
  footer?: SlotProp<TableContext<TData>, SlotElementProps>;
  footerRow?: SlotProp<TableContext<TData>, SlotElementProps>;
  footerCell?: SlotProp<
    TableContext<TData> & { header: Header<TData, unknown> },
    SlotElementProps
  >;
}

export function resolveSlotProp<TContext, TProps>(
  slot: SlotProp<TContext, TProps> | undefined,
  context: TContext,
): TProps | undefined {
  if (typeof slot === "function") {
    return (slot as (context: TContext) => TProps)(context);
  }
  return slot;
}

// ─── Localization ────────────────────────────────────────────────────────────

/**
 * Toàn bộ chuỗi hiển thị của cụm bảng.
 *
 * Nhóm lồng theo đúng thành phần tiêu thụ chúng (`pagination`, `filters`,
 * `settings`…) chứ không phẳng: tên khoá trùng nhau giữa các nhóm là chuyện
 * bình thường — `trigger` có mặt ở bốn nhóm — và phẳng hoá buộc phải bịa tiền
 * tố để phân biệt.
 *
 * Đây là NGUỒN CHUỖI DUY NHẤT của cụm. Item registry mang sẵn bản `en` và `vi`
 * nên cài vào một repo trống là chạy được, không đòi repo đó phải có từ điển.
 */
export interface TableLocalization {
  excelActions: {
    trigger: string;
    title: string;
    downloadTemplate: string;
    importFile: string;
    importSuccess: string;
    importFailure: string;
    importInvalidType: string;
    importTooLarge: string;
    importHeaderMissing: string;
    templateDownloadFailure: string;
  };
  pagination: {
    goToFirstPage: string;
    goToLastPage: string;
    goToNextPage: string;
    goToPreviousPage: string;
    totalItems: string;
    pageOf: string;
    rowsPerPage: string;
  };
  density: {
    density: string;
    densityCompact: string;
    densityComfortable: string;
    densitySpacious: string;
    toggleDensity: string;
  };
  filter: {
    showHideFilters: string;
    clearFilter: string;
    clearFilters: string;
    filterByColumn: string;
  };
  sort: {
    sortByColumnAsc: string;
    sortByColumnDesc: string;
    clearSort: string;
  };
  search: {
    search: string;
    clearSearch: string;
    showHideSearch: string;
    noResultsFound: string;
  };
  column: {
    hideColumn: string;
    pinToLeft: string;
    pinToRight: string;
    unpin: string;
    hideAll: string;
    showAll: string;
    asc: string;
    desc: string;
    reset: string;
    noColumnsFound: string;
    searchColumns: string;
    toggleColumns: string;
  };
  selection: {
    selectAll: string;
    selectRow: string;
    rowsSelected: string;
  };
  display: {
    select: string;
    rowNumber: string;
    expand: string;
    actions: string;
  };
  fullscreen: {
    trigger: string;
    exit: string;
  };
  actionBar: {
    export: string;
    rowsSelected: string;
    exportFailed: string;
  };
  empty: {
    noRecordsToDisplay: string;
  };
  progressBar: {
    loading: string;
  };
  filters: {
    trigger: string;
    title: string;
    description: string;
    apply: string;
    clear: string;
    close: string;
    filter: string;
    filters: string;
    noFiltersApplied: string;
    selectJoinOperator: string;
    resetAllFilters: string;
    openFilterCommandMenu: string;
    clearFilterTrigger: string;
    trueValue: string;
    falseValue: string;
  };
  dateFilter: {
    selectDate: string;
    selectDateRange: string;
    clearFilterTrigger: string;
  };
  facetedFilter: {
    noResultsFound: string;
    clearFilters: string;
    selected: string;
    clearFilterTrigger: string;
  };
  settings: {
    trigger: string;
    title: string;
    behavior: string;
    multiRowSelection: string;
    summaryFooter: string;
    infiniteScroll: string;
    columnLayout: string;
    colOrder: string;
    colName: string;
    columnWidth: string;
    columnVisibility: string;
    pinLeft: string;
    pinRight: string;
    locked: string;
    dragColumn: string;
    resetColumnLayout: string;
    apply: string;
    clear: string;
  };
}

// ─── Core options ────────────────────────────────────────────────────────────

export interface TableCoreOptions<TData extends RowData>
  extends Omit<TableOptions<TData>, "getCoreRowModel" | "state"> {
  /** Partial override of both TanStack state and the extra MRT-style state. */
  state?: Partial<TableCoreState>;
  initialState?: Partial<TableCoreState>;

  // Display columns
  enableRowSelection?: TableOptions<TData>["enableRowSelection"];
  enableRowNumbers?: boolean;
  enableRowActions?: boolean;
  positionActionsColumn?: "first" | "last";
  renderRowActions?: (context: {
    row: Row<TData>;
    table: TanstackTable<TData>;
  }) => React.ReactNode;

  // Detail panel
  renderDetailPanel?: (context: {
    row: Row<TData>;
    table: TanstackTable<TData>;
  }) => React.ReactNode;
  positionExpandColumn?: "first" | "last";

  // Pagination
  enablePagination?: boolean;
  pageSizeOptions?: number[];

  // Toolbars
  enableTopToolbar?: boolean;
  enableBottomToolbar?: boolean;
  enableToolbarInternalActions?: boolean;
  enableDensityToggle?: boolean;
  enableFullScreenToggle?: boolean;
  enableColumnVisibilityToggle?: boolean;
  enableColumnFilterToggle?: boolean;
  enableTableSettings?: boolean;
  /**
   * Thay hẳn top toolbar mặc định. Dùng khi màn hình tự dựng toolbar riêng
   * nhưng vẫn muốn nó nằm trong vùng fullscreen của bảng.
   */
  renderTopToolbar?: (context: {
    table: TanstackTable<TData>;
  }) => React.ReactNode;
  renderTopToolbarCustomActions?: (context: {
    table: TanstackTable<TData>;
  }) => React.ReactNode;
  renderBottomToolbarCustomActions?: (context: {
    table: TanstackTable<TData>;
  }) => React.ReactNode;
  renderToolbarAlertBannerContent?: (context: {
    table: TanstackTable<TData>;
  }) => React.ReactNode;

  // Presentation
  layoutMode?: LayoutMode;
  /** Kẻ đường lưới dọc giữa các cột, giống data-grid. */
  enableColumnBorders?: boolean;
  enableStickyHeader?: boolean;
  /**
   * Hiện hàng tổng hợp ở chân bảng. Mặc định `true` — khi đó footer vẫn chỉ
   * xuất hiện nếu có ít nhất một cột khai `footer`, nên bật sẵn không gây ảnh
   * hưởng gì.
   *
   * TÁCH RIÊNG với `enableStickyFooter`: cái này quyết định CÓ footer hay
   * không, cái kia chỉ quyết định footer có dính đáy khi cuộn hay không. Nối
   * một công tắc "hiện dòng tổng hợp" vào `enableStickyFooter` là không có
   * tác dụng gì — đó chỉ đổi cách định vị của thứ vốn đã không hiển thị.
   */
  enableSummaryFooter?: boolean;
  enableStickyFooter?: boolean;
  renderEmptyRowsFallback?: (context: {
    table: TanstackTable<TData>;
  }) => React.ReactNode;

  // Dòng đang mở ở panel chi tiết (master-detail)
  /**
   * Khoá của dòng đang xem chi tiết. Core lo phần tô đậm: nền dòng, nền các ô
   * ĐANG GHIM (ô ghim buộc nền đặc nên không ăn được nền alpha của `<tr>`) và
   * gạch dọc primary ở ô đầu tiên. Tự làm lại ở từng màn hình rất dễ sai ba
   * chỗ đó, nên gom vào đây.
   *
   * Mặc định so với `row.id` (tức `getRowId`). Nếu màn hình lưu khoá theo
   * trường khác — vd `?selected=NV0003` theo `code` — thì khai thêm
   * `getRowActiveKey` chứ đừng đổi `getRowId`, vì `getRowId` còn là khoá của
   * `rowSelection`/`expanded` và đổi nó kéo theo cả hai.
   */
  activeRowId?: string | number | null;
  /**
   * Lấy khoá đem so với `activeRowId`. Mặc định `row.id`.
   *
   *   getRowActiveKey: (row) => row.original.code
   */
  getRowActiveKey?: (row: Row<TData>) => string | number | null | undefined;
  /** Click vào một dòng bất kỳ (trừ vùng checkbox chọn dòng). */
  onRowClick?: (context: {
    row: Row<TData>;
    table: TanstackTable<TData>;
  }) => void;

  // Trạng thái tải
  /**
   * Đang tải dữ liệu. Core tự suy ra hai state hiển thị từ đây:
   *   `showProgressBars` — luôn bật khi đang tải
   *   `showSkeletons`    — chỉ khi CHƯA có dòng nào để hiển thị
   *
   * Tách như vậy vì `isLoading` bật lại ở MỌI lần tải (đổi trang, gõ tìm
   * kiếm...) trong khi `data` vẫn giữ trang cũ tới lúc trang mới về — nếu
   * skeleton ăn thẳng theo `isLoading` thì bảng nhấp nháy xoá sạch dòng đang
   * có mỗi lần chuyển trang. Truyền thẳng `state.showSkeletons` để ghi đè.
   */
  isLoading?: boolean;

  // Cuộn vô hạn
  /**
   * Bật cuộn vô hạn: container tự lắng nghe scroll và gọi `onFetchMore` khi
   * gần chạm đáy. Core cũng tự tắt pagination + bottom toolbar theo.
   */
  enableInfiniteScroll?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchMore?: () => void;
  /** Còn cách đáy bao nhiêu px thì nạp tiếp. Mặc định 400. */
  infiniteScrollThreshold?: number;

  /** Prefixes generated DOM ids so two tables on one page stay a11y-correct. */
  idPrefix?: string;

  localization?: Partial<TableLocalization>;
  slotProps?: TableSlotProps<TData>;
}

export type DataTableInstance<TData extends RowData> = TanstackTable<TData>;

export type DataTableColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<TData, TValue>;

export type DataTableColumn<TData extends RowData> = Column<TData, unknown>;

// ─── Column meta extensions ──────────────────────────────────────────────────

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    /**
     * Số thứ tự người dùng NHÌN THẤY của một dòng, khác `row.index` khi bảng
     * đang lọc/sắp xếp/phân trang. Cột chọn dòng hiện số này thay vì chỉ số
     * nội bộ — người dùng đối chiếu với thứ tự trên màn hình, không phải với
     * thứ tự trong mảng dữ liệu.
     */
    getVisualRowIndex?: (rowId: string) => number | undefined;
    /**
     * Chọn dòng có biết tới phím Shift. Đi qua meta chứ không qua
     * `row.toggleSelected` vì chọn theo khoảng cần biết dòng neo trước đó —
     * thông tin nằm ở nơi gọi, không nằm trong từng dòng.
     */
    onRowSelect?: (rowId: string, checked: boolean, shiftKey: boolean) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    /** Horizontal alignment for head, body and footer cells. */
    align?: ColumnAlign;
    /** Absorb leftover horizontal space, mirroring MRT's `grow`. */
    grow?: boolean;
    /**
     * Giá trị dùng khi xuất file, cho những cột mà `row.getValue()` không trả
     * ra được thứ có nghĩa:
     *
     *   - Cột KHÔNG có `accessorKey`/`accessorFn` (cột ghép từ nhiều trường,
     *     vd Email = email công ty + email cá nhân) — `getValue` trả
     *     `undefined`, xuất ra ô rỗng.
     *   - Cột lưu mã nhưng hiển thị nhãn (vd `staffStatusId: 2` hiện "Tạm
     *     nghỉ") — không có hàm này thì file xuất ra toàn số, người đọc không
     *     hiểu.
     *
     * Trả `Date` để Excel nhận đúng kiểu ngày (lọc/sắp xếp được), trả `number`
     * để còn tính tổng — đừng tự `String()` nếu không thật sự cần.
     */
    exportValue?: (row: Row<TData>) => unknown;
  }
}
