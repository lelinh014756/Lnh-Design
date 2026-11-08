# Loại `bug` — Báo lỗi API

Dùng khi API **đã có** nhưng chạy sai: trả lỗi (4xx/5xx), trả thiếu/sai dữ liệu, hành vi khác tài liệu. Muốn đổi hành vi theo ý FE (không phải lỗi) → `adjust`.

## Thông tin cần

| Mục                                                               | Mức      | Ghi chú                                                                                                                                                               |
| ----------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API bị lỗi (resource + endpoint)                                  | Bắt buộc | Xác thực ở tài liệu API; user chưa rõ endpoint → hỏi                                                                                                                  |
| Hiện tượng thực tế                                                | Bắt buộc | Nguyên văn: status, thông báo, dữ liệu sai                                                                                                                            |
| Kết quả mong đợi                                                  | Bắt buộc | Của user. User không nêu mà tài liệu API ghi rõ response cho trường hợp đó → dùng tài liệu, thêm "(theo tài liệu API)" và báo user ở bước 7; tài liệu không ghi → hỏi |
| Dữ liệu kèm: TraceId, request, response, ID liên quan, môi trường | Tuỳ chọn | Chép nguyên văn                                                                                                                                                       |
| Cách tái hiện (các bước)                                          | Tuỳ chọn | Chỉ khi user nêu                                                                                                                                                      |
| Mức độ (Severity)                                                 | Tuỳ chọn | Chỉ khi user nêu                                                                                                                                                      |
| Nhận định nguyên nhân của user                                    | Tuỳ chọn | Ghi dưới nhãn "Nhận định của FE"                                                                                                                                      |

## Template

````markdown
# Báo lỗi BE: <API/resource> — <hiện tượng ngắn>

> Tài liệu tham chiếu: `docs/api/api-{resource}.md`

**Severity:** <chỉ khi user nêu>

## Tóm tắt

Khi <thao tác/API>, BE trả <thực tế> thay vì <mong đợi>.

## API ảnh hưởng

| Name   | Endpoint       | Mô tả   |
| ------ | -------------- | ------- |
| <Name> | `METHOD /path` | <mô tả> |

## Hiện tượng

| Thực tế   | Mong đợi   |
| --------- | ---------- |
| <thực tế> | <mong đợi> |

## Cách tái hiện

1. <bước>

## Dữ liệu kèm theo

- TraceId: `<traceId>`
- Request: `<METHOD /path>` + body/param (nguyên văn)

```json
<response nguyên văn>
```

## Nhận định của FE

<nguyên ý user>
````

## Quy tắc riêng

- Chép nguyên văn mọi giá trị user đưa (TraceId, GUID, message, JSON); sai một ký tự là BE không tra được log.
- Mục _Hiện tượng_ ghi **sự việc quan sát được**. Nguyên nhân và cách sửa chỉ xuất hiện trong _Nhận định của FE_ khi user tự nêu.
- User liệt kê API đã kiểm tra là đúng/sai → đưa vào _Hiện tượng_ dạng bảng `API | Kết quả` (✅ / ❌), vì đây là thông tin khoanh vùng lỗi giúp BE.
- Bỏ các mục không có thông tin: _Severity_, _Cách tái hiện_, _Dữ liệu kèm theo_, _Nhận định của FE_.
- Dữ liệu nhạy cảm (token, mật khẩu) user dán vào → thay bằng `<đã ẩn>` và báo user ở bước 7.
