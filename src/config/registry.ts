import { siteConfig } from "@/config/site"

/**
 * Định danh registry phía app. Phải khớp `REGISTRY_NAME` trong
 * `scripts/registry-builder/config.mjs`: builder ghi `registryDependencies`
 * theo đúng hai namespace này, còn trang docs hiển thị chúng cho repo khách.
 */
export const REGISTRY_NAMESPACE = "@lnhdesign"
export const REGISTRY_INTERNAL_NAMESPACE = "@lnhdesign-x"

/** Biến môi trường phía repo khách chứa token của registry nội bộ. */
export const REGISTRY_TOKEN_ENV = "LNHDESIGN_TOKEN"

const registryOrigin = siteConfig.url.replace(/\/$/, "")

/** URL mẫu khai trong `components.json` của repo khách; CLI tự điền `{name}`. */
export const REGISTRY_PUBLIC_URL = `${registryOrigin}/r/{name}.json`
export const REGISTRY_INTERNAL_URL = `${registryOrigin}/r/internal/{name}.json`