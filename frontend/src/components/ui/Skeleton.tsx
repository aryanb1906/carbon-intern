export function Skeleton({ w = "100%", h = 16, radius = 6 }: { w?: string | number; h?: number; radius?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: radius, background: "linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
  );
}
export function SkeletonCard() {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton h={14} w="40%" /><Skeleton h={28} w="60%" /><Skeleton h={12} w="30%" />
    </div>
  );
}
export function SkeletonRow() {
  return (
    <div style={{ display: "flex", gap: 16, padding: "12px 20px", borderBottom: "1px solid #F9FAFB", alignItems: "center" }}>
      {[120,80,80,60,60,60,50].map((w,i) => <Skeleton key={i} w={w} h={13} />)}
    </div>
  );
}
