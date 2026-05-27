import { Cpu, Zap, Plane, RefreshCw, FileUp, MoreHorizontal, Plus, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ScopeBadge } from "../components/ui/Badge";
import { SourceBarChart } from "../components/charts/SourceBarChart";

const SOURCES = [
  { id:"sap",name:"SAP ERP Integration",type:"SAP / Procurement",Icon:Cpu,color:"#2563EB",bg:"#EFF6FF",status:"active",lastSync:"14 min ago",records:4218,errors:0,desc:"Fuel consumption, procurement, logistics — SAP S/4HANA export connector",scope:1 },
  { id:"utility",name:"Utility Billing API",type:"Electricity & Gas",Icon:Zap,color:"#7C3AED",bg:"#F5F3FF",status:"active",lastSync:"2 hours ago",records:1840,errors:3,desc:"Electricity, gas, and water consumption via facility meter API integration",scope:2 },
  { id:"travel",name:"Corporate Travel Data",type:"Travel & Transport",Icon:Plane,color:"#059669",bg:"#ECFDF5",status:"syncing",lastSync:"Syncing…",records:374,errors:1,desc:"Flights, hotels, ground transport from Concur and TripActions connectors",scope:3 },
];
const MONTHLY = [{month:"Jul",scope1:460,scope2:235,scope3:640},{month:"Aug",scope1:440,scope2:215,scope3:615},{month:"Sep",scope1:395,scope2:205,scope3:572},{month:"Oct",scope1:420,scope2:225,scope3:600},{month:"Nov",scope1:435,scope2:240,scope3:632},{month:"Dec",scope1:470,scope2:260,scope3:680}];

export function DataSourcesPage() {
  return (
    <div style={{ padding:26 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:17,fontWeight:700,color:"#111827" }}>Data Sources</h2>
          <p style={{ fontSize:13,color:"#9CA3AF",marginTop:2 }}>3 active integrations · Last updated 14 min ago</p>
        </div>
        <Button icon={<Plus size={14}/>}>Add Source</Button>
      </div>

      <div style={{ display:"grid", gap:14, marginBottom:20 }}>
        {SOURCES.map(src=>(
          <Card key={src.id} style={{ display:"flex", alignItems:"flex-start", gap:18 }}>
            <div style={{ width:46,height:46,borderRadius:11,background:src.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <src.Icon size={21} color={src.color}/>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
                <h3 style={{ fontSize:14,fontWeight:700,color:"#111827" }}>{src.name}</h3>
                <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"2px 9px",borderRadius:100,fontSize:11,fontWeight:600,background:src.status==="active"?"#DCFCE7":"#FEF3C7",color:src.status==="active"?"#15803D":"#B45309" }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:src.status==="active"?"#16A34A":"#D97706",animation:src.status==="syncing"?"pulse 1.5s infinite":undefined }}/>
                  {src.status==="active"?"Active":"Syncing"}
                </span>
                <ScopeBadge scope={src.scope}/>
              </div>
              <p style={{ fontSize:13,color:"#6B7280",marginBottom:12 }}>{src.desc}</p>
              <div style={{ display:"flex",gap:22 }}>
                {[{label:"Last sync",value:src.lastSync},{label:"Records",value:src.records.toLocaleString()},{label:"Parse errors",value:String(src.errors),danger:src.errors>0}].map(s=>(
                  <div key={s.label}>
                    <div style={{ fontSize:11,color:"#9CA3AF",marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:13,fontWeight:700,color:s.danger?"#DC2626":"#111827" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex",gap:6,flexShrink:0 }}>
              <Button variant="secondary" size="sm" icon={<RefreshCw size={12}/>}>Sync</Button>
              <Button variant="secondary" size="sm" icon={<FileUp size={12}/>}>Upload</Button>
              <button style={{ width:32,height:32,border:"1px solid #E5E7EB",borderRadius:7,background:"#F9FAFB",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><MoreHorizontal size={14} color="#6B7280"/></button>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
        <Card>
          <h3 style={{ fontSize:14,fontWeight:700,color:"#111827",marginBottom:3 }}>Ingestion Volume by Source</h3>
          <p style={{ fontSize:12,color:"#9CA3AF",marginBottom:18 }}>Records processed per month</p>
          <SourceBarChart data={MONTHLY}/>
        </Card>
        <Card>
          <h3 style={{ fontSize:14,fontWeight:700,color:"#111827",marginBottom:14 }}>Source Health</h3>
          {SOURCES.map(s=>(
            <div key={s.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F9FAFB" }}>
              <div style={{ width:34,height:34,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><s.Icon size={16} color={s.color}/></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:600,color:"#111827" }}>{s.name}</div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:4 }}>
                  <div style={{ flex:1,height:4,borderRadius:2,background:"#F3F4F6" }}>
                    <div style={{ height:"100%",borderRadius:2,background:s.errors>0?"#FCA5A5":s.color,width:`${Math.min(100,(s.records/50))}%` }}/>
                  </div>
                  <span style={{ fontSize:11,color:"#9CA3AF",whiteSpace:"nowrap" }}>{s.records.toLocaleString()} records</span>
                </div>
              </div>
              <TrendingUp size={14} color="#16A34A"/>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
