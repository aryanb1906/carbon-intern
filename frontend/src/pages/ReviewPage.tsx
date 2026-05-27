import { useState, useMemo } from "react";
import { Search, Download, X, Check, Eye, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatusBadge, RiskBadge, ScopeBadge, SourceTypeBadge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

const RECORDS = [
  { id:"REC-001",source:"sap",category:"Natural Gas",date:"2024-01-15",facility:"Berlin HQ",amount:12500,unit:"kWh",normalized:4.21,scope:1,status:"approved",risk:"low",co2e:2.28,ef:0.000182,flags:[] },
  { id:"REC-002",source:"utility",category:"Electricity",date:"2024-01-16",facility:"Munich Plant",amount:45000,unit:"kWh",normalized:45.0,scope:2,status:"pending",risk:"medium",co2e:18.45,ef:0.000295,flags:["Consumption 20% above baseline"] },
  { id:"REC-003",source:"travel",category:"Air Travel",date:"2024-01-17",facility:"Corporate",amount:8,unit:"flights",normalized:12400,scope:3,status:"flagged",risk:"high",co2e:7.44,ef:0.000930,flags:["Value 3.8σ above facility baseline","No traveler ID provided"] },
  { id:"REC-004",source:"sap",category:"Diesel",date:"2024-01-18",facility:"Hamburg Depot",amount:3200,unit:"liters",normalized:3.2,scope:1,status:"approved",risk:"low",co2e:8.54,ef:2.640,flags:[] },
  { id:"REC-005",source:"utility",category:"Natural Gas",date:"2024-01-19",facility:"Frankfurt Office",amount:9800,unit:"kWh",normalized:9.8,scope:2,status:"rejected",risk:"high",co2e:0,ef:0.000182,flags:["Duplicate entry — overlapping billing period","Meter ID mismatch"] },
  { id:"REC-006",source:"travel",category:"Hotel",date:"2024-01-20",facility:"Corporate",amount:24,unit:"nights",normalized:24.0,scope:3,status:"pending",risk:"low",co2e:2.88,ef:0.120,flags:[] },
  { id:"REC-007",source:"sap",category:"Petrol",date:"2024-01-21",facility:"Berlin HQ",amount:1800,unit:"liters",normalized:1.8,scope:1,status:"approved",risk:"low",co2e:4.23,ef:2.310,flags:[] },
  { id:"REC-008",source:"utility",category:"Electricity",date:"2024-01-22",facility:"Munich Plant",amount:67000,unit:"kWh",normalized:67.0,scope:2,status:"flagged",risk:"high",co2e:27.47,ef:0.000295,flags:["Value 4.2σ above baseline — investigate before approving"] },
  { id:"REC-009",source:"travel",category:"Rail",date:"2024-01-23",facility:"Corporate",amount:14,unit:"trips",normalized:8200,scope:3,status:"approved",risk:"low",co2e:0.41,ef:0.000041,flags:[] },
  { id:"REC-010",source:"sap",category:"LPG",date:"2024-01-24",facility:"Stuttgart Lab",amount:520,unit:"kg",normalized:0.52,scope:1,status:"pending",risk:"medium",co2e:1.56,ef:2.983,flags:["Non-standard unit mapping applied"] },
];

const PAGE_SIZE = 8;

export function ReviewPage() {
  const [data,    setData]   = useState(RECORDS);
  const [tab,     setTab]    = useState("all");
  const [q,       setQ]      = useState("");
  const [sel,     setSel]    = useState<typeof RECORDS[0]|null>(null);
  const [page,    setPage]   = useState(1);

  const filtered = useMemo(() => data.filter(r => {
    if (tab !== "all" && r.status !== tab) return false;
    const s = q.toLowerCase();
    return !s || [r.source,r.category,r.facility,r.id].some(v=>v.toLowerCase().includes(s));
  }), [data, tab, q]);

  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const counts = useMemo(() => ({
    all: data.length, pending: data.filter(r=>r.status==="pending").length,
    flagged: data.filter(r=>r.status==="flagged").length,
    approved: data.filter(r=>r.status==="approved").length,
    rejected: data.filter(r=>r.status==="rejected").length,
  }), [data]);

  const act = (id: string, status: string) => {
    setData(prev => prev.map(r => r.id===id ? {...r, status, risk: status==="approved"?"low":r.risk} : r));
    if (sel?.id === id) setSel(prev => prev ? {...prev, status} : null);
  };

  const TABS = [
    {id:"all",label:"All",count:counts.all},{id:"pending",label:"Pending",count:counts.pending},
    {id:"flagged",label:"Flagged",count:counts.flagged},{id:"approved",label:"Approved",count:counts.approved},
    {id:"rejected",label:"Rejected",count:counts.rejected},
  ];

  return (
    <div style={{ padding:26 }}>
      {/* Filter bar */}
      <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:16,borderBottom:"1px solid #E5E7EB",paddingBottom:12,flexWrap:"wrap" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setPage(1);}} style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",background:tab===t.id?"#111827":"transparent",color:tab===t.id?"white":"#6B7280",fontSize:13,fontWeight:tab===t.id?700:500,transition:"all .1s" }}>
            {t.label}
            <span style={{ padding:"0 5px",borderRadius:100,fontSize:11,fontWeight:700,background:tab===t.id?"rgba(255,255,255,.2)":"#F3F4F6",color:tab===t.id?"white":"#6B7280" }}>{t.count}</span>
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 12px",border:"1px solid #E5E7EB",borderRadius:7,background:"#FFF" }}>
          <Search size={13} color="#9CA3AF"/>
          <input value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} placeholder="Filter records…" style={{ border:"none",outline:"none",fontSize:13,fontFamily:"inherit",color:"#374151",width:140 }}/>
          {q && <button onClick={()=>setQ("")} style={{ border:"none",background:"none",cursor:"pointer",padding:0,display:"flex" }}><X size={12} color="#9CA3AF"/></button>}
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={12}/>}>Export</Button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:sel?"1fr 340px":"1fr",gap:14 }}>
        {/* Table */}
        <Card noPad>
          <div style={{ overflowX:"auto" }}>
            {paged.length === 0 ? (
              <EmptyState title="No records found" description="Try adjusting your filters or search query."/>
            ) : (
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #F3F4F6",background:"#FAFAFA" }}>
                    {["ID","Source","Category","Date","Facility","Amount","Scope","CO₂e","Status","Risk",""].map(h=>(
                      <th key={h} style={{ padding:"9px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((r,i)=>{
                    const isSel = sel?.id===r.id;
                    return (
                      <tr key={r.id} onClick={()=>setSel(isSel?null:r)}
                        style={{ borderBottom:i<paged.length-1?"1px solid #F9FAFB":"none",background:isSel?"#EFF6FF":r.risk==="high"?"#FFFBF5":"transparent",cursor:"pointer",transition:"background .1s" }}
                        onMouseEnter={e=>{if(!isSel)(e.currentTarget as HTMLTableRowElement).style.background="#FAFAFA";}}
                        onMouseLeave={e=>{if(!isSel)(e.currentTarget as HTMLTableRowElement).style.background=r.risk==="high"?"#FFFBF5":"transparent";}}>
                        <td style={{ padding:"11px 14px",fontSize:11,color:"#9CA3AF",fontFamily:"monospace" }}>{r.id}</td>
                        <td style={{ padding:"11px 14px" }}><SourceTypeBadge type={r.source}/></td>
                        <td style={{ padding:"11px 14px",fontSize:13,color:"#6B7280" }}>{r.category}</td>
                        <td style={{ padding:"11px 14px",fontSize:11,color:"#6B7280",fontFamily:"monospace" }}>{r.date}</td>
                        <td style={{ padding:"11px 14px",fontSize:13,color:"#374151",fontWeight:500 }}>{r.facility}</td>
                        <td style={{ padding:"11px 14px",fontSize:11,color:"#374151",fontFamily:"monospace",whiteSpace:"nowrap" }}>{r.amount.toLocaleString()} {r.unit}</td>
                        <td style={{ padding:"11px 14px" }}><ScopeBadge scope={r.scope}/></td>
                        <td style={{ padding:"11px 14px",fontSize:11,fontFamily:"monospace",color:"#374151" }}>{r.co2e}t</td>
                        <td style={{ padding:"11px 14px" }}><StatusBadge status={r.status}/></td>
                        <td style={{ padding:"11px 14px" }}><RiskBadge risk={r.risk}/></td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex",gap:4 }}>
                            {(r.status==="pending"||r.status==="flagged") ? <>
                              <button onClick={e=>{e.stopPropagation();act(r.id,"approved");}} style={{ width:26,height:26,borderRadius:6,border:"1px solid #DCFCE7",background:"#F0FDF4",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Check size={11} color="#16A34A"/></button>
                              <button onClick={e=>{e.stopPropagation();act(r.id,"rejected");}} style={{ width:26,height:26,borderRadius:6,border:"1px solid #FEE2E2",background:"#FEF2F2",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><X size={11} color="#DC2626"/></button>
                            </> : (
                              <button onClick={e=>{e.stopPropagation();setSel(r);}} style={{ width:26,height:26,borderRadius:6,border:"1px solid #E5E7EB",background:"#F9FAFB",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Eye size={11} color="#6B7280"/></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination */}
          <div style={{ padding:"10px 18px",borderTop:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontSize:12,color:"#9CA3AF" }}>Showing {Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}</span>
            <div style={{ display:"flex",gap:4,alignItems:"center" }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:28,height:28,borderRadius:6,border:"1px solid #E5E7EB",background:"transparent",color:page===1?"#D1D5DB":"#374151",cursor:page===1?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><ChevronLeft size={14}/></button>
              {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                const p = i+1;
                return <button key={p} onClick={()=>setPage(p)} style={{ width:28,height:28,borderRadius:6,border:"1px solid #E5E7EB",background:page===p?"#111827":"transparent",color:page===p?"white":"#374151",fontSize:12,fontWeight:600,cursor:"pointer" }}>{p}</button>;
              })}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:28,height:28,borderRadius:6,border:"1px solid #E5E7EB",background:"transparent",color:page===totalPages?"#D1D5DB":"#374151",cursor:page===totalPages?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><ChevronRight size={14}/></button>
            </div>
          </div>
        </Card>

        {/* Detail drawer */}
        {sel && (
          <Card>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>Record Detail</span>
              <button onClick={()=>setSel(null)} style={{ border:"none",background:"transparent",cursor:"pointer",padding:4,display:"flex" }}><X size={15} color="#9CA3AF"/></button>
            </div>
            <span style={{ fontSize:11,color:"#9CA3AF",display:"block",marginBottom:8,fontFamily:"monospace" }}>{sel.id}</span>
            <div style={{ display:"flex",gap:6,marginBottom:16,flexWrap:"wrap" }}>
              <StatusBadge status={sel.status}/><ScopeBadge scope={sel.scope}/><RiskBadge risk={sel.risk}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:16 }}>
              {[["Source",sel.source],["Category",sel.category],["Date",sel.date],["Facility",sel.facility],["Amount",`${sel.amount.toLocaleString()} ${sel.unit}`],["CO₂e",`${sel.co2e} tCO₂e`],["Norm. value",`${sel.normalized} ${sel.unit}`],["Emission factor",String(sel.ef)]].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontSize:10,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:"#374151" }}>{v}</div>
                </div>
              ))}
            </div>
            {sel.flags.length>0 && (
              <div style={{ background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:8,padding:"11px 13px",marginBottom:14 }}>
                <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
                  <AlertTriangle size={14} color="#EA580C" style={{ marginTop:1,flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:12,fontWeight:700,color:"#9A3412",marginBottom:4 }}>AI Anomaly Flags</div>
                    {sel.flags.map((f,i)=><div key={i} style={{ fontSize:12,color:"#C2410C",marginBottom:2 }}>· {f}</div>)}
                  </div>
                </div>
              </div>
            )}
            <div style={{ background:"#F9FAFB",borderRadius:8,padding:"12px 14px",marginBottom:14 }}>
              <p style={{ fontSize:10,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10 }}>Audit Trail</p>
              {[{u:"System",a:"Ingested via pipeline",t:"Jan 15, 10:24"},{u:"AI Engine",a:"Risk scored → "+sel.risk,t:"Jan 15, 10:24"},{u:"Queue",a:"Assigned for review",t:"Jan 15, 10:25"}].map((ev,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:12 }}>
                  <span style={{ color:"#374151" }}><strong>{ev.u}</strong> · {ev.a}</span>
                  <span style={{ color:"#9CA3AF" }}>{ev.t}</span>
                </div>
              ))}
            </div>
            {(sel.status==="pending"||sel.status==="flagged") && (
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>act(sel.id,"approved")} style={{ flex:1,padding:"9px",background:"#16A34A",color:"white",border:"none",borderRadius:7,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                  <Check size={14}/> Approve
                </button>
                <button onClick={()=>act(sel.id,"rejected")} style={{ flex:1,padding:"9px",background:"#FEF2F2",color:"#B91C1C",border:"1px solid #FECACA",borderRadius:7,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                  <X size={14}/> Reject
                </button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
