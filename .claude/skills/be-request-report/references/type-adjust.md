# Loại `adjust` — Điều chỉnh API đã có

Dùng khi API đã tồn tại và user muốn **đổi** nó: đổi tên field, đổi kiểu, đổi giá trị trả về, đổi hành vi hoặc ràng buộc, bỏ field. Chỉ thêm mới → `supplement`.

## Thông tin cần

| Mục                                       | Mức      | Ghi chú                                                                                          |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| Resource + tên API                        | Bắt buộc | Xác thực ở tài liệu API                                                                          |
| Mục cần đổi (field, param, hành vi)       | Bắt buộc | Giữ nguyên tên                                                                                   |
| Cần điều chỉnh thành gì                   | Bắt buộc | Nguyên văn user                                                                                  |
| Hiện tại                                  | Tự điền  | Lấy **từ tài liệu API**; user nêu khác tài liệu → hỏi lại (xem `SKILL.md` → Thông tin còn thiếu) |
| Ảnh hưởng (breaking change, FE sẽ đổi gì) | Tuỳ chọn | Chỉ khi user nêu                                                                                 |

## Template

```markdown
# Yêu cầu BE: Điều chỉnh <mục> của <API> <resource>

> Tài liệu tham chiếu: `docs/api/api-{resource}.md`

## Tóm tắt

FE cần điều chỉnh <mục> của API <resource> **<Name>**.<— lý do nếu user nêu>

## API cần điều chỉnh

| Name   | Endpoint       | Mô tả   |
| ------ | -------------- | ------- |
| <Name> | `METHOD /path` | <mô tả> |

## Nội dung điều chỉnh

| Mục       | Hiện tại   | Cần điều chỉnh |
| --------- | ---------- | -------------- |
| `<Field>` | <hiện tại> | <mong muốn>    |

## Ghi chú

- <Ảnh hưởng do user nêu>
```

## Quy tắc riêng

- Cột _Hiện tại_ trích từ tài liệu API (kiểu, ví dụ giá trị, mô tả) và giữ nguyên chữ; không diễn giải hành vi mà tài liệu không ghi.
- Mỗi hàng là một thay đổi; thay đổi phụ thuộc nhau (vd đổi `name` kéo theo thêm `code`) ghi thành hàng riêng, theo thứ tự user nêu.
- Có bảng ánh xạ giá trị (vd `Admin` → "Quản trị HTX") thì chép đúng bảng của user, mỗi ánh xạ một hàng trong mục _Nội dung điều chỉnh_ hoặc một bảng con ngay sau nó.
- Bỏ mục _Ghi chú_ khi user không nêu ảnh hưởng nào.
