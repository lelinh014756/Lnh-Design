# Loại `new` — Thêm API mới

Dùng khi endpoint **chưa tồn tại** trong tài liệu API. Đã có endpoint nhưng thiếu field/param → `supplement`.

## Thông tin cần

| Mục                                          | Mức      | Ghi chú                                                                                                                                                        |
| -------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Method + đường dẫn endpoint                  | Bắt buộc | Nguyên văn user; thiếu → hỏi                                                                                                                                   |
| Mục đích / nghiệp vụ                         | Bắt buộc | 1–2 câu, nguyên ý user                                                                                                                                         |
| Resource (để chọn file tài liệu cần bổ sung) | Bắt buộc | Xác thực file `api-{resource}.md` có tồn tại                                                                                                                   |
| Tên API (`Name`)                             | Tuỳ chọn | Của user; chưa có thì dùng tên chuẩn của BE docs (`List`, `GetById`, `Create`, `Update`, `Delete`, `BulkDelete`) khi khớp rõ ràng, nếu không thì bỏ cột `Name` |
| Quy tắc nghiệp vụ                            | Tuỳ chọn | Chỉ khi user nêu                                                                                                                                               |
| Request: `Name`, `In`, `Type`, `Required`    | Tuỳ chọn | Hỏi lại nếu user nêu param mà thiếu kiểu                                                                                                                       |
| Response: field hoặc JSON mẫu                | Tuỳ chọn | JSON user đưa → giữ nguyên                                                                                                                                     |

## Template

````markdown
# Yêu cầu BE: Thêm API <tên ngắn>

> File tài liệu cần bổ sung: `docs/api/api-{resource}.md`

## Tóm tắt

FE cần thêm API `METHOD /path` để <mục đích user nêu>.

## Nghiệp vụ

| Quy tắc   | Mô tả   |
| --------- | ------- |
| <quy tắc> | <mô tả> |

## API cần thêm

| Name   | Endpoint       | Mô tả   |
| ------ | -------------- | ------- |
| <Name> | `METHOD /path` | <mô tả> |

## Request

| Name      | In     | Type   | Required | Mô tả   |
| --------- | ------ | ------ | -------- | ------- |
| `<param>` | `path` | `Guid` | Có       | <mô tả> |

## Response

```json
<JSON mẫu của user>
```
````

## Quy tắc riêng

- Chỉ giữ các mục có thông tin; _Nghiệp vụ_, _Request_, _Response_ đều có thể bỏ.
- Quy tắc nghiệp vụ là **kết quả** BE cần đảm bảo (vd "chỉ trả user chưa gán cho HTX này"). Các bước xử lý, truy vấn, thứ tự kiểm tra là việc của BE nên không ghi.
- Response chỉ có danh sách field → dùng bảng `Field | Mô tả` thay cho JSON.
- Dòng _Tóm tắt_ dùng đúng method + đường dẫn user nêu, kể cả khi khác convention của BE docs; muốn đề xuất đường dẫn khác thì báo user ở bước 7, vì quyết định đó thuộc user.
