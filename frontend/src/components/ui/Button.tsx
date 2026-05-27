import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const VARIANTS: Record<Variant, { bg: string; color: string; border: string; hoverBg: string }> = {
  primary:   { bg: "#2563EB", color: "#fff",    border: "none",                 hoverBg: "#1D4ED8" },
  secondary: { bg: "#fff",    color: "#374151", border: "1px solid #E5E7EB",    hoverBg: "#F9FAFB" },
  ghost:     { bg: "transparent", color: "#6B7280", border: "none",             hoverBg: "#F3F4F6" },
  danger:    { bg: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA",    hoverBg: "#FEE2E2" },
  success:   { bg: "#16A34A", color: "#fff",    border: "none",                 hoverBg: "#15803D" },
};

const SIZES: Record<Size, { padding: string; fontSize: number; height: number }> = {
  sm: { padding: "0 10px", fontSize: 12, height: 30 },
  md: { padding: "0 14px", fontSize: 13, height: 34 },
  lg: { padding: "0 20px", fontSize: 14, height: 40 },
};

export function Button({
  variant = "primary", size = "md", loading = false,
  icon, children, disabled, style, ...props
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 6, height: s.height, padding: s.padding,
        background: v.bg, color: v.color, border: v.border,
        borderRadius: 7, fontSize: s.fontSize, fontWeight: 600,
        fontFamily: "inherit", cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1, transition: "background .1s, opacity .1s",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={e => { if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = v.hoverBg; }}
      onMouseLeave={e => { if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.background = v.bg; }}
    >
      {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : icon}
      {children}
    </button>
  );
}
