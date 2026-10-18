# Loại `supplement` — Bổ sung field/param vào API đã có

Dùng khi API đã tồn tại và user muốn **thêm** field vào response data hoặc param vào request. Đổi/bỏ cái đã có → `adjust`.

## Thông tin cần

| Mục                                     | Mức                | Ghi chú                                               |
| --------------------------------------- | ------------------ | ----------------------------------------------------- |
| Resource + tên API (`List`, `GetById`…) | Bắt buộc           | Xác thực ở tài liệu API                               |
| Tên field hoặc param cần thêm           | Bắt buộc           | Giữ nguyên hoa/thường                                 |
| Param: `In`, `Type`, `Required`         | Bắt buộc với param | Thiếu → hỏi user; BE không thêm được param thiếu kiểu |
| Field: kiểu dữ liệu                     | Tuỳ chọn           | Chỉ khi user nêu                                      |
| Lý do / use case                        | Tuỳ chọn           | Chỉ khi user nêu; ghi sau dấu `—` ở Tóm tắt           |

## Template

```markdown
# Yêu cầu BE: Bổ sung <field|param> vào <API List/GetById…> <resource>

> Tài liệu tham chiếu: `docs/api/api-{resource}.md`

## Tóm tắt

FE cần bổ sung <n> <field|param> vào <response data|request> của <n> API <resource>: **<Name>** và **<Name>**.<— lý do nếu user nêu>

## API cần cập nhật

| Name   | Endpoint       | Mô tả   |
| ------ | -------------- | ------- |
| <Name> | `METHOD /path` | <mô tả> |

## Field cần thêm vào response data

Áp dụng cho cả **<Name>** (<mỗi phần tử trong mảng>) và **<Name>**:

| Field     | Mô tả   |
| --------- | ------- |
| `<Field>` | <mô tả> |

## Param cần thêm vào request

| Name      | In      | Type    | Required | Mô tả   |
| --------- | ------- | ------- | -------- | ------- |
| `<param>` | `query` | `Guid?` | Không    | <mô tả> |
```

## Quy tắc riêng

- Giữ **một** trong hai mục _Field_ / _Param_, hoặc cả hai khi user nêu cả hai; mục không dùng thì bỏ.
- Câu "Áp dụng cho cả…" chỉ giữ khi có từ hai API trở lên; phần trong ngoặc theo cấu trúc response ở tài liệu API (mảng, `Data`…).
- Mô tả field: cụm danh từ ngắn, theo bảng thuật ngữ ở `SKILL.md` (vd `FarmName` → "Tên vườn").
- Cột `Type` của param viết như tài liệu API (`Guid?`, `int`, `string`); `Required` viết "Có" / "Không".
