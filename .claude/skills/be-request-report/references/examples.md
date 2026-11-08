# Ví dụ: Report Content → báo cáo

Rút từ các yêu cầu thật đã gửi BE, viết lại theo template hiện hành. Một số yêu cầu BE đã làm xong; ví dụ chỉ minh hoạ khuôn. Với yêu cầu như vậy, bước 3 của quy trình (đối chiếu tài liệu API) sẽ thấy field đã có và báo user thay vì tạo báo cáo trùng.

## 1. `supplement` → `plans/reports/be-supplement-261015-1500-harvests-add-response-fields.md`

**Report Content:** `API List, GetById của harvests: thêm FarmName (Tên vườn), FarmerName (Tên Nông hộ), FarmerId (ID của Nông hộ) vào response.`

```markdown
# Yêu cầu BE: Bổ sung field vào response của API List, GetById harvests

> Tài liệu tham chiếu: `docs/api/api-harvests.md`

## Tóm tắt

FE cần bổ sung 3 field vào response data của 2 API harvests: **List** và **GetById**.

## API cần cập nhật

| Name    | Endpoint                    | Mô tả                    |
| ------- | --------------------------- | ------------------------ |
| List    | `GET /api/v1/harvests`      | Liệt kê phiếu thu hoạch  |
| GetById | `GET /api/v1/harvests/{id}` | Chi tiết phiếu thu hoạch |

## Field cần thêm vào response data

Áp dụng cho cả **List** (mỗi phần tử trong mảng) và **GetById**:

| Field        | Mô tả          |
| ------------ | -------------- |
| `FarmName`   | Tên vườn       |
| `FarmerName` | Tên Nông hộ    |
| `FarmerId`   | ID của Nông hộ |
```

## 2. `adjust` → `plans/reports/be-adjust-261005-1410-auth-getroles-code-name.md`

**Report Content:** `GetRoles (GET /api/v1/auth/roles): tách code và name. code = name hiện tại (Admin, CustomerAdministrator); name = nhãn tiếng Việt: Admin → Quản trị HTX, CustomerAdministrator → Quản trị khách hàng. Client đang đọc name sẽ bị đổi giá trị, FE sẽ đồng bộ khi BE deploy.`

```markdown
# Yêu cầu BE: Điều chỉnh RoleDto của API GetRoles

> Tài liệu tham chiếu: `docs/api/api-auth.md`

## Tóm tắt

FE cần điều chỉnh `RoleDto` của API auth **GetRoles**: tách `code` (mã hệ thống) và `name` (nhãn hiển thị tiếng Việt).

## API cần điều chỉnh

| Name     | Endpoint                 | Mô tả                                       |
| -------- | ------------------------ | ------------------------------------------- |
| GetRoles | `GET /api/v1/auth/roles` | Lấy danh sách tất cả vai trò trong hệ thống |

## Nội dung điều chỉnh

| Mục    | Hiện tại                         | Cần điều chỉnh                            |
| ------ | -------------------------------- | ----------------------------------------- |
| `code` | Chưa có                          | Thêm mới, giá trị = `name` hiện tại       |
| `name` | `Admin`, `CustomerAdministrator` | Nhãn tiếng Việt theo bảng ánh xạ bên dưới |

| `code`                  | `name`              |
| ----------------------- | ------------------- |
| `Admin`                 | Quản trị HTX        |
| `CustomerAdministrator` | Quản trị khách hàng |

## Ghi chú

- Client đang đọc `name` sẽ nhận giá trị mới; FE đồng bộ khi BE deploy.
```

## 3. `new` → `plans/reports/be-new-261005-1602-cooperatives-available-users.md`

**Report Content:** `Thêm GET /api/v1/cooperatives/{cooperativeId}/available-users để chọn user gắn vào HTX. Chỉ trả user chưa gắn HTX đó và có ít nhất 1 role Admin hoặc Manager. Admin gắn được nhiều HTX; Manager (không có Admin) chỉ gắn 1 HTX. Response: Id, UserName, FullName, Roles.`

```markdown
# Yêu cầu BE: Thêm API danh sách user có thể gán vào HTX

> File tài liệu cần bổ sung: `docs/api/api-cooperatives.md`

## Tóm tắt

FE cần thêm API `GET /api/v1/cooperatives/{cooperativeId}/available-users` để chọn user gắn vào HTX.

## Nghiệp vụ

| Quy tắc                    | Mô tả                                                 |
| -------------------------- | ----------------------------------------------------- |
| Lọc theo HTX               | Chỉ trả user chưa được gắn cho HTX đó                 |
| Lọc theo role              | Chỉ trả user có ít nhất 1 role `Admin` hoặc `Manager` |
| `Admin`                    | Có thể gắn cho **nhiều** HTX                          |
| `Manager` (không có Admin) | Chỉ được gắn cho **duy nhất 1** HTX                   |

## API cần thêm

| Endpoint                                                   | Mô tả                   |
| ---------------------------------------------------------- | ----------------------- |
| `GET /api/v1/cooperatives/{cooperativeId}/available-users` | User có thể gán vào HTX |

## Request

| Name            | In     | Type   | Required | Mô tả               |
| --------------- | ------ | ------ | -------- | ------------------- |
| `cooperativeId` | `path` | `Guid` | Có       | ID HTX cần gán user |

## Response

| Field      | Mô tả                   |
| ---------- | ----------------------- |
| `Id`       | ID người dùng           |
| `UserName` | Tên đăng nhập           |
| `FullName` | Họ tên                  |
| `Roles`    | Danh sách role của user |
```

## 4. `bug` → `plans/reports/be-bug-261008-1118-auth-getme-cooperatives-empty.md`

**Report Content:** `GET /api/v1/auth/me trả cooperatives: [] cho user đã được gán vào HTX qua POST /api/v1/cooperatives/{id}/users. User 11111111-1111-1111-1111-111111111111, HTX 22222222-2222-2222-2222-222222222222. Đã kiểm tra OK: POST và GET /cooperatives/{id}/users. Mong đợi: GetMe trả HTX đã gán.`

```markdown
# Báo lỗi BE: GetMe — cooperatives rỗng với user đã được gán HTX

> Tài liệu tham chiếu: `docs/api/api-auth.md`

## Tóm tắt

Khi user đã được gán vào HTX đăng nhập và gọi `GET /api/v1/auth/me`, BE trả `cooperatives: []` thay vì HTX đã gán.

## API ảnh hưởng

| Name  | Endpoint              | Mô tả                             |
| ----- | --------------------- | --------------------------------- |
| GetMe | `GET /api/v1/auth/me` | Lấy thông tin người dùng hiện tại |

## Hiện tượng

| Thực tế            | Mong đợi                    |
| ------------------ | --------------------------- |
| `cooperatives: []` | Trả HTX mà user đã được gán |

| API                                    | Kết quả                            |
| -------------------------------------- | ---------------------------------- |
| `POST /api/v1/cooperatives/{id}/users` | ✅ Gán user vào HTX thành công     |
| `GET /api/v1/cooperatives/{id}/users`  | ✅ Trả danh sách user trong HTX    |
| `GET /api/v1/auth/me`                  | ❌ Không trả HTX cho user được gán |

## Dữ liệu kèm theo

- User `11111111-1111-1111-1111-111111111111`, HTX `22222222-2222-2222-2222-222222222222`
```
