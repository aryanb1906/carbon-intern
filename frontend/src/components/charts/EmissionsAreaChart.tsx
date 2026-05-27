import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: { month: string; scope1: number; scope2: number; scope3: number }[]; height?: number; }

const TIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1F2937", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ color: "#9CA3AF", marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, color: "#F9FAFB" }}>
          <div style={{ width: 7, height: 7, borderRadius: 2, background: p.color }} />
          <span>{p.name}: <strong>{p.value} tCO₂e</strong></span>
        </div>
      ))}
    </div>
  );
};

export function EmissionsAreaChart({ data, height = 220 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <defs>
          {[["g1","#2563EB"],["g2","#7C3AED"],["g3","#059669"]].map(([id,c]) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={c} stopOpacity={0.13} />
              <stop offset="95%" stopColor={c} stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <Tooltip content={<TIP />} />
        <Area type="monotone" dataKey="scope1" name="Scope 1" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" dot={false} />
        <Area type="monotone" dataKey="scope2" name="Scope 2" stroke="#7C3AED" strokeWidth={2} fill="url(#g2)" dot={false} />
        <Area type="monotone" dataKey="scope3" name="Scope 3" stroke="#059669" strokeWidth={2} fill="url(#g3)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
