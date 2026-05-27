import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, XCircle, RefreshCw, Cpu, Zap, Plane, MoreHorizontal } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { formatBytes } from "../utils/formatters";

const UPLOADS = [
  { name:"sap_fuel_jan2024.csv",    size:2516582, status:"done",       records:1847, time:"10 min ago" },
  { name:"utility_bills_q4.xlsx",   size:1153433, status:"done",       records:234,  time:"2 hours ago" },
  { name:"travel_report_2024.csv",  size:876544,  status:"processing", records:null, time:"Processing…" },
  { name:"sap_export_dec23.csv",    size:3355443, status:"error",      records:null, time:"Failed · parse error row 892" },
  { name:"utility_nov23.xlsx",      size:987654,  status:"done",       records:189,  time:"Yesterday" },
];

const LOG_LINES = [
  { t:"10:24:01",level:"info",  msg:"Started parsing sap_fuel_jan2024.csv (2.4 MB)" },
  { t:"10:24:02",level:"info",  msg:"Detected 12 columns, 1,847 rows" },
  { t:"10:24:02",level:"info",  msg:"Mapped 'Qty_Base' → 'activity_value' (fuzzy match)" },
  { t:"10:24:03",level:"warn",  msg:"Non-standard unit 'GAL' → normalized to liters (×3.785)" },
  { t:"10:24:03",level:"info",  msg:"Emission factors applied: IPCC AR6 2021" },
  { t:"10:24:04",level:"info",  msg:"Anomaly scoring complete — 3 records flagged (σ>3.0)" },
  { t:"10:24:04",level:"error", msg:"Row 892: facility code 'PLT-XX' not found in registry" },
  { t:"10:24:05",level:"info",  msg:"✓ Complete: 1,846 created, 1 flagged, 0 rejected" },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "done")       return <CheckCircle size={14} color="#16A34A" />;
  if (status === "processing") return <RefreshCw   size={14} color="#D97706" style={{ animation:"spin 1s linear infinite" }} />;
  return <XCircle size={14} color="#DC2626" />;
};

export function IngestionPage() {
  const [over, setOver] = useState(false);
  const [activeLog, setActiveLog] = useState(0);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setOver(false);
    // In real app: handle dropped files
  }, []);

  return (
    <div style={{ padding:26 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:17,fontWeight:700,color:"#111827" }}>Data Ingestion</h2>
          <p style={{ fontSize:13,color:"#9CA3AF",marginTop:2 }}>Upload and parse ESG emission data files</p>
        </div>
      </div>

      {/* Drop zone */}
      <Card style={{ marginBottom:20 }}>
        <div onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)} onDrop={onDrop}
          style={{ border:`2px dashed ${over?"#2563EB":"#E5E7EB"}`, borderRadius:10, padding:"44px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14, background:over?"#F0F9FF":"#FAFAFA", cursor:"pointer", transition:"all .15s" }}>
          <div style={{ width:52,height:52,borderRadius:14,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Upload size={24} color="#2563EB"/>
          </div>
          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:15,fontWeight:700,color:"#111827" }}>Drop files here to upload</p>
            <p style={{ fontSize:13,color:"#9CA3AF",marginTop:5 }}>Supports CSV, XLSX, and PDF · Max 50 MB per file</p>
          </div>
          <Button>Browse Files</Button>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center" }}>
            {["SAP Export","Utility Bills","Travel Data","Custom CSV"].map(tag=>(
              <span key={tag} style={{ padding:"3px 10px",border:"1px solid #E5E7EB",borderRadius:100,fontSize:11,color:"#6B7280" }}>{tag}</span>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20 }}>
        {/* Upload history */}
        <Card noPad>
          <div style={{ padding:"14px 18px",borderBottom:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <h3 style={{ fontSize:14,fontWeight:700,color:"#111827" }}>Upload History</h3>
            <span style={{ fontSize:12,color:"#9CA3AF" }}>{UPLOADS.length} files</span>
          </div>
          {UPLOADS.map((f,i)=>(
            <div key={f.name} onClick={()=>setActiveLog(i)} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:i<UPLOADS.length-1?"1px solid #F9FAFB":"none",cursor:"pointer",background:activeLog===i?"#F0F9FF":"transparent",transition:"background .1s" }}>
              <div style={{ width:34,height:34,borderRadius:8,background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <FileText size={15} color="#6B7280"/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:600,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{f.name}</div>
                <div style={{ fontSize:11,color:"#9CA3AF",marginTop:1 }}>{formatBytes(f.size)} · {f.time}</div>
              </div>
              {f.records && <span style={{ fontSize:11,color:"#6B7280",whiteSpace:"nowrap",fontFamily:"monospace" }}>{f.records.toLocaleString()} rows</span>}
              <StatusIcon status={f.status}/>
            </div>
          ))}
        </Card>

        {/* Parse log */}
        <Card noPad>
          <div style={{ padding:"14px 18px",borderBottom:"1px solid #F3F4F6" }}>
            <h3 style={{ fontSize:14,fontWeight:700,color:"#111827" }}>Parse Log</h3>
            <p style={{ fontSize:11,color:"#9CA3AF",marginTop:2 }}>{UPLOADS[activeLog].name}</p>
          </div>
          <div style={{ padding:"14px 16px",background:"#0D1117",minHeight:228,borderRadius:"0 0 12px 12px",overflowY:"auto",maxHeight:260 }}>
            {LOG_LINES.map((l,i)=>(
              <div key={i} style={{ display:"flex",gap:10,marginBottom:5,fontSize:11,fontFamily:"monospace" }}>
                <span style={{ color:"#4B5563",flexShrink:0 }}>{l.t}</span>
                <span style={{ color:l.level==="error"?"#F87171":l.level==="warn"?"#FCD34D":"#6EE7B7",flexShrink:0,width:52 }}>[{l.level.toUpperCase()}]</span>
                <span style={{ color:"#9CA3AF" }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Format guides */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
        {[
          { Icon:Cpu,   color:"#2563EB", bg:"#EFF6FF", title:"SAP Export Format",   desc:"Required: Material, Plant, Quantity, Base_Unit, Cost_Center, Posting_Date. Auto-maps SAP column aliases including German field names." },
          { Icon:Zap,   color:"#7C3AED", bg:"#F5F3FF", title:"Utility Bill Format",  desc:"Required: Meter_ID, Billing_Period, kWh, Facility_Code, Tariff_Zone. Handles multi-month billing periods and overlapping intervals." },
          { Icon:Plane, color:"#059669", bg:"#ECFDF5", title:"Travel Data Format",   desc:"Required: Traveler_ID, Origin, Destination, Transport_Type, Date. Auto-calculates distance from IATA airport codes." },
        ].map(f=>(
          <Card key={f.title} hover>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
              <div style={{ width:32,height:32,borderRadius:8,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center" }}><f.Icon size={16} color={f.color}/></div>
              <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>{f.title}</span>
            </div>
            <p style={{ fontSize:12,color:"#6B7280",lineHeight:1.65,marginBottom:12 }}>{f.desc}</p>
            <button style={{ fontSize:12,color:"#2563EB",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit" }}>Download template →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}
