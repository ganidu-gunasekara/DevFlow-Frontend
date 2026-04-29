interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 650,
          color: "rgb(var(--muted))",
          letterSpacing: "0.01em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            fontSize: "11.5px",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
