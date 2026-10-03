/**
 * Taxonomy `src/components` theo Ant Design — bảy nhóm.
 *
 * `ui/` KHÔNG nằm trong bảy nhóm: đó là tầng primitive shadcn, thứ Ant Design
 * không có tương đương. Bảy nhóm dưới đây là tầng component CẤP APP dựng trên
 * primitive, và cũng chính là `categories` mà catalog gán cho từng registry item.
 *
 *   general       Nút, toggle, phím tắt, tiêu đề
 *   layout        Khung trang, thẻ, lưới, thanh công cụ
 *   navigation    Menu, tab, breadcrumb, điều hướng đệ quy
 *   data-entry    Ô nhập, chọn, công tắc, lịch
 *   data-display  Bảng, biểu đồ, badge, avatar
 *   feedback      Dialog, toast, skeleton, trạng thái rỗng
 *   other         Provider và tiện ích không thuộc nhóm nào
 *
 * Không re-export toàn bộ từ file này: một barrel gốc kéo mọi component vào
 * cùng một đồ thị module, và bundler mất khả năng cắt bớt thứ không dùng. Import
 * theo nhóm — `@/components/general` — hoặc theo file cụ thể.
 */
export {};
