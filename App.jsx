import { useMemo, useState } from "react";
import {
  LayoutDashboard, CalendarDays, Users, Clock3, CalendarCheck, Repeat2,
  Megaphone, FileText, BarChart3, Settings, Bell, Search, Plus, MapPin,
  ChevronRight, LogOut, BriefcaseBusiness, UserRoundCheck, Timer, Coffee
} from "lucide-react";

const people = [
  { name: "Fakhir", role: "Employee", shift: "Opening", status: "Clocked in" },
  { name: "Ayesha", role: "Employee", shift: "Middle", status: "Scheduled" },
  { name: "Hamza", role: "Employee", shift: "Closing", status: "Scheduled" },
  { name: "Shahnawaz", role: "Admin", shift: "Management", status: "Online" },
];

const rota = [
  { day:"Mon", date:"17", label:"Opening", time:"05:30 – 14:00", person:"Fakhir" },
  { day:"Tue", date:"18", label:"Middle", time:"12:00 – 17:00", person:"Ayesha" },
  { day:"Wed", date:"19", label:"Closing", time:"15:00 – 23:00", person:"Hamza" },
  { day:"Thu", date:"20", label:"Opening", time:"05:30 – 14:00", person:"Fakhir" },
];

const nav = [
  ["Dashboard", LayoutDashboard], ["Rota", CalendarDays], ["Employees", Users],
  ["Availability", CalendarCheck], ["Leave", Coffee], ["Shift swaps", Repeat2],
  ["Timesheets", Clock3], ["Announcements", Megaphone], ["Documents", FileText],
  ["Reports", BarChart3], ["Settings", Settings],
];

function Card({children, className=""}) {
  return <section className={`glass card ${className}`}>{children}</section>;
}

function App() {
  const [page, setPage] = useState("Dashboard");
  const [role, setRole] = useState("Admin");
  const [notice, setNotice] = useState("");
  const today = useMemo(() => "Monday, 17 August", []);

  const action = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 2300);
  };

  return (
    <div className="shell">
      <div className="orb one"/><div className="orb two"/>
      {notice && <div className="toast glass">{notice}</div>}

      <aside className="sidebar glass">
        <div className="brand">
          <div className="logo">O</div>
          <div><b>Omed</b><small>Workforce</small></div>
        </div>

        <div className="company">
          <BriefcaseBusiness size={16}/>
          <div><b>Lamiya Limited</b><small>Main Store</small></div>
        </div>

        <nav>
          {nav.map(([name, Icon]) => (
            <button key={name} onClick={()=>setPage(name)} className={page===name?"active":""}>
              <Icon size={18}/><span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="profile">
          <div className="avatar">{role === "Admin" ? "S" : "F"}</div>
          <div><b>{role === "Admin" ? "Shahnawaz" : "Fakhir"}</b><small>{role}</small></div>
          <button className="tiny" onClick={()=>setRole(role==="Admin"?"Employee":"Admin")}>↕</button>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="kicker">{today.toUpperCase()}</p>
            <h1>{page}</h1>
            <p className="sub">{page==="Dashboard" ? `Good morning, ${role==="Admin"?"Shahnawaz":"Fakhir"}. Here’s what’s happening today.` : `Manage ${page.toLowerCase()} for Lamiya Limited.`}</p>
          </div>
          <div className="headerActions">
            <button className="round glass"><Search size={18}/></button>
            <button className="round glass"><Bell size={18}/><i/></button>
            <button className="primary" onClick={()=>action("Action panel will connect to Supabase next.")}><Plus size={17}/> New</button>
          </div>
        </header>

        {page === "Dashboard" ? <Dashboard action={action} role={role}/> : <Module page={page} action={action}/>}
      </main>
    </div>
  );
}

function Dashboard({action, role}) {
  return <>
    <div className="stats">
      <Card><div className="statIcon"><Users/></div><span>Staff today</span><strong>12</strong><small>10 scheduled · 2 off</small></Card>
      <Card><div className="statIcon"><Timer/></div><span>Scheduled hours</span><strong>86.5</strong><small>This week</small></Card>
      <Card><div className="statIcon"><CalendarCheck/></div><span>Requests</span><strong>3</strong><small>Need attention</small></Card>
      <Card><div className="statIcon"><MapPin/></div><span>Location</span><strong className="smallStat">Main Store</strong><small>Lamiya Limited</small></Card>
    </div>

    <div className="grid">
      <Card className="wide">
        <Title title="This week's rota" sub="17 – 23 August" action="View full rota" onClick={()=>action("Opening rota")}/>
        <div className="rota">
          {rota.map(x=><div className="rotaRow" key={x.day+x.date}>
            <div className="date"><small>{x.day}</small><b>{x.date}</b></div>
            <div className={`stripe ${x.label.toLowerCase()}`}/>
            <div className="grow"><b>{x.label}</b><small>{x.time}</small></div>
            <div className="person"><div className="miniAvatar">{x.person[0]}</div>{x.person}</div>
            <ChevronRight size={17}/>
          </div>)}
        </div>
      </Card>

      <Card>
        <Title title="Live attendance" sub="Today"/>
        <div className="live"><span/><b>LIVE</b></div>
        <div className="bigNumber">8</div>
        <p className="sub">people currently clocked in</p>
        <div className="progress"><span/></div>
        <div className="three"><div><small>On time</small><b>7</b></div><div><small>Late</small><b>1</b></div><div><small>Not in</small><b>2</b></div></div>
      </Card>

      <Card className="wide">
        <Title title="Team" sub="Main Store" action="Manage employees" onClick={()=>action("Opening employees")}/>
        {people.map(p=><div className="employee" key={p.name}>
          <div className="avatar">{p.name[0]}</div>
          <div className="grow"><b>{p.name}</b><small>{p.role}</small></div>
          <span className="pill">{p.shift}</span>
          <span className="status">{p.status}</span>
        </div>)}
      </Card>

      <Card>
        <Title title={role==="Admin"?"Requests":"My next shift"} sub={role==="Admin"?"Needs your attention":"Upcoming"}/>
        <div className="request"><UserRoundCheck/><div className="grow"><b>{role==="Admin"?"Annual leave":"Opening"}</b><small>{role==="Admin"?"Fakhir · 24–26 Aug":"Tomorrow · 05:30–14:00"}</small></div><ChevronRight/></div>
        <div className="request"><Repeat2/><div className="grow"><b>{role==="Admin"?"Shift swap":"Availability"}</b><small>{role==="Admin"?"Ayesha · Closing":"Update next week"}</small></div><ChevronRight/></div>
      </Card>
    </div>
  </>;
}

function Title({title, sub, action, onClick}) {
  return <div className="title"><div><h3>{title}</h3><small>{sub}</small></div>{action&&<button onClick={onClick}>{action}<ChevronRight size={15}/></button>}</div>;
}

function Module({page, action}) {
  const descriptions = {
    Rota:"Build weekly rotas using Opening, Middle and Closing shifts.",
    Employees:"Add employees, assign roles, stores, departments and rates.",
    Availability:"Employees can submit available, unavailable and preferred hours.",
    Leave:"Request and approve annual leave, sickness and unpaid leave.",
    "Shift swaps":"Request swaps, accept replacements and approve changes.",
    Timesheets:"Review scheduled hours, clock-ins, clock-outs and attendance.",
    Announcements:"Publish company or store announcements.",
    Documents:"Store contracts, policies and employee documents securely.",
    Reports:"Review staffing, attendance, overtime, absence and payroll exports.",
    Settings:"Manage company, locations, permissions and Omed preferences."
  };
  return <Card className="module">
    <div className="moduleIcon"><CalendarDays size={30}/></div>
    <p className="kicker">OMED MODULE</p>
    <h2>{page}</h2>
    <p className="sub">{descriptions[page]}</p>
    <button className="primary" onClick={()=>action(`${page}: demo action ready`)}><Plus size={17}/> Add new</button>
    <div className="coming"><b>UI ready</b><span>Supabase connection comes next.</span></div>
  </Card>;
}

export default App;