---
name: roadmap-standardizer
description: "Đọc một file roadmap bất kỳ (bảng tóm tắt + chi tiết, checklist, Now/Next/Later, danh sách phẳng) và chuẩn hoá thành Markdown canonical cho trang công khai /roadmap: viết lại bằng tiếng Việt phổ thông cho mọi người đọc hiểu, gom đầu việc kỹ thuật thành tính năng, không bịa trạng thái/ngày/tiến độ. Kèm validator dùng chính parser của UI. Dùng khi: 'chuẩn hoá roadmap', 'cập nhật roadmap công khai', 'convert roadmap sang format chuẩn', có roadmap nguồn mới (ví dụ docs/roadmap.md của BE)."
version: 2.0.0
argument-hint: "<đường-dẫn-roadmap-nguồn> [--out <đường-dẫn>] [--title \"<tiêu đề>\"] [--verbatim]"
---

# Roadmap Standardizer

Chuyển một roadmap nguồn (thường viết cho đội kỹ thuật) thành file chuẩn mà trang `/roadmap` render trực tiếp, viết cho hợp tác xã, nông hộ, đối tác đọc hiểu. Kèm báo cáo chuyển đổi có bảng truy vết: mỗi tính năng trên trang ← những dòng nào của nguồn.

## Khi nào dùng

- Có roadmap nguồn mới/đã đổi và cần cập nhật trang công khai (ví dụ `…/ECO-FARM-BE/docs/roadmap.md`).
- Cần kiểm tra một roadmap có đúng định dạng chuẩn không (chỉ chạy bước 6).

## Khi nào KHÔNG dùng

- Viết roadmap mới từ ý tưởng (skill này không bịa nội dung) → viết tay theo đặc tả hoặc dùng `/an-plan`.
- Sửa giao diện trang roadmap → code tại `src/modules/roadmap/`.
- Gộp nhiều roadmap thành một → hỏi chủ sở hữu trước; skill chuẩn hoá từng file.

## Tài liệu cần đọc (theo thứ tự)

1. `docs/public-roadmap-format.md` — đặc tả đích: heading, metadata, trạng thái, ngày, task.
2. `references/conversion-rules.md` — nguồn viết kiểu X thì ghi thành gì; danh sách không-công-khai; khung báo cáo.
3. `references/examples/` — ba cặp vào/ra: `01-table-and-details` (kèm `.report.md`), `02-flat-list`, `03-now-next-later`.

## Đầu vào / đầu ra

| | Mặc định |
|---|---|
| Nguồn | tham số đầu tiên (bắt buộc; hỏi nếu thiếu) |
| Đích | `src/modules/roadmap/content/public-roadmap.md` — đúng file mà trang `/roadmap` đọc. `--out` để ghi chỗ khác (ví dụ khi thử) |
| Tiêu đề H1 | tên sản phẩm dễ hiểu (không dùng tên repo); `--title` để chỉ định |
| Lời văn | tiếng Việt phổ thông, gom thành tính năng (conversion-rules mục 4). `--verbatim` để giữ nguyên văn kỹ thuật (bản nội bộ, mục 4b) |

Đích mặc định là **nội dung công khai**: trước khi ghi đè file đang có, đọc nó (`git diff` sẽ cho thấy thay đổi) và nói với người dùng nếu bản mới làm mất mục đang hiển thị.

## Quy trình

### 1. Đọc hết nguồn
Đọc toàn bộ file nguồn, không chỉ phần đầu. Ghi nhận: có bảng tóm tắt không, section chi tiết dùng cấp heading nào, trạng thái viết bằng chữ hay emoji, ngày nằm ở đâu, có phần không phải roadmap (issues, references, changelog).

### 2. Lập bản kiểm kê
Liệt kê trong đầu (hoặc ghi nháp, không commit): phase → item → group → task, kèm trạng thái/ngày/tiến độ **kèm số dòng nguồn**. Đánh dấu ngay những chỗ nguồn mâu thuẫn hoặc đặt tên khác nhau giữa bảng và section chi tiết.

### 3. Ánh xạ theo `references/conversion-rules.md`
Áp bảng nhận diện cấu trúc (mục 1), từ vựng trạng thái (mục 2), ngày (mục 3). Rồi viết theo mục 4: mỗi giai đoạn một tên dễ hiểu + một câu mô tả + 3–7 tính năng; gom đầu việc kỹ thuật thành tính năng và **ghi lại bảng Trace ngay khi gom** (tính năng ← số dòng nguồn). Tính năng chỉ `[x]` khi mọi dòng nguồn của nó đã `[x]`.

### 4. Loại nội dung không công khai
Áp mục 6 của conversion-rules: Known Issues, SHA commit, đường dẫn/ticket nội bộ, References nội bộ… Mọi thứ bỏ đều phải xuất hiện ở "Omitted" của báo cáo.

### 5. Ghi file chuẩn
Dùng Write ghi file đích theo đặc tả. Không dùng heredoc trong Bash cho nội dung roadmap (hook của repo có thể chặn một số từ trong lệnh).

### 6. Kiểm tra
```bash
node .claude/skills/roadmap-standardizer/scripts/validate-roadmap.mjs <file-đích>
```
- 0 lỗi là bắt buộc. Lỗi → sửa file rồi chạy lại, lặp đến khi hết.
- Cảnh báo `completed nhưng còn task chưa tick` thường là sự thật của nguồn: **giữ nguyên**, đưa vào báo cáo.
- Cảnh báo thiếu `Status` → đúng khi nguồn không nói; không điền cho đủ.
- Script dùng parser thật của UI (`src/modules/roadmap/lib/roadmap-parser.ts`), cần Node ≥ 22.18 (`.nvmrc` = 24).

### 7. Kiểm tra độ trung thực
Làm đủ mục 8 của `conversion-rules.md`: bảng Trace phủ hết dòng nguồn (gom + bỏ = tổng), không tick hộ, đọc lại như người không làm phần mềm. Với `--verbatim`: `diff` từng dòng task — phải giống hệt chữ và thứ tự.

### 8. Báo cáo
Trả báo cáo theo khung ở mục 7 của conversion-rules (Trace / Mapped / Omitted / Name conflicts / Source inconsistencies / Missing / Questions). Mục trống ghi "—". Không lưu báo cáo vào repo trừ khi người dùng yêu cầu (nếu có: `plans/reports/`).

## Quy tắc cứng

1. **Không bịa.** Không tự điền `Status`, `Progress`, ngày, intro; không tính phần trăm từ checklist; không đổi `W4–W11`/`Q3` thành ngày.
2. **Không sửa cho đẹp.** Nguồn mâu thuẫn thì giữ nguyên và báo, không tick hộ, không đổi trạng thái cho khớp.
3. **Viết lại lời, giữ nguyên sự thật.** Lời văn cho mọi người đọc hiểu; trạng thái, ngày, việc nào đã xong phải truy được về nguồn. Không thổi phồng ("tự động", "tức thì") nếu nguồn không nói. (`--verbatim`: giữ nguyên văn từng dòng.)
4. **Không công khai thứ nội bộ.** Mặc định bỏ mục 6; chỉ giữ khi người dùng nói rõ.
5. **Mơ hồ → để trống và hỏi/báo**, không đoán. Ánh xạ nào dựa trên diễn giải (ví dụ `Now` → `in-progress`) phải ghi ở "Mapped".
6. **Không đụng parser/UI** trong lúc chuẩn hoá. Nếu nguồn cần cấu trúc mà đặc tả chưa có (ví dụ trạng thái `cancelled`), báo cáo là câu hỏi; mở rộng đặc tả là việc riêng (sửa đồng thời parser, i18n VI+EN, skill và `docs/public-roadmap-format.md`).

## Sau khi ghi file

- Dev: mở `/roadmap/` trên `pnpm dev` (cổng 3005); file được đọc lại mỗi request. Số liệu "Tổng quan tiến độ" phải khớp con số validator in ra.
- Deploy: commit file; `scripts/deploy.sh` khởi động lại pm2 nên kết quả parse được cache lại từ đầu.

## Kiểm thử skill

```bash
node --test .claude/skills/roadmap-standardizer/tests/validate-examples.test.mjs
```
Chạy validator trên mọi `examples/*.output.md` và file công khai hiện tại, và kiểm một số trường hợp lỗi cố ý (trạng thái sai, ngày sai, cấp heading sai). Chạy lại sau khi sửa parser hoặc đặc tả.

## Ví dụ gọi

```
/roadmap-standardizer /Users/lehonglinh/Documents/DIP/Source/BE/ECO-FARM-BE/docs/roadmap.md
```

Kết quả mong đợi: ghi `src/modules/roadmap/content/public-roadmap.md` gồm 5 giai đoạn, mỗi giai đoạn một câu mô tả và vài tính năng tiếng Việt; validator 0 lỗi; báo cáo có bảng Trace, liệt kê mã nội bộ/tuần W/Known Issues/commit SHA đã bỏ và cảnh báo "Truy xuất nguồn gốc chuyển sang giai đoạn sau" được giữ nguyên theo nguồn.

```
/roadmap-standardizer /Users/lehonglinh/Documents/DIP/Source/BE/ECO-FARM-BE/docs/roadmap.md --verbatim --out /tmp/roadmap-noi-bo.md
```

Bản kỹ thuật giữ nguyên văn để đội nội bộ xem, không đụng trang công khai.
