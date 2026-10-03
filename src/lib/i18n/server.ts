/**
 * Barrel dành riêng cho Server Components.
 * Tách khỏi `./index` vì các export ở đây phụ thuộc `next/headers`,
 * nếu để chung barrel sẽ kéo API server vào client bundle.
 */
export { getDictionary } from "./get-dictionary";
export {
  getLocaleFromCookie,
} from "./get-locale-from-cookie";
