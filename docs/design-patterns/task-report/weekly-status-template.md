# Báo Cáo Tuần: {DD-DD/MM/YYYY}

**Ngày báo cáo:** {DD/MM/YYYY}
**Phạm vi:** {Mô tả phạm vi tuần này}
**Trạng thái tổng thể:** {🟢/🟡/🟠/🔴} {Mô tả ngắn}

---

## Tóm Tắt Điều Hành

| Module | Tiến độ | Trạng thái | Cần BE |
|--------|---------|------------|--------|
| {Module 1} | {X%} | {✅/🟡/🟠/🔴} | {Mô tả hoặc "—"} |
| {Module 2} | {X%} | {✅/🟡/🟠/🔴} | {Mô tả hoặc "—"} |
| {Module 3} | {X%} | {✅/🟡/🟠/🔴} | {Mô tả hoặc "—"} |

---

## 1. Đã Hoàn Thành

### ✅ {Module Name}
- **Tiến độ:** {X%}
- **Giao diện:** {Mô tả ngắn}
- **Kết nối:** {Mô tả ngắn}

### ✅ {Module Name}
- {Tương tự}

---

## 2. Đang Thực Hiện (Gần Hoàn Thành)

### 🟡 {Module Name} — {X%}
**Cần BE:** {Mô tả}

| Tính năng | Trạng thái |
|------------|------------|
| {Tính năng 1} | ✅ Hoàn thành |
| {Tính năng 2} | ⚠️ Cần chỉnh |
| {Tính năng 3} | ⏳ Chưa bắt đầu |

---

## 3. Cần Trao Đổi Với BE

### 🔴 {Module Name} — {X%}
- **Phạm vi:** {Mô tả}
- **Tình trạng:** {Mô tả hiện trạng}
- **Cần:**
  - {Yêu cầu 1}
  - {Yêu cầu 2}

### 🟠 {Module Name}
- **Vấn đề:** {Mô tả}
- **Ảnh hưởng:** {Mô tả}

---

## 4. Kế Hoạch Tuần này

### Ưu Tiên 1: {Mô tả}
- {Hạng mục 1}
- {Hạng mục 2}

### Ưu Tiên 2: {Mô tả}
- {Hạng mục 1}

### Ưu Tiên 3: {Mô tả}
- {Hạng mục 1}

---

## 5. Blockers

| Blocker | Mức độ | Ảnh hưởng |
|---------|--------|-----------|
| {Mô tả} | {🔴/🟠/🟡} | {Mô tả} |

---

## 6. Câu Hỏi Chưa Giải Quyết

1. {Câu hỏi 1}
2. {Câu hỏi 2}

---

## Quy Tắc Viết Báo Cáo Tuần

### Cấu trúc bắt buộc

1. **Tóm Tắt Điều Hành** — bảng 4 cột: Module, Tiến độ, Trạng thái, Cần BE
2. **1. Đã Hoàn Thành** — các module/tính năng đã xong trong tuần
3. **2. Đang Thực Hiện** — các module gần xong, còn mối quan tâm
4. **3. Cần Trao Đổi Với BE** — các vấn đề cần phối hợp với backend
5. **4. Kế Hoạch Tuần Tới** — ưu tiên cho tuần tiếp theo
6. **5. Blockers** — các rào cản đang ảnh hưởng
7. **6. Câu Hỏi** — các vấn đề chưa được giải quyết

### Ngôn ngữ và văn phong

| Nên dùng | Tránh dùng |
|-----------|------------|
| "Cần BE cung cấp API" | "Pending backend API" |
| "Đang dùng dữ liệu mẫu" | "Using mock data" |
| "Chờ spec từ BE" | "Waiting on spec from backend" |
| "Kết nối API" | "Integration layer" |
| "Giao diện đã hoàn thiện" | "UI is done" |
| "Sẵn sàng sử dụng" | "Ready for production" |
| "Cần xác nhận" | "Need confirmation" |
| "Phụ thuộc backend" | "Backend-dependent" |
| "Đang xác minh" | "Being verified" |

### Icon trạng thái

| Icon | Màu | Ý nghĩa |
|------|-----|---------|
| ✅ | Xanh | Hoàn thành, sẵn sàng |
| 🟡 | Vàng | Đang làm, có vấn đề nhỏ |
| 🟠 | Cam | Đang làm, có vấn đề trung bình |
| 🔴 | Đỏ | Chờ/bị block hoàn toàn |
| ⏳ | Xám | Chưa bắt đầu, chờ gì đó |

### Tiến độ %

| Ngưỡng | Trạng thái |
|--------|------------|
| 100% | ✅ Hoàn thành |
| 81-99% | 🟡 Gần xong |
| 51-80% | 🟡 Đang làm |
| 21-50% | 🟠 Đang làm |
| 0-20% | 🔴 Giai đoạn đầu |

### Nguyên tắc viết

- **Ngắn gọn:** Mỗi mục tối đa 1-2 dòng mô tả
- **Đi thẳng vào vấn đề:** Không có phần mở đầu, giới thiệu
- **Dễ quét (scan):** Dùng bảng, icon, bullet points
- **Rõ ràng về blockers:** Ai cần làm gì, deadline là khi nào
- **Không kỹ thuật quá:** Dùng ngôn ngữ nghiệp vụ

---

## 7. Kết Luận

### Tổng quan tuần

- **{Số} module hoàn thành:** {Tên modules}
- **{Số} modules đang dở:** {Tên + % các modules}
- **{Số} module bị block:** {Tên + % + lý do}
- **{Số} blockers chính từ BE:** {Mô tả}

### Mục tiêu tuần này

**Đẩy nhanh tiến độ để kịp thời hạn review cho sếp.**

Ưu tiên tuyệt đối: hoàn thiện các modules còn lại trước deadline. Các rào cản từ BE đã được ghi nhận — cần phối hợp gấp để không ảnh hưởng tiến độ tổng thể.

### Hành động cần thiết từ BE

| Ưu tiên | Yêu cầu | Ảnh hưởng |
|---------|----------|-----------|
| 🔴 Cao | {Yêu cầu 1} | {Mô tả} |
| 🟠 Trung | {Yêu cầu 2} | {Mô tả} |
| 🟡 Thấp | {Yêu cầu 3} | {Mô tả} |
