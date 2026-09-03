import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "왜 안 팔릴까? | 아파트 매도 정체 진단",
  description:
    "최근 실거래와 거래 공백을 분석해 아파트가 팔리지 않는 가장 가능성 높은 이유를 알려드립니다.",
  other: {
    "codex-preview": "development",
    "naver-site-verification":
      "46103ce8979d70ab1d6252c2d913a3cd9a5b6392",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}