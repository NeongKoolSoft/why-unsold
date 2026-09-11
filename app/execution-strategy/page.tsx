import ExecutionStrategyForm from "./execution-strategy-form";

export default function ExecutionStrategyPage() {
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
      </nav>

      <ExecutionStrategyForm />
    </main>
  );
}