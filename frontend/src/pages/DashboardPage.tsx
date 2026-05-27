import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { MetricCard, SectionCard } from "../components/ui/Card";
import { SkeletonCard, SkeletonRow } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { StatusBadge, ScopeBadge } from "../components/ui/Badge";
import { EmissionsAreaChart } from "../components/charts/EmissionsAreaChart";
import { ScopeDonutChart }   from "../components/charts/ScopeDonutChart";
import { SourceBarChart }    from "../components/charts/SourceBarChart";
import { useDashboard }      from "../hooks/useDashboard";
import { formatCO2e, formatNumber, timeAgo } from "../utils/formatters";

const MOCK_MONTHLY = [
  { month:"Jan",scope1:380,scope2:220,scope3:540 },{ month:"Feb",scope1:420,scope2:198,scope3:610 },
  { month:"Mar",scope1:395,scope2:240,scope3:580 },{ month:"Apr",scope1:450,scope2:210,scope3:620 },
  { month:"May",scope1:410,scope2:230,scope3:590 },{ month:"Jun",scope1:480,scope2:255,scope3:670 },
  { month:"Jul",scope1:460,scope2:235,scope3:640 },{ month:"Aug",scope1:440,scope2:215,scope3:615 },
  { month:"Sep",scope1:395,scope2:205,scope3:572 },{ month:"Oct",scope1:420,scope2:225,scope3:600 },
  { month:"Nov",scope1:435,scope2:240,scope3:632 },{ month:"Dec",scope1:470,scope2:260,scope3:680 },
];
const SCOPE_PIE = [
  { name:"Scope 1 · Direct",value:35,color:"#2563EB" },
  { name:"Scope 2 · Electricity",value:22,color:"#7C3AED" },
  { name:"Scope 3 · Value Chain",value:43,color:"#059669" },
];
const MOCK_RECORDS = [
  { id:"REC-001",source:"SAP Fuel",category:"Natural Gas",facility:"Berlin HQ",amount:12500,unit:"kWh",scope:1,status:"approved",co2e:2.28,created_at:new Date(Date.now()-7200000).toISOString() },
  { id:"REC-002",source:"Utility Bills",category:"Electricity",facility:"Munich Plant",amount:45000,unit:"kWh",scope:2,status:"pending",co2e:18.45,created_at:new Date(Date.now()-14400000).toISOString() },
  { id:"REC-003",source:"Travel Data",category:"Air Travel",facility:"Corporate",amount:8,unit:"flights",scope:3,status:"flagged",co2e:7.44,created_at:new Date(Date.now()-21600000).toISOString() },
  { id:"REC-004",source:"SAP Fuel",category:"Diesel",facility:"Hamburg Depot",amount:3200,unit:"liters",scope:1,status:"approved",co2e:8.54,created_at:new Date(Date.now()-86400000).toISOString() },
  { id:"REC-005",source:"Utility Bills",category:"Natural Gas",facility:"Frankfurt Office",amount:9800,unit:"kWh",scope:2,status:"rejected",co2e:0,created_at:new Date(Date.now()-172800000).toISOString() },
];

export function DashboardPage() {
  const { stats, loading } = useDashboard();

  const metrics = [
    { label:"Total Records",      value: loading ? "—" : formatNumber(stats?.total_records  ?? 8432), change:12.4,  icon:<FileText size={15}/>,      iconColor:"#2563EB", iconBg:"#EFF6FF" },
    { label:"Pending Review",     value: loading ? "—" : formatNumber(stats?.pending_count  ?? 147),  change:-8.2,  icon:<Clock size={15}/>,          iconColor:"#D97706", iconBg:"#FEF3C7" },
    { label:"Approved Records",   value: loading ? "—" : formatNumber(stats?.approved_count ?? 7981), change:14.1,  icon:<CheckCircle size={15}/>,    iconColor:"#16A34A", iconBg:"#DCFCE7" },
    { label:"Flagged / Rejected", value: loading ? "—" : formatNumber((stats?.flagged_count ?? 156) + (stats?.rejected_count ?? 148)), change:-3.5, icon:<AlertTriangle size={15}/>, iconColor:"#DC2626", iconBg:"#FEE2E2" },
  ];

  return (
    <div style={{ padding: 26 }}>
      {/* KPI row */}
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        {loading ? [1,2,3,4].map(i => <div key={i} style={{flex:1}}><SkeletonCard /></div>) : metrics.map(m => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* CO2e total banner */}
      {!loading && (
        <div style={{ background:"linear-gradient(135deg,#1E3A5F,#2563EB)", borderRadius:12, padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:500, marginBottom:4 }}>Total tCO₂e — Approved Records FY 2024</p>
            <p style={{ fontSize:30, fontWeight:700, color:"#FFF", letterSpacing:"-0.5px" }}>{formatCO2e(stats?.total_co2e ?? 14210)}</p>
          </div>
          <div style={{ display:"flex", gap:24 }}>
            {[{label:"Scope 1",val:stats?.scope1_co2e??4974},{label:"Scope 2",val:stats?.scope2_co2e??3126},{label:"Scope 3",val:stats?.scope3_co2e??6110}].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}>
                <p style={{fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:4}}>{s.label}</p>
                <p style={{fontSize:16,fontWeight:700,color:"#FFF"}}>{formatCO2e(s.val)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:14, marginBottom:20 }}>
        <div style={{ background:"#FFF", border:"1px solid #E5E7EB", borderRadius:12, padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Emissions Over Time</h3>
              <p style={{ fontSize:12, color:"#9CA3AF" }}>Monthly tCO₂e — FY 2024</p>
            </div>
            <div style={{ display:"flex", gap:14 }}>
              {[["Scope 1","#2563EB"],["Scope 2","#7C3AED"],["Scope 3","#059669"]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8,height:8,borderRadius:2,background:c }} />
                  <span style={{ fontSize:11,color:"#6B7280" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <EmissionsAreaChart data={stats?.monthly_trend?.length ? stats.monthly_trend : MOCK_MONTHLY} />
        </div>
        <div style={{ background:"#FFF", border:"1px solid #E5E7EB", borderRadius:12, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:3 }}>Scope Distribution</h3>
          <p style={{ fontSize:12, color:"#9CA3AF", marginBottom:14 }}>FY 2024 breakdown</p>
          <ScopeDonutChart data={SCOPE_PIE} />
        </div>
      </div>

      {/* Volume chart + activity */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:14, marginBottom:20 }}>
        <div style={{ background:"#FFF", border:"1px solid #E5E7EB", borderRadius:12, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:3 }}>Monthly Ingestion Volume</h3>
          <p style={{ fontSize:12, color:"#9CA3AF", marginBottom:18 }}>Records by source · Last 6 months</p>
          <SourceBarChart data={MOCK_MONTHLY.slice(-6)} />
        </div>
        <div style={{ background:"#FFF", border:"1px solid #E5E7EB", borderRadius:12, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#111827", marginBottom:14 }}>Quick Stats</h3>
          {[
            { label:"Avg risk score",   value:"0.34", color:"#D97706" },
            { label:"AI flags (30d)",   value:"23",   color:"#7C3AED" },
            { label:"Avg review time",  value:"4.2h", color:"#2563EB" },
            { label:"Auto-approved",    value:"61%",  color:"#059669" },
            { label:"Data quality",     value:"94%",  color:"#16A34A" },
          ].map(s=>(
            <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #F9FAFB" }}>
              <span style={{ fontSize:13,color:"#6B7280" }}>{s.label}</span>
              <span style={{ fontSize:14,fontWeight:700,color:s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent records table */}
      <div style={{ background:"#FFF", border:"1px solid #E5E7EB", borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid #F3F4F6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Recent Records</h3>
            <p style={{ fontSize:12, color:"#9CA3AF", marginTop:1 }}>Latest ingested emission entries</p>
          </div>
          <span style={{ fontSize:12, color:"#9CA3AF" }}>5 of {formatNumber(stats?.total_records ?? 8432)}</span>
        </div>
        {loading ? [1,2,3].map(i=><SkeletonRow key={i}/>) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #F3F4F6" }}>
                {["Source","Category","Facility","Amount","Scope","CO₂e","Status","Time"].map(h=>(
                  <th key={h} style={{ padding:"9px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_RECORDS.map((r,i)=>(
                <tr key={r.id} style={{ borderBottom:i<4?"1px solid #F9FAFB":"none" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#FAFAFA"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"11px 18px", fontSize:13, fontWeight:600, color:"#374151" }}>{r.source}</td>
                  <td style={{ padding:"11px 18px", fontSize:13, color:"#6B7280" }}>{r.category}</td>
                  <td style={{ padding:"11px 18px", fontSize:13, color:"#6B7280" }}>{r.facility}</td>
                  <td style={{ padding:"11px 18px", fontSize:12, color:"#374151", fontFamily:"monospace" }}>{r.amount.toLocaleString()} {r.unit}</td>
                  <td style={{ padding:"11px 18px" }}><ScopeBadge scope={r.scope} /></td>
                  <td style={{ padding:"11px 18px", fontSize:12, color:"#374151", fontFamily:"monospace" }}>{r.co2e}t</td>
                  <td style={{ padding:"11px 18px" }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding:"11px 18px", fontSize:12, color:"#9CA3AF" }}>{timeAgo(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
