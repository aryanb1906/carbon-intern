import { useState } from "react";
import { Building2, Users, Key, Leaf, Bell, Plus, MoreHorizontal } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";

type Tab = "organization"|"users"|"api"|"emissions"|"notifications";
const TABS: {id:Tab;label:string;Icon:any}[] = [
  {id:"organization",label:"Organization",Icon:Building2},
  {id:"users",label:"Users",Icon:Users},
  {id:"api",label:"API Keys",Icon:Key},
  {id:"emissions",label:"Emission Factors",Icon:Leaf},
  {id:"notifications",label:"Notifications",Icon:Bell},
];

function TabNav({ active, onSelect }: { active: Tab; onSelect: (t:Tab)=>void }) {
  return (
    <div>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>onSelect(t.id)} style={{ display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 11px",borderRadius:7,border:"none",cursor:"pointer",background:active===t.id?"#EFF6FF":"transparent",color:active===t.id?"#2563EB":"#6B7280",fontSize:13,fontWeight:active===t.id?700:500,fontFamily:"inherit",marginBottom:2,textAlign:"left",transition:"all .1s" }}
          onMouseEnter={e=>{if(active!==t.id)(e.currentTarget as HTMLButtonElement).style.background="#F9FAFB";}}
          onMouseLeave={e=>{if(active!==t.id)(e.currentTarget as HTMLButtonElement).style.background="transparent";}}>
          <t.Icon size={14}/>{t.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>("organization");

  return (
    <div style={{ padding:26 }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:17,fontWeight:700,color:"#111827" }}>Settings</h2>
        <p style={{ fontSize:13,color:"#9CA3AF",marginTop:2 }}>Manage your workspace and integrations</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"196px 1fr",gap:20 }}>
        <TabNav active={tab} onSelect={setTab}/>
        <div>
          {tab==="organization" && (
            <Card>
              <h3 style={{ fontSize:15,fontWeight:700,color:"#111827",marginBottom:20 }}>Organization Settings</h3>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20 }}>
                <Input label="Organization Name" defaultValue="ACME Corporation"/>
                <Input label="Industry" defaultValue="Manufacturing & Logistics"/>
                <Input label="Country" defaultValue="Germany"/>
                <Input label="Reporting Currency" defaultValue="EUR"/>
                <Input label="Base Year (GHG Protocol)" defaultValue="2020"/>
                <Input label="Fiscal Year End" defaultValue="December 31"/>
              </div>
              <div style={{ borderTop:"1px solid #F3F4F6",paddingTop:16,display:"flex",gap:8 }}>
                <Button>Save Changes</Button>
                <Button variant="secondary">Discard</Button>
              </div>
            </Card>
          )}

          {tab==="users" && (
            <Card>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
                <h3 style={{ fontSize:15,fontWeight:700,color:"#111827" }}>Team Members</h3>
                <Button icon={<Plus size={13}/>} size="sm">Invite Member</Button>
              </div>
              {[{name:"Sarah Chen",email:"sarah.chen@acme.com",role:"ESG Analyst",av:"SC",status:"active",color:"#DBEAFE",textColor:"#2563EB"},
                {name:"Anna Weber",email:"anna.weber@acme.com",role:"ESG Manager",av:"AW",status:"active",color:"#FCE7F3",textColor:"#9D174D"},
                {name:"Marco Rossi",email:"marco.rossi@acme.com",role:"Data Engineer",av:"MR",status:"active",color:"#D1FAE5",textColor:"#065F46"},
                {name:"James Liu",email:"james.liu@acme.com",role:"Analyst",av:"JL",status:"invited",color:"#FEF3C7",textColor:"#92400E"},
              ].map(u=>(
                <div key={u.email} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F3F4F6" }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:u.textColor,flexShrink:0 }}>{u.av}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:"#111827" }}>{u.name}</div>
                    <div style={{ fontSize:12,color:"#9CA3AF" }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize:12,color:"#6B7280",marginRight:8 }}>{u.role}</span>
                  <span style={{ padding:"2px 9px",borderRadius:100,fontSize:11,fontWeight:600,background:u.status==="active"?"#DCFCE7":"#F3F4F6",color:u.status==="active"?"#15803D":"#9CA3AF" }}>{u.status}</span>
                  <button style={{ border:"none",background:"transparent",cursor:"pointer",padding:4,display:"flex" }}><MoreHorizontal size={15} color="#9CA3AF"/></button>
                </div>
              ))}
            </Card>
          )}

          {tab==="api" && (
            <Card>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
                <h3 style={{ fontSize:15,fontWeight:700,color:"#111827" }}>API Keys</h3>
                <Button icon={<Plus size={13}/>} size="sm">Generate Key</Button>
              </div>
              {[{name:"Production API",key:"ct_live_sk_••••••••••••••••8f2a",env:"production",lastUsed:"2 min ago",color:"#ECFDF5",textColor:"#059669"},
                {name:"Staging API",key:"ct_test_sk_••••••••••••••••3b1c",env:"staging",lastUsed:"3 days ago",color:"#F9FAFB",textColor:"#6B7280"},
              ].map(k=>(
                <div key={k.name} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:"1px solid #F3F4F6" }}>
                  <div style={{ width:38,height:38,borderRadius:9,background:k.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Key size={16} color={k.textColor}/></div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                      <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>{k.name}</span>
                      <span style={{ padding:"2px 8px",borderRadius:100,fontSize:11,fontWeight:600,background:k.color,color:k.textColor }}>{k.env}</span>
                    </div>
                    <code style={{ fontSize:11,color:"#9CA3AF" }}>{k.key}</code>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0,marginRight:12 }}>
                    <div style={{ fontSize:11,color:"#9CA3AF" }}>Last used</div>
                    <div style={{ fontSize:12,fontWeight:600,color:"#374151" }}>{k.lastUsed}</div>
                  </div>
                  <Button variant="danger" size="sm">Revoke</Button>
                </div>
              ))}
              <div style={{ marginTop:16,padding:"14px",background:"#F9FAFB",borderRadius:8,border:"1px solid #F3F4F6" }}>
                <p style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:4 }}>Rate Limits</p>
                <p style={{ fontSize:12,color:"#6B7280" }}>Production: 10,000 req/hour · Staging: 1,000 req/hour</p>
              </div>
            </Card>
          )}

          {tab==="emissions" && (
            <Card>
              <h3 style={{ fontSize:15,fontWeight:700,color:"#111827",marginBottom:4 }}>Emission Factor Library</h3>
              <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:20 }}>Configure which factor set is used for CO₂e calculations</p>
              <div style={{ display:"grid",gap:14,marginBottom:20 }}>
                <Select label="Factor Set Version" options={[{value:"IPCC_AR6_2021",label:"IPCC AR6 (2021) — Recommended"},{value:"IPCC_AR5_2014",label:"IPCC AR5 (2014)"},{value:"GHG_PROTOCOL",label:"GHG Protocol (custom)"},{value:"DEFRA_2023",label:"DEFRA 2023 (UK)"}]}/>
                <Input label="Anomaly Detection Threshold (σ)" defaultValue="3.0" type="number"/>
                <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#F9FAFB",borderRadius:8,border:"1px solid #F3F4F6" }}>
                  <input type="checkbox" id="auto_approve" style={{ width:16,height:16,accentColor:"#2563EB" }}/>
                  <div>
                    <label htmlFor="auto_approve" style={{ fontSize:13,fontWeight:600,color:"#374151",cursor:"pointer" }}>Auto-approve low-risk records</label>
                    <p style={{ fontSize:12,color:"#9CA3AF" }}>Records with risk score &lt; 0.2 and no anomaly flags are automatically approved</p>
                  </div>
                </div>
              </div>
              <Button>Save Configuration</Button>
            </Card>
          )}

          {tab==="notifications" && (
            <Card>
              <h3 style={{ fontSize:15,fontWeight:700,color:"#111827",marginBottom:4 }}>Notification Preferences</h3>
              <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:20 }}>Configure alerts for ingestion events and review actions</p>
              {[{label:"High-risk record detected",desc:"Alert when AI flags a record with score > 0.7",enabled:true},{label:"Ingestion errors",desc:"Alert when a file parse fails or produces errors",enabled:true},{label:"Pending review backlog",desc:"Daily summary when pending records exceed 100",enabled:false},{label:"Source sync failures",desc:"Alert when a data source sync fails",enabled:true},{label:"Weekly emissions report",desc:"Automated weekly summary email",enabled:false}].map((n,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:14,padding:"14px 0",borderBottom:i<4?"1px solid #F3F4F6":"none" }}>
                  <input type="checkbox" defaultChecked={n.enabled} style={{ width:16,height:16,marginTop:2,accentColor:"#2563EB",flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13,fontWeight:600,color:"#111827" }}>{n.label}</div>
                    <div style={{ fontSize:12,color:"#9CA3AF",marginTop:2 }}>{n.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:16 }}>
                <Input label="Alert Email Address" type="email" defaultValue="esg-alerts@acme.com"/>
              </div>
              <div style={{ marginTop:14 }}><Button>Save Preferences</Button></div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
