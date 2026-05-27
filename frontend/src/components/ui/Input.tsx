import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, style, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {label && (
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>
        )}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {prefix && (
            <span style={{ position: "absolute", left: 11, color: "#9CA3AF", display: "flex", alignItems: "center", pointerEvents: "none" }}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            style={{
              width: "100%",
              padding: prefix ? "9px 12px 9px 34px" : suffix ? "9px 34px 9px 12px" : "9px 12px",
              border: `1px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
              borderRadius: 7,
              fontSize: 13,
              color: "#111827",
              background: props.disabled ? "#F9FAFB" : "#FFFFFF",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color .15s",
              ...style,
            }}
            onFocus={e => (e.target.style.borderColor = error ? "#EF4444" : "#2563EB")}
            onBlur={e  => (e.target.style.borderColor = error ? "#FCA5A5" : "#E5E7EB")}
            {...props}
          />
          {suffix && (
            <span style={{ position: "absolute", right: 11, color: "#9CA3AF", display: "flex", alignItems: "center", pointerEvents: "none" }}>
              {suffix}
            </span>
          )}
        </div>
        {error && <p style={{ fontSize: 11, color: "#DC2626" }}>{error}</p>}
        {hint && !error && <p style={{ fontSize: 11, color: "#9CA3AF" }}>{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, style, ...props }: SelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>}
      <select
        style={{
          width: "100%", padding: "9px 12px",
          border: `1px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
          borderRadius: 7, fontSize: 13, color: "#111827",
          background: "#FFFFFF", fontFamily: "inherit",
          outline: "none", cursor: "pointer", ...style,
        }}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p style={{ fontSize: 11, color: "#DC2626" }}>{error}</p>}
    </div>
  );
}
