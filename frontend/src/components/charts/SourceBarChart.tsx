import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: any[]; height?: number; }

export function SourceBarChart({ data, height = 200 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={14} barGap={4} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, fontSize: 12, color: "#F9FAFB" }} />
        <Bar dataKey="scope1" name="SAP"     fill="#2563EB" radius={[4,4,0,0]} />
        <Bar dataKey="scope2" name="Utility" fill="#7C3AED" radius={[4,4,0,0]} />
        <Bar dataKey="scope3" name="Travel"  fill="#059669" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
