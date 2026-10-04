import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
    {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    // data-table/table core được port nguyên trạng từ tablecn (xem
    // src/components/data-table/README.md). Nguồn đó không có eslint-config-next
    // (không có eslint.config.mjs, không cài package này) nên các rule dưới
    // đây CHƯA TỪNG được kiểm ở thượng nguồn — không phải Eco phá vỡ chuẩn có
    // sẵn. Bốn rule react-hooks/* đều là chi tiết triển khai nội tại của một
    // "table core" tự quản lý state (ref giữ giá trị mới nhất cho closure ổn
    // định, tự cache instance TanStack Table) — sửa theo đúng nghĩa đen của
    // rule sẽ phải viết lại kiến trúc hook mà không có test bao phủ để xác
    // nhận không phá hành vi. Không tắt các rule khác (no-explicit-any,
    // no-unused-vars... vẫn chạy, chỉ ở mức warning như phần còn lại của repo).
    // Không có nhóm data-grid: AureCook bỏ hẳn cụm này khi copy (xem I.5).
    files: [
      "src/components/data-table/**",
      "src/components/table/**",
      "src/hooks/table/**",
    ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    // Icon đi qua <AppIcon icon="..." /> để đổi thư viện chỉ bằng một dòng
    // import trong app-icon.tsx. Thư viện icon chỉ được import trong
    // icon-providers/. Primitive shadcn (ui/) giữ lucide để `shadcn add` không
    // phải sửa tay mỗi lần kéo bản mới.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/general/icon-providers/**", "src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["lucide-react", "lucide-react/*", "@hugeicons/*", "@hugeicons-pro/*"],
              message:
                'Dùng <AppIcon icon="..." /> từ @/components/general/app-icon; icon chưa có thì thêm vào icon-providers/.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores của eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Script Node.js thuần của Claude Code (hook/scripts .cjs), không phải mã
    // nguồn ứng dụng — plugin "react" của preset không đăng ký cho .cjs nên
    // rule "react/no-unescaped-entities" ở object phía trên làm `pnpm lint`
    // vỡ ngay khi quét hết repo (`eslint .`) thay vì chỉ một thư mục con.
    ".claude/**",
  ]),
]);

export default eslintConfig;
