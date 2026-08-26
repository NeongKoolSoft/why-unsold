import ExecutionStrategyForm from "./execution-strategy-form";
import PreviewSampleLauncher from "./preview-sample-launcher";

export default function ExecutionStrategyPage() {
  const allowPreviewSample =
    process.env.VERCEL_ENV ===
      "preview" ||
    process.env.NODE_ENV ===
      "development";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f2ea",
        color: "#17231d",
      }}
    >
      <nav
        style={{
          width: "min(1120px, calc(100% - 32px))",
          minHeight: 80,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          borderBottom: "1px solid #ccd3ce",
        }}
        aria-label="실행전략 메뉴"
      >
        <a
          href="/"
          style={{
            color: "#17231d",
            fontSize: 16,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          왜 안 팔릴까
        </a>

        <span
          style={{
            padding: "5px 9px",
            border: "1px solid #0b684d",
            borderRadius: 999,
            color: "#0b684d",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          V2 PREVIEW
        </span>
      </nav>

      {allowPreviewSample && (
        <PreviewSampleLauncher />
      )}

      <ExecutionStrategyForm />
    </main>
  );
}