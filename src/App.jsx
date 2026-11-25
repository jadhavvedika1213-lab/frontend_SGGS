import { useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  LayoutDashboard, ListTodo, Bot, Copy, TrendingUp, ShieldCheck, Activity,
  Building2, UserRoundCog, Settings, Search, Bell, ChevronDown, Menu, X,
  ArrowUpRight, Clock3, CheckCircle2, AlertTriangle, Users, Mic, Send,
  MoreHorizontal, SlidersHorizontal, ChevronLeft, ChevronRight, Edit3,
  CircleCheck, MessageSquareText, MapPin, CalendarDays, FileText, ExternalLink
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'
import './App.css'
import { grievances } from './data/grievances'
import { categories } from './data/categories'
import { departments } from './data/departments'
import { officers } from './data/officers'
import { alerts } from './data/alerts'
import { agentStages } from './data/agentLogs'
import { trend, highRisk } from './data/analytics'

const navMain = [
  ['Overview','/overview',LayoutDashboard], ['Grievances','/grievances',ListTodo],
  ['AI Intake Agent','/intake',Bot], ['Duplicate Detection','/duplicates',Copy],
  ['Predictive Intelligence','/predictive',TrendingUp], ['Policy & Human Review','/review',ShieldCheck],
  ['Agent Observability','/observability',Activity]
]
const navManagement = [
  ['Departments','/departments',Building2], ['Officers','/officers',UserRoundCog], ['Settings','/settings',Settings]
]

function StatusPill({ value }) {
  const cls = value.toLowerCase().replaceAll(' ','-')
  return <span className={`status ${cls}`}><i />{value}</span>
}
function PriorityPill({ value }) {
  return <span className={`priority ${value.toLowerCase()} `}>{value}</span>
}
function Card({ children, className='' }) { return <section className={`card ${className}`}>{children}</section> }

function Sidebar({ open, setOpen }) {
  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active':''}`
  const groups = [['MAIN',navMain],['MANAGEMENT',navManagement]]
  return <>
    {open && <button className="overlay" aria-label="Close menu" onClick={()=>setOpen(false)} />}
    <aside className={`sidebar ${open?'open':''}`}>
      <div className="brand"><div className="brand-mark">R</div><div><strong>ResolveAI</strong><small>Intelligent Grievance System</small></div><button className="icon-btn close-nav" onClick={()=>setOpen(false)}><X size={18}/></button></div>
      <nav>{groups.map(([title,items])=><div className="nav-section" key={title}><p>{title}</p>{items.map(([label,path,Icon])=><NavLink key={path} to={path} className={linkClass} onClick={()=>setOpen(false)}><Icon size={18}/><span>{label}</span></NavLink>)}</div>)}</nav>
      <div className="sidebar-foot"><div className="avatar">AM</div><div><strong>Ananya Mehta</strong><small>District Admin</small></div><ChevronDown size={15}/></div>
    </aside>
  </>
}

function Topbar({ setOpen }) {
  const [notifications,setNotifications]=useState(false)
  const [language,setLanguage]=useState('English')
  return <header className="topbar">
    <button className="icon-btn menu-btn" onClick={()=>setOpen(true)}><Menu size={20}/></button>
    <div className="global-search"><Search size={17}/><input placeholder="Search grievances, citizens, departments..." /><kbd>⌘ K</kbd></div>
    <div className="top-actions">
      <span className="date">Tue, 25 Nov 2026</span>
      <select value={language} onChange={e=>setLanguage(e.target.value)} aria-label="Language"><option>English</option><option>Marathi</option><option>Hindi</option></select>
      <div className="notification-wrap"><button className="icon-btn" onClick={()=>setNotifications(!notifications)}><Bell size={19}/><b>3</b></button>{notifications&&<div className="notifications"><div className="popover-head"><strong>Notifications</strong><button onClick={()=>setNotifications(false)}>Mark all read</button></div>{alerts.map((a,i)=><div className="notification-item" key={i}><AlertTriangle size={16}/><div><strong>{a.title}</strong><small>{a.detail}</small></div></div>)}</div>}</div>
      <div className="top-avatar">AM</div>
    </div>
  </header>
}

function Overview() {
  const stats=[
    ['Total Grievances','1,208','+8.2%','',ListTodo],
    ['Pending','342','-4.1%','',Clock3],
    ['Resolved','866','+12.6%','',CircleCheck],
    ['Sensitive Cases','28','5 require review','',ShieldCheck],
    ['SLA At-Risk','47','AI estimate','',AlertTriangle],
    ['AI Auto-Resolved','184','+15.4%','',Bot]
  ]
  const COLORS=['#4f46e5','#60a5fa','#14b8a6','#f59e0b','#f43f5e','#8b5cf6','#10b981']
  return <div className="page">
    <div className="page-head"><div><p className="eyebrow">DISTRICT OPERATIONS</p><h1>Good morning, Ananya</h1><p>Here is your grievance resolution overview.</p></div><button className="primary" onClick={()=>window.location.assign('/intake')}><Bot size={17}/> New complaint</button></div>
    <div className="stats-grid">{stats.map(([label,value,delta,,Icon],i)=><Card key={label} className="stat-card"><div className={`stat-icon c${i}`}><Icon size={19}/></div><div><p>{label}</p><strong>{value}</strong><small className={i===1?'down':''}>{delta}</small></div></Card>)}</div>
    <div className="charts-grid">
      <Card className="trend-card"><div className="card-head"><div><h2>Grievance trends</h2><p>Submitted vs resolved</p></div><select><option>Last 6 months</option></select></div><div className="chart"><ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="grievances" stroke="#4f46e5" strokeWidth={2.5} dot={false}/><Line type="monotone" dataKey="resolved" stroke="#14b8a6" strokeWidth={2.5} dot={false}/></LineChart></ResponsiveContainer></div></Card>
      <Card><div className="card-head"><div><h2>Category distribution</h2><p>All active grievances</p></div></div><div className="pie-wrap"><div className="pie-chart"><ResponsiveContainer><PieChart><Pie data={categories} dataKey="count" innerRadius={58} outerRadius={82} paddingAngle={3}>{categories.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pie-center"><strong>1,208</strong><small>Total</small></div></div><div className="legend">{categories.slice(0,5).map((c,i)=><div key={c.name}><i style={{background:COLORS[i]}}/><span>{c.name}</span><strong>{c.count}</strong></div>)}</div></div></Card>
    </div>
    <div className="lower-grid">
      <Card className="table-card"><div className="card-head"><div><h2>Recent grievances</h2><p>Latest citizen submissions</p></div><NavLink to="/grievances">View all <ArrowUpRight size={14}/></NavLink></div><table><thead><tr><th>ID</th><th>Category</th><th>Department</th><th>Priority</th><th>Status</th></tr></thead><tbody>{grievances.slice(0,5).map(g=><tr key={g.id}><td><strong>{g.id}</strong></td><td>{g.category}</td><td>{g.department}</td><td><PriorityPill value={g.priority}/></td><td><StatusPill value={g.status}/></td></tr>)}</tbody></table></Card>
      <Card><div className="card-head"><div><h2>Critical alerts</h2><p>Requires attention</p></div><span className="badge">3</span></div><div className="alerts">{alerts.map((a,i)=><div className="alert-row" key={i}><div className={`alert-icon ${a.level.toLowerCase()} `}><AlertTriangle size={16}/></div><div><strong>{a.title}</strong><p>{a.detail}</p><small>{a.time}</small></div></div>)}</div></Card>
    </div>
  </div>
}

function Grievances() {
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('All categories')
  const [status,setStatus]=useState('All statuses')
  const [page,setPage]=useState(1)
  const navigate=useNavigate()
  const filtered=useMemo(()=>grievances.filter(g=>(category==='All categories'||g.category===category)&&(status==='All statuses'||g.status===status)&&(g.id.toLowerCase().includes(query.toLowerCase())||g.ref.toLowerCase().includes(query.toLowerCase()))),[query,category,status])
  return <div className="page"><div className="page-head"><div><p className="eyebrow">CASE MANAGEMENT</p><h1>Grievances</h1><p>{filtered.length} cases in current view</p></div><button className="primary" onClick={()=>navigate('/intake')}><Bot size={17}/> AI Intake</button></div>
    <Card className="table-card"><div className="filters"><div className="table-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search ID or citizen reference"/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option>All categories</option>{categories.map(c=><option key={c.name}>{c.name}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option><option>Pending</option><option>Assigned</option><option>In Progress</option><option>Human Review</option><option>Resolved</option></select><button className="secondary"><SlidersHorizontal size={16}/> Filters</button></div>
      <div className="responsive-table"><table><thead><tr><th>Grievance ID</th><th>Citizen Reference</th><th>Category</th><th>Location</th><th>Department</th><th>Priority</th><th>AI Confidence</th><th>SLA Deadline</th><th>Status</th><th></th></tr></thead><tbody>{filtered.map(g=><tr key={g.id} onClick={()=>navigate(`/grievances/${g.id}`)}><td><strong>{g.id}</strong></td><td>{g.ref}</td><td>{g.category}</td><td>{g.location}</td><td>{g.department}</td><td><PriorityPill value={g.priority}/></td><td>{g.confidence}%</td><td>{g.deadline}</td><td><StatusPill value={g.status}/></td><td><MoreHorizontal size={17}/></td></tr>)}</tbody></table></div>
      {filtered.length===0&&<div className="empty"><Search size={24}/><strong>No grievances found</strong><p>Try changing your search or filters.</p></div>}
      <div className="pagination"><p>Showing 1–{filtered.length} of {filtered.length}</p><div><button disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={16}/></button><button className="page-num">{page}</button><button onClick={()=>setPage(p=>p+1)}><ChevronRight size={16}/></button></div></div>
    </Card>
  </div>
}

function GrievanceDetail() {
  const { id }=useParams(); const navigate=useNavigate()
  const g=grievances.find(x=>x.id===id)||grievances[0]
  return <div className="page"><button className="back" onClick={()=>navigate(-1)}>← Back to grievances</button><div className="detail-head"><div><p className="eyebrow">GRIEVANCE</p><h1>{g.id}</h1><p>{g.ref} • Submitted {g.submitted}</p></div><div><StatusPill value={g.status}/><button className="secondary" onClick={()=>toast.success('Case action menu opened')}><MoreHorizontal size={17}/></button></div></div>
    <div className="detail-grid"><div className="detail-main"><Card><div className="card-head"><h2>Complaint details</h2><button className="secondary"><Edit3 size={15}/> Edit summary</button></div><blockquote>{g.original}</blockquote><h3>AI-generated summary</h3><p>{g.summary}</p><div className="detail-fields"><div><span>Category</span><strong>{g.category}</strong></div><div><span>Subcategory</span><strong>{g.subcategory}</strong></div><div><span>Citizen language</span><strong>{g.language}</strong></div><div><span>Location</span><strong>{g.location}</strong></div><div><span>Urgency</span><strong>{g.urgency}</strong></div><div><span>Sentiment</span><strong>{g.sentiment}</strong></div></div></Card>
      <Card><div className="card-head"><h2>AI decision explanation</h2><span className="confidence">{g.confidence}% confidence</span></div><p className="explanation">The grievance was classified using the category master and matched with relevant district operations. A human review check is required only where policy or confidence thresholds apply.</p><div className="policy-list"><div><CircleCheck size={17}/><span>Category master policy matched</span></div><div><CircleCheck size={17}/><span>No legal liability determination made</span></div><div><ShieldCheck size={17}/><span>Sensitive-case safeguards active</span></div></div></Card></div>
      <div className="detail-side"><Card><div className="card-head"><h2>Assignment</h2></div><dl><dt>Department</dt><dd>{g.department}</dd><dt>Assigned officer</dt><dd>{g.officer}</dd><dt>AI confidence</dt><dd>{g.confidence}%</dd><dt>SLA deadline</dt><dd>{g.deadline}</dd></dl></Card><Card><div className="card-head"><h2>Similar cases</h2></div><div className="similar"><strong>GRV-0992</strong><p>Similar water interruption in Vishnupuri</p><small>92% similarity</small></div><div className="similar"><strong>GRV-0968</strong><p>Resolved pipeline-related complaint</p><small>84% similarity</small></div></Card><Card><div className="card-head"><h2>SLA timeline</h2></div><div className="timeline-mini"><span className="done"/> <div><strong>Submitted</strong><small>{g.submitted}</small></div><span/> <div><strong>Assigned</strong><small>AI routing complete</small></div><span/> <div><strong>Resolution deadline</strong><small>{g.deadline}</small></div></div></Card></div>
    </div>
  </div>
}

function Intake() {
  const [language,setLanguage]=useState('English')
  const [text,setText]=useState('')
  const [typing,setTyping]=useState(false)
  const [messages,setMessages]=useState([
    { role:'ai', text:'Hello. I can help you submit and structure a grievance. Please describe the issue in English, Marathi, or Hindi.' }
  ])
  const [draft,setDraft]=useState({ category:'Water Supply', description:'Irregular water supply for four days in Vishnupuri.', location:'Vishnupuri, Nanded', urgency:'High', missing:'Preferred callback window', language:'English', confidence:94 })
  const send=()=>{
    if(!text.trim()) return
    setMessages(m=>[...m,{role:'user',text}]); setText(''); setTyping(true)
    setTimeout(()=>{setTyping(false);setMessages(m=>[...m,{role:'ai',text:'I have created a structured draft below. Please review the details before confirming.'}])},700)
  }
  const editDraft=()=>{ const value=window.prompt('Edit complaint description',draft.description); if(value) setDraft({...draft,description:value}) }
  return <div className="page"><div className="page-head"><div><p className="eyebrow">CITIZEN INTAKE</p><h1>AI Intake Agent</h1><p>Structure complaints with citizen confirmation</p></div><select value={language} onChange={e=>setLanguage(e.target.value)}><option>English</option><option>Marathi</option><option>Hindi</option></select></div>
    <div className="intake-grid"><Card className="chat-card"><div className="chat-head"><div className="bot-avatar"><Bot size={18}/></div><div><strong>ResolveAI Assistant</strong><small><i/> Online</small></div></div><div className="chat-body">{messages.map((m,i)=><div className={`bubble ${m.role}`} key={i}>{m.text}</div>)}{typing&&<div className="typing"><i/><i/><i/></div>}</div><div className="chat-input"><button className="mic" onClick={()=>toast('Voice capture UI ready. Microphone access requires browser permission.')}><Mic size={19}/></button><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Describe the grievance..."/><button className="send" onClick={send}><Send size={18}/></button></div></Card>
      <Card className="draft-card"><div className="card-head"><div><h2>Structured draft</h2><p>AI-generated, pending confirmation</p></div><span className="draft-status">Draft</span></div><div className="draft-fields">{Object.entries(draft).map(([key,value])=>key==='confidence'?null:<label key={key}><span>{key==='missing'?'Missing details':key[0].toUpperCase()+key.slice(1)}</span>{key==='description'?<textarea value={value} onChange={e=>setDraft({...draft,[key]:e.target.value})}/>:<input value={value} onChange={e=>setDraft({...draft,[key]:e.target.value})}/>}</label>)}</div><div className="confidence-bar"><span>AI confidence</span><strong>{draft.confidence}%</strong><div><i style={{width:draft.confidence+'%'}}/></div></div><div className="draft-actions"><button className="secondary" onClick={()=>toast.success('Draft cleared. Start a new complaint.')}>Cancel</button><button className="secondary" onClick={editDraft}><Edit3 size={15}/> Edit Draft</button><button className="primary" onClick={()=>toast.success('Mock draft confirmed. No backend complaint was submitted.')}>Confirm Complaint</button></div></Card>
    </div>
  </div>
}

function Duplicates() {
  const [open,setOpen]=useState('DG-208')
  const groups=[
    { id:'DG-208', count:6, similarity:96, location:true, window:true, root:'GRV-1001', cases:[['GRV-1001','Vishnupuri','In Progress'],['GRV-0998','Vishnupuri','Assigned'],['GRV-0991','Vishnupuri','Pending']] },
    { id:'DG-214', count:4, similarity:89, location:true, window:false, root:'GRV-1003', cases:[['GRV-1003','Latur','Pending'],['GRV-0976','Latur','Resolved']] }
  ]
  return <div className="page"><div className="page-head"><div><p className="eyebrow">SIMILARITY ENGINE</p><h1>Duplicate Detection</h1><p>Related complaints remain individually tracked</p></div></div><div className="stats-grid three">{[['Duplicate groups','10','+2 this week'],['Avg. similarity','92%','AI estimate'],['Unique cases protected','842','No silent merges']].map(([l,v,s],i)=><Card className="stat-card compact" key={l}><div className={`stat-icon c${i}`}><Copy size={18}/></div><div><p>{l}</p><strong>{v}</strong><small>{s}</small></div></Card>)}</div>
    <div className="duplicate-list">{groups.map(g=><Card className="duplicate-card" key={g.id}><button className="duplicate-summary" onClick={()=>setOpen(open===g.id?null:g.id)}><div><span className="duplicate-icon"><Copy size={18}/></span><div><strong>{g.id}</strong><p>{g.count} related complaints • Root: {g.root}</p></div></div><div className="match-metrics"><span><strong>{g.similarity}%</strong> similarity</span><span className={g.location?'match':''}>Location match</span><span className={g.window?'match':''}>Time window</span><ChevronDown size={17}/></div></button>{open===g.id&&<div className="duplicate-cases">{g.cases.map(c=><div key={c[0]}><strong>{c[0]}</strong><span><MapPin size={14}/>{c[1]}</span><StatusPill value={c[2]}/><button onClick={()=>window.location.assign(`/grievances/${c[0]}`)}>View case</button></div>)}</div>}</Card>)}</div>
  </div>
}

function Predictive() {
  return <div className="page"><div className="page-head"><div><p className="eyebrow">AI FORECASTING</p><h1>Predictive Intelligence</h1><p>AI estimates and proactive risk indicators</p></div><span className="estimate-label">Predictions are estimates, not verified facts</span></div><div className="stats-grid three">{[['SLA breach risk','47','12 critical/high'],['At-risk departments','3','Requires monitoring'],['Recurring patterns','8','This month']].map(([l,v,s],i)=><Card className="stat-card compact" key={l}><div><p>{l}</p><strong>{v}</strong><small>{s}</small></div></Card>)}</div>
    <div className="charts-grid"><Card><div className="card-head"><div><h2>High-risk grievances</h2><p>Sorted by predicted probability</p></div></div><div className="risk-list">{highRisk.map(r=><div className="risk-row" key={r.id}><div><strong>{r.id}</strong><p>{r.category} • {r.location}</p></div><span className={`risk ${r.risk.toLowerCase()}`}>{r.risk}</span><div className="risk-prob"><strong>{r.probability}%</strong><small>{r.duration}</small></div></div>)}</div></Card><Card><div className="card-head"><div><h2>Department bottlenecks</h2><p>Estimated workload pressure</p></div></div><div className="chart"><ResponsiveContainer><BarChart data={departments.slice(0,5)}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis/><Tooltip/><Bar dataKey="pending" fill="#4f46e5" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></Card></div>
  </div>
}

function Review() {
  const [selected,setSelected]=useState(grievances.find(g=>g.status==='Human Review'))
  const action=(name)=>toast.success(`${name} recorded in mock review queue`)
  return <div className="page"><div className="page-head"><div><p className="eyebrow">CONTROL & SAFETY</p><h1>Policy & Human Review</h1><p>Sensitive and low-confidence cases require officer decisions</p></div><span className="security-badge"><ShieldCheck size={15}/> Safety gates active</span></div><div className="review-grid"><Card className="review-list"><div className="card-head"><h2>Human review queue</h2><span className="badge">2</span></div>{grievances.filter(g=>g.status==='Human Review').map(g=><button className={`review-item ${selected?.id===g.id?'selected':''}`} key={g.id} onClick={()=>setSelected(g)}><div><strong>{g.id}</strong><p>{g.category} • {g.location}</p></div><div><PriorityPill value={g.priority}/><small>{g.confidence}% confidence</small></div></button>)}</Card>
      {selected&&<Card className="review-detail"><div className="card-head"><div><h2>{selected.id}</h2><p>{selected.category} • Sensitive-case evaluation</p></div><PriorityPill value={selected.priority}/></div><div className="policy-gate"><ShieldCheck size={20}/><div><strong>Policy gate: Human review required</strong><p>Identity protection and category-master policy evaluation must complete before routing.</p></div></div><h3>Policy evaluation</h3><div className="review-checks"><div><CircleCheck size={16}/> Category master source matched</div><div><CircleCheck size={16}/> Identity-hiding requirement active</div><div><AlertTriangle size={16}/> AI confidence below auto-resolution threshold</div></div><div className="review-actions"><button className="secondary" onClick={()=>action('Information request')}>Request more information</button><button className="secondary" onClick={()=>action('Officer assignment')}>Assign officer</button><button className="secondary" onClick={()=>action('Reopen decision')}>Reopen grievance</button><button className="primary" onClick={()=>action('Routing approval')}>Approve routing</button></div></Card>}
    </div>
  </div>
}

function Observability() {
  const [open,setOpen]=useState(3)
  return <div className="page"><div className="page-head"><div><p className="eyebrow">AI OPERATIONS</p><h1>Agent Observability</h1><p>Execution trace for GRV-1001</p></div><span className="estimate-label">Mock trace • Not live Langfuse data</span></div><Card className="workflow-card"><div className="workflow">{agentStages.map((stage,i)=><div className="workflow-node" key={stage.name}><div className={`node-dot ${stage.status==='Running'?'running':''}`}>{i+1}</div>{i<agentStages.length-1&&<div className="node-line"/>}<strong>{stage.name}</strong><small>{stage.status}</small></div>)}</div></Card>
    <div className="execution-list">{agentStages.map((stage,i)=><Card className="execution-card" key={stage.name}><button className="execution-summary" onClick={()=>setOpen(open===i?null:i)}><div className="execution-name"><span className={`execution-status ${stage.status.toLowerCase().replaceAll(' ','-')}`}/><div><strong>{stage.agent}</strong><p>{stage.name}</p></div></div><div className="execution-meta"><span>{stage.time}</span><span>{stage.duration}</span><strong>{stage.confidence}%</strong><ChevronDown size={17}/></div></button>{open===i&&<div className="execution-detail"><div><span>Input summary</span><p>{stage.input}</p></div><div><span>Output summary</span><p>{stage.output}</p></div><div className="reason"><span>Decision explanation</span><p>{stage.reason}</p></div><div className="audit-meta"><span><b>Actor</b> AI_SYSTEM</span><span><b>Model</b> Resolve-Orchestrator-v2</span><span><b>Timestamp</b> 25 Nov 2026, {stage.time}</span></div></div>}</Card>)}</div>
  </div>
}

function Departments() {
  const [query,setQuery]=useState('')
  const [selected,setSelected]=useState(null)
  const filtered=departments.filter(d=>d.name.toLowerCase().includes(query.toLowerCase())||d.id.toLowerCase().includes(query.toLowerCase()))
  return <div className="page"><div className="page-head"><div><p className="eyebrow">ORGANIZATION</p><h1>Departments</h1><p>Routing jurisdictions and operational performance</p></div></div><Card className="table-card"><div className="filters"><div className="table-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search departments"/></div></div><div className="responsive-table"><table><thead><tr><th>Department</th><th>Department ID</th><th>Assigned officer</th><th>Jurisdiction</th><th>Assigned cases</th><th>Pending</th><th>SLA performance</th><th>Webhook</th><th></th></tr></thead><tbody>{filtered.map(d=><tr key={d.id}><td><strong>{d.name}</strong></td><td>{d.id}</td><td>{d.officer}</td><td>{d.location||d.jurisdiction}</td><td>{d.assigned}</td><td>{d.pending}</td><td><div className="sla-bar"><i style={{width:d.sla+'%'}}/><span>{d.sla}%</span></div></td><td><StatusPill value={d.webhook}/></td><td><button className="row-button" onClick={()=>setSelected(d)}>Details</button></td></tr>)}</tbody></table></div></Card>{selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><Card className="modal" ><div className="card-head"><h2>{selected.name}</h2><button className="icon-btn" onClick={()=>setSelected(null)}><X size={18}/></button></div><dl><dt>Department ID</dt><dd>{selected.id}</dd><dt>Jurisdiction</dt><dd>{selected.jurisdiction}</dd><dt>Lead officer</dt><dd>{selected.officer}</dd><dt>Assigned / pending</dt><dd>{selected.assigned} / {selected.pending}</dd></dl><button className="primary" onClick={()=>{toast.success('Department profile saved');setSelected(null)}}>Save profile</button></Card></div>}</div>
}

function Officers() {
  const [list,setList]=useState(officers)
  const [selected,setSelected]=useState(null)
  const assign=(officer)=>{
    setList(list.map(o=>o.id===officer.id?{...o,assigned:o.assigned+1,workload:o.assigned+1>14?'High':'Medium'}:o))
    toast.success(`Mock assignment added to ${officer.name}`)
  }
  return <div className="page"><div className="page-head"><div><p className="eyebrow">STAFF MANAGEMENT</p><h1>Officers</h1><p>Workload and active assignments</p></div></div><div className="officer-grid">{list.map(o=><Card className="officer-card" key={o.id}><div className="officer-top"><div className="avatar">{o.name.split(' ').map(x=>x[0]).join('')}</div><span className={`active-dot ${o.active?'':'offline'}`}>{o.active?'Active':'Offline'}</span></div><h2>{o.name}</h2><p>{o.department}</p><div className="officer-stats"><div><span>Officer ID</span><strong>{o.id}</strong></div><div><span>Assigned</span><strong>{o.assigned}</strong></div><div><span>Workload</span><strong>{o.workload}</strong></div></div><button className="secondary" onClick={()=>setSelected(o)}>Assign grievance</button></Card>)}</div>{selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><Card className="modal"><div className="card-head"><h2>Assign grievance</h2><button className="icon-btn" onClick={()=>setSelected(null)}><X size={18}/></button></div><p>Choose an open grievance for <strong>{selected.name}</strong>.</p><select defaultValue="GRV-1002"><option>GRV-1002 — Road damage</option><option>GRV-1003 — Sanitation</option><option>GRV-1006 — Education</option></select><button className="primary" onClick={()=>{assign(selected);setSelected(null)}}>Confirm mock assignment</button></Card></div>}</div>
}

function SettingsPage() {
  const [toastEnabled,setToastEnabled]=useState(true)
  const [apiUrl,setApiUrl]=useState('')
  const [lang,setLang]=useState('English')
  return <div className="page"><div className="page-head"><div><p className="eyebrow">SYSTEM SETTINGS</p><h1>Settings</h1><p>Configure profile and integrations</p></div></div><div className="settings-grid"><Card><div className="card-head"><h2>Admin profile</h2></div><div className="profile-row"><div className="top-avatar large">AM</div><div><strong>Ananya Mehta</strong><p>District Administrator</p></div></div><label>Email<input defaultValue="ananya.mehta@resolveai.local"/></label><label>Dashboard language<select value={lang} onChange={e=>setLang(e.target.value)}><option>English</option><option>Marathi</option><option>Hindi</option></select></label></Card><Card><div className="card-head"><h2>Notification preferences</h2></div><label className="toggle-row"><span><strong>SLA and critical alerts</strong><small>Notify on breach risk and sensitive cases</small></span><input type="checkbox" checked={toastEnabled} onChange={e=>setToastEnabled(e.target.checked)}/></label><label className="toggle-row"><span><strong>Department updates</strong><small>Webhook and assignment status</small></span><input type="checkbox" defaultChecked/></label></Card><Card><div className="card-head"><h2>API configuration</h2><span className="estimate-label">Future integration</span></div><label>FastAPI base URL<input value={apiUrl} onChange={e=>setApiUrl(e.target.value)} placeholder="https://api.resolveai.local"/></label><label>MongoDB status<input disabled value="Not configured"/></label></Card><Card><div className="card-head"><h2>Observability</h2><span className="estimate-label">Placeholder</span></div><label>Langfuse public trace URL<input placeholder="https://..." /></label><p className="settings-note">No live trace URL is configured. Public links will only appear when an administrator provides one.</p><button className="primary" onClick={()=>toast.success('Settings saved locally for this demo')}>Save settings</button></Card></div></div>
}

function App() {
  const [open,setOpen]=useState(false)
  return <div className="app-shell"><Sidebar open={open} setOpen={setOpen}/><div className="main-shell"><Topbar setOpen={setOpen}/><main><Routes><Route path="/" element={<Overview/>}/><Route path="/overview" element={<Overview/>}/><Route path="/grievances" element={<Grievances/>}/><Route path="/grievances/:id" element={<GrievanceDetail/>}/><Route path="/intake" element={<Intake/>}/><Route path="/duplicates" element={<Duplicates/>}/><Route path="/predictive" element={<Predictive/>}/><Route path="/review" element={<Review/>}/><Route path="/observability" element={<Observability/>}/><Route path="/departments" element={<Departments/>}/><Route path="/officers" element={<Officers/>}/><Route path="/settings" element={<SettingsPage/>}/></Routes></main></div></div>
}

export default App
