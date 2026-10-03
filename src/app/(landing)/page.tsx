import {
  LandingChannels,
  LandingCta,
  LandingHero,
  LandingProblem,
  LandingStats,
  LandingUsage,
} from "@/modules/landing/components";

/**
 * Trang chủ.
 *
 * Toàn bộ là Server Component: landing không có gì tương tác ngoài nút chép ở
 * các khối mã (đã tự là client), nên không có lý do đẩy phần còn lại sang
 * bundle client.
 */
export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingStats />
      <LandingProblem />
      <LandingChannels />
      <LandingUsage />
      <LandingCta />
    </>
  );
}
