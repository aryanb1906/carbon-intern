import { Download } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const LOGS = [
  { id:1,user:"Sarah Chen",avatar:"SC",action:"approved",record:"REC-001",field:"status",old:"pending",next:"approved",time:"2 hours ago",isAI:false },
  { id:2,user:"Marco Rossi",avatar:"MR",action:"flagged",record:"REC-003",field:"risk_score",old:"medium",next:"high",time:"4 hours ago",isAI:false },
  { id:3,user:"AI System",avatar:"AI",action:"detected",record:"REC-008",field:"anomaly",old:null,next:"Consumption 4.2σ above facility baseline",time:"6 hours ago",isAI:true },
  { id:4,user:"Anna Weber",avatar:"AW",action:"rejected",record:"REC-005",field:"status",old:"pending",next:"rejected",time:"1 day ago",isAI:false },
  { id:5,user:"James Liu",avatar:"JL",action:"uploaded",record:"FILE-012",field:"file",old:null,next:"utility_jan_2024.csv (2.4 MB, 1,847 rows)",time:"1 day ago",isAI:false },
  { id:6,user:"Sarah Chen",avatar:"SC",action:"edited",record:"REC-004",field:"amount",old:"3100",next:"3200",time:"2 days ago",isAI:false },
  { id:7,user:"Anna Weber",avatar:"AW",action:"approved",record:"REC-007",field:"status",old:"pending",next:"approved",time:"2 days ago",isAI:false },
  { id:8,user:"AI System",avatar:"AI",action:"detected",record:"REC-005",field:"anomaly",old:null,next:"Duplicate entry suspected — overlapping billing period detected",time:"3 days ago",isAI:true },
  { id:9,user:"Marco Rossi",avatar:"MR",action:"approved",record:"REC-009",field:"status",old:"pending",next:"approved",time:"3 days ago",isAI:false },
];

const ACTION_STYLE: Record<string,{bg:string,text:string}> = {
  approved: { bg:"#DCFCE7", text:"#15803D" },
  flagged:  { bg:"#FED7AA", text:"#C2410C" },
  detected: { bg:"#F5F3FF", text:"#7C3AED" },
  rejected: { bg:"#FEE2E2", text:"#B91C1C" },
  uploaded: { bg:"#EFF6FF", text:"#1D4ED8" },
  edited:   { bg:"#FEF3C7", text:"#B45309" },
};

export function AuditLogPage() {
  return (
    <div style={{ padding:26 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:17,fontWeight:700,color:"#111827" }}>Audit Log</h2>
          <p style={{ fontSize:13,color:"#9CA3AF",marginTop:2 }}>Immutable, append-only activity history</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={13}/>}>Export CSV</Button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 256px",gap:20 }}>
        {/* Timeline */}
        <div>
          {LOGS.map((log,i)=>{
            const s = ACTION_STYLE[log.action] || ACTION_STYLE.edited;
            return (
              <div key={log.id} style={{ display:"flex",gap:14 }}>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:36,flexShrink:0 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,background:log.isAI?"#F5F3FF":"#F3F4F6",border:`2px solid ${log.isAI?"#DDD6FE":"#E5E7EB"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:log.isAI?"#7C3AED":"#374151" }}>{log.avatar}</div>
                  {i<LOGS.length-1 && <div style={{ width:1,flex:1,background:"#E5E7EB",margin:"4px 0",minHeight:16 }}/>}
                </div>
                <Card style={{ flex:1,marginBottom:8,transition:"box-shadow .15s" }}
                  onMouseEnter={(e:any)=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"}
                  onMouseLeave={(e:any)=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:8 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
                      <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>{log.user}</span>
                      <span style={{ padding:"2px 9px",borderRadius:100,fontSize:11,fontWeight:700,background:s.bg,color:s.text }}>{log.action}</span>
                      <span style={{ fontSize:11,color:"#9CA3AF",fontFamily:"monospace" }}>{log.record}</span>
                    </div>
                    <span style={{ fontSize:11,color:"#9CA3AF",whiteSpace:"nowrap" }}>{log.time}</span>
                  </div>
                  <div style={{ fontSize:13,color:"#6B7280",lineHeight:1.6 }}>
                    {log.old ? (
                      <>Changed <strong style={{ color:"#374151" }}>{log.field}</strong> from{" "}
                        <code style={{ padding:"1px 6px",background:"#FEE2E2",borderRadius:4,fontSize:12,color:"#B91C1C" }}>{log.old}</code>
                        {" "}to{" "}
                        <code style={{ padding:"1px 6px",background:"#DCFCE7",borderRadius:4,fontSize:12,color:"#15803D" }}>{log.next}</code>
                      </>
                    ) : log.next}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Sidebar stats */}
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <Card>
            <h3 style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:13 }}>30-Day Summary</h3>
            {[{label:"Approvals",value:42,color:"#16A34A"},{label:"Rejections",value:8,color:"#DC2626"},{label:"Flags raised",value:15,color:"#EA580C"},{label:"AI detections",value:23,color:"#7C3AED"},{label:"File uploads",value:11,color:"#2563EB"},{label:"Manual edits",value:19,color:"#D97706"}].map(s=>(
              <div key={s.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:7,height:7,borderRadius:2,background:s.color,flexShrink:0 }}/>
                  <span style={{ fontSize:12,color:"#6B7280" }}>{s.label}</span>
                </div>
                <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>{s.value}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:13 }}>Top Reviewers</h3>
            {[{name:"Sarah Chen",reviews:28,av:"SC"},{name:"Anna Weber",reviews:19,av:"AW"},{name:"Marco Rossi",reviews:14,av:"MR"},{name:"James Liu",reviews:7,av:"JL"}].map(u=>(
              <div key={u.name} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#2563EB",flexShrink:0 }}>{u.av}</div>
                <span style={{ flex:1,fontSize:12,color:"#374151",fontWeight:500 }}>{u.name}</span>
                <span style={{ fontSize:12,fontWeight:700,color:"#9CA3AF" }}>{u.reviews}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize:13,fontWeight:700,color:"#111827",marginBottom:10 }}>AI Activity</h3>
            <div style={{ background:"#F5F3FF",borderRadius:8,padding:"11px 13px" }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#7C3AED",marginBottom:5 }}>23 anomalies · Last 30 days</div>
              <div style={{ fontSize:12,color:"#6D28D9",lineHeight:1.6 }}>14 resolved · 9 pending review<br/>3.2σ avg deviation on flagged records</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
