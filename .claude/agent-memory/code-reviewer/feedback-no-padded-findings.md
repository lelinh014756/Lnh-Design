---
name: feedback-no-padded-findings
description: Review report chỉ nêu vấn đề thật có thể gây lỗi runtime; không bịa finding cho đủ số, nói thẳng khi sạch.
metadata:
  type: feedback
---

Báo cáo review phải ưu tiên vấn đề thật sự gây lỗi runtime hơn góp ý style. Nếu không tìm thấy vấn đề nghiêm trọng thì nói thẳng "không có", tuyệt đối không thêm finding cho đủ số lượng.

**Why:** User yêu cầu rõ trong lần review module plots — report dài với finding vụn vặt làm loãng tín hiệu, khiến bug thật bị chìm.

**How to apply:** Mỗi finding phải trace được tới một kịch bản hỏng cụ thể (đường đi của user, dữ liệu biên, lỗi API) kèm `file:line` đã tự xác minh. Finding không trace được thì bỏ, hoặc gom xuống mục thấp nhất và ghi rõ là không chặn. Luôn tự chạy `pnpm tsc --noEmit` + `npx eslint <scope>` để chốt baseline thay vì suy đoán. Xem thêm [[feedback-opt-in-via-callback-presence]].
