import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: { name: string; value: number; color: string }[]; height?: number; }

export function ScopeDonutChart({ data, height = 180 }: Props) {
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" strokeWidth={0}>
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, fontSize: 12, color: "#F9FAFB" }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {data.map(s => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ fontSize: 12, color: "#6B7280" }}>{s.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </>
  );
}
