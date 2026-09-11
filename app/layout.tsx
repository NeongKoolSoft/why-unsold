import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "아파트 매도 진단 | 왜 안 팔릴까?",
  description:
    "매도 전 가격 진단부터 매도 중 정체 원인 분석, 진단 후 30일 실행전략까지 단계별로 제공합니다.",
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
      <body>
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EPC6RCJZH4"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EPC6RCJZH4');
          `}
        </Script>
      </body>
    </html>
  );
}