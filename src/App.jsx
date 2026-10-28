
import { useEffect, useMemo, useState } from "react";
import {
  Landmark, LayoutDashboard, Map, FileText, Lightbulb,
  MessageSquare, LogOut, Search, Printer, ChevronRight,
  ClipboardList, Users, CheckCircle, Clock, AlertTriangle,
  ArrowLeft, Send, ThumbsUp, ThumbsDown, Menu, X
} from "lucide-react";
import "./App.css";

const wards = Array.from({ length: 19 }, (_, i) => ({
  id: i + 1,
  name: `Ward ${String(i + 1).padStart(2, "0")}`,
}));

const initialIssues = [
  { id: "ISS-001", ward: 4, category: "Waterlogging", description: "Water accumulates near residential roads during heavy rain.", responses: 86, priority: "High", status: "Reported" },
  { id: "ISS-002", ward: 11, category: "Drinking water", description: "Residents report irregular drinking water supply.", responses: 73, priority: "High", status: "Under Review" },
  { id: "ISS-003", ward: 7, category: "Road maintenance", description: "Damaged road sections require inspection and repair.", responses: 52, priority: "Medium", status: "In Progress" },
  { id: "ISS-004", ward: 2, category: "Waste management", description: "Residents report inconsistent waste collection.", responses: 48, priority: "Medium", status: "Reported" },
  { id: "ISS-005", ward: 15, category: "Street lighting", description: "Several street lights need inspection.", responses: 31, priority: "Low", status: "Resolved" },
  { id: "ISS-006", ward: 4, category: "Drainage", description: "Drainage channels need cleaning before monsoon.", responses: 64, priority: "High", status: "Under Review" },
];

const recommendations = [
  {
    id: "REC-001",
    title: "Prioritise drainage inspection",
    ward: 4,
    category: "Waterlogging",
    priority: "High",
    confidence: "Evidence-based suggestion",
    reason: "Multiple survey responses identify waterlogging and drainage concerns in Ward 04.",
    action: "Conduct a field inspection, map affected locations and estimate the required maintenance work.",
    source: "Illustrative source: ward survey responses and issue register",
  },
  {
    id: "REC-002",
    title: "Assess drinking water availability",
    ward: 11,
    category: "Drinking water",
    priority: "High",
    confidence: "Evidence-based suggestion",
    reason: "Survey responses indicate recurring concerns about the reliability of water supply.",
    action: "Verify the affected households, consult the responsible department and document possible interventions.",
    source: "Illustrative source: household survey responses",
  },
  {
    id: "REC-003",
    title: "Prepare a road maintenance proposal",
    ward: 7,
    category: "Road maintenance",
    priority: "Medium",
    confidence: "Evidence-based suggestion",
    reason: "Reported road damage may affect access and requires verification at the affected locations.",
    action: "Inspect the road, estimate repair requirements and assess available development funds.",
    source: "Illustrative source: issue register and ward information",
  },
];

const initialApplications = [
  { id: "APP-0142", name: "Resident A", service: "Water supply complaint", ward: 4, status: "Under Review" },
  { id: "APP-0141", name: "Resident B", service: "Road maintenance", ward: 7, status: "Reported" },
  { id: "APP-0140", name: "Resident C", service: "Street lighting", ward: 15, status: "Resolved" },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Ward Analysis", icon: Map },
  { label: "Issue Register", icon: ClipboardList },
  { label: "AI Recommendations", icon: Lightbulb },
  { label: "Citizen Requests", icon: MessageSquare },
  { label: "Reports", icon: FileText },
];

function Header({ role, user, onLogout, onMenu }) {
  return (
    <header className="portal-header">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className="header-breadcrumb">
        <span>Home</span><span>/</span><strong>{role === "official" ? "Administration" : "Citizen Services"}</strong>
      </div>
      <div className="header-user">
        <span className="user-initials">{user.slice(0, 1).toUpperCase()}</span>
        <div>
          <strong>{user}</strong>
          <small>{role === "official" ? "Panchayat Official" : "Citizen"}</small>
        </div>
        <button className="plain-icon" title="Sign out" onClick={onLogout}>
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ page, setPage, role, open, close }) {
  const items = role === "official"
    ? navigation
    : [
        { label: "Dashboard", icon: LayoutDashboard },
        { label: "Submit an Issue", icon: MessageSquare },
        { label: "Citizen Requests", icon: ClipboardList },
      ];

  return (
    <>
      {open && <button className="mobile-overlay" onClick={close} aria-label="Close menu" />}
      <aside className={`portal-sidebar ${open ? "sidebar-visible" : ""}`}>
        <div className="portal-brand">
          <div className="brand-seal"><Landmark size={25} /></div>
          <div>
            <strong>Kanjikuzhi</strong>
            <small>GRAM PANCHAYAT</small>
          </div>
          <button className="sidebar-close" onClick={close} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <p className="sidebar-heading">MAIN MENU</p>
        <nav>
          {items.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => { setPage(label); close(); }}
              className={`sidebar-link ${page === label ? "sidebar-link-active" : ""}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {page === label && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          {/* <strong>19 Wards</strong> */}
          <p>Local issues and development monitoring</p>
          <span>Academic demonstration system</span>
        </div>
      </aside>
    </>
  );
}

function Login({ onLogin }) {
  const [role, setRole] = useState("official");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    onLogin(role, name.trim() || (role === "official" ? "Panchayat Officer" : "Citizen"));
  }

  return (
    <div className="login-page">
      <div className="login-topline">
        <span>LOCAL SELF GOVERNMENT · KERALA</span>
        <span>ACADEMIC PROJECT DEMONSTRATION</span>
      </div>

      <header className="login-masthead">
        <div className="login-seal"><Landmark size={30} /></div>
        <div>
          <p>GRAM PANCHAYAT OFFICE</p>
          <h1>Implementation Officer Support System</h1>
          <span>Kanjikuzhi Gram Panchayat, Alappuzha</span>
        </div>
      </header>

      <div className="login-layout">
        <section className="login-intro">
          <p className="section-kicker">LOCAL DEVELOPMENT · PUBLIC PARTICIPATION</p>
          <h2>Better information.<br />Better local decisions.</h2>
          <p>
            A support system for understanding household needs, identifying
            priority issues and planning evidence-informed local interventions.
          </p>

          <div className="login-feature">
            <CheckCircle size={19} />
            <div><strong>Ward-level insights</strong><span>Understand recurring issues across 19 wards.</span></div>
          </div>
          <div className="login-feature">
            <CheckCircle size={19} />
            <div><strong>Evidence-based recommendations</strong><span>Review suggestions alongside supporting information.</span></div>
          </div>
          <div className="login-feature">
            <CheckCircle size={19} />
            <div><strong>Officer-led decisions</strong><span>Officials remain responsible for final decisions.</span></div>
          </div>
        </section>

        <section className="login-box">
          <h2>Portal Login</h2>
          <p>Select the type of account you want to access.</p>

          <div className="role-tabs">
            <button type="button" className={role === "official" ? "role-selected" : ""} onClick={() => setRole("official")}>
              <Landmark size={17} /> Panchayat Official
            </button>
            <button type="button" className={role === "citizen" ? "role-selected" : ""} onClick={() => setRole("citizen")}>
              <Users size={17} /> Citizen
            </button>
          </div>

          <form onSubmit={submit}>
            <label>
              {role === "official" ? "Official username" : "Citizen name"}
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "official" ? "Enter your username" : "Enter your name"} />
            </label>
            <label>
              {role === "official" ? "Password" : "Password / access code"}
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Demo mode — any value accepted" />
            </label>
            <button className="login-submit" type="submit">Continue to portal →</button>
          </form>

          <p className="login-demo">
            Demonstration login only. This screen does not authenticate
            credentials or protect data. Production login requires a secure backend.
          </p>
        </section>
      </div>

      <footer className="login-footer">
        Panchayat Implementation Support Project · Student demonstration
      </footer>
    </div>
  );
}

function Metric({ title, value, note, icon: Icon }) {
  return (
    <div className="metric-box">
      <div className="metric-label">{title}</div>
      <div className="metric-value-row">
        <strong>{value}</strong>
        <Icon size={21} />
      </div>
      <div className="metric-note">{note}</div>
    </div>
  );
}

function Status({ value }) {
  return <span className={`record-status status-${value.toLowerCase().replaceAll(" ", "-")}`}>{value}</span>;
}

function Dashboard({ issues, setPage }) {
  const unresolved = issues.filter(i => i.status !== "Resolved");
  const highPriority = unresolved.filter(i => i.priority === "High");

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="section-kicker">PANCHAYAT ADMINISTRATION</p>
          <h1>Implementation Officer Dashboard</h1>
          <p>Overview of reported issues, ward coverage and suggested interventions.</p>
        </div>
        <button className="government-button" onClick={() => window.print()}>
          <Printer size={16} /> Export as PDF
        </button>
      </div>

      <div className="notice-strip">
        <strong>Note:</strong> The figures below are illustrative demo data and must be replaced with verified Panchayat records.
      </div>

      <section className="metrics-grid">
        <Metric title="Wards covered" value="19" note="All Panchayat wards" icon={Map} />
        <Metric title="Survey responses" value="1,284" note="Illustrative sample total" icon={Users} />
        <Metric title="Issues requiring action" value={unresolved.length} note="Based on displayed sample records" icon={Clock} />
        <Metric title="High-priority issues" value={highPriority.length} note="Requires officer verification" icon={AlertTriangle} />
      </section>

      <section className="content-panel">
        <div className="panel-title">
          <h2>Priority issue register</h2>
          <button className="text-link" onClick={() => setPage("Issue Register")}>View all issues →</button>
        </div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>ISSUE ID</th><th>WARD</th><th>ISSUE CATEGORY</th><th>RESPONSES</th><th>PRIORITY</th><th>STATUS</th></tr></thead>
            <tbody>
              {issues.filter(i => i.status !== "Resolved").slice(0, 5).map(issue => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>{String(issue.ward).padStart(2, "0")}</td>
                  <td>{issue.category}</td>
                  <td>{issue.responses}</td>
                  <td><Status value={issue.priority} /></td>
                  <td><Status value={issue.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="dashboard-lower">
        <section className="content-panel">
          <div className="panel-title"><h2>Ward overview</h2><span className="muted-small">Sample counts</span></div>
          <div className="ward-list">
            {[4, 11, 7, 2, 15].map(ward => {
              const count = issues.filter(i => i.ward === ward && i.status !== "Resolved").length;
              return (
                <div className="ward-row" key={ward}>
                  <span>Ward {String(ward).padStart(2, "0")}</span>
                  <div className="ward-bar"><span style={{ width: `${Math.max(count * 35, 12)}%` }} /></div>
                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>
          <button className="plain-action" onClick={() => setPage("Ward Analysis")}>Open ward analysis →</button>
        </section>

        <section className="content-panel">
          <div className="panel-title"><h2>AI-assisted recommendations</h2></div>
          {recommendations.slice(0, 2).map(rec => (
            <div className="recommendation-preview" key={rec.id}>
              <strong>{rec.title}</strong>
              <p>Ward {String(rec.ward).padStart(2, "0")} · {rec.category}</p>
            </div>
          ))}
          <p className="muted-small">Sample recommendations, not live AI output.</p>
          <button className="plain-action" onClick={() => setPage("AI Recommendations")}>Review recommendations →</button>
        </section>
      </div>
    </>
  );
}

function WardAnalysis({ issues }) {
  return (
    <>
      <div className="page-title-row"><div><p className="section-kicker">LOCAL AREA ANALYSIS</p><h1>Ward Analysis</h1><p>Compare reported issues across Panchayat wards.</p></div></div>
      <div className="content-panel">
        <div className="panel-title"><h2>Ward-wise issue summary</h2></div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>WARD</th><th>ISSUES RECORDED</th><th>HIGH PRIORITY</th><th>RESOLVED</th><th>OBSERVATION</th></tr></thead>
            <tbody>
              {wards.map(w => {
                const wardIssues = issues.filter(i => i.ward === w.id);
                const high = wardIssues.filter(i => i.priority === "High" && i.status !== "Resolved").length;
                const resolved = wardIssues.filter(i => i.status === "Resolved").length;
                return <tr key={w.id}><td>{w.name}</td><td>{wardIssues.length}</td><td>{high}</td><td>{resolved}</td><td>{high ? "Requires attention" : wardIssues.length ? "Routine monitoring" : "No sample records"}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
        <p className="data-note">This comparison uses the small demonstration issue set, not complete ward survey data.</p>
      </div>
    </>
  );
}

function IssueRegister({ issues, setIssues }) {
  const [query, setQuery] = useState("");
  const [ward, setWard] = useState("All");
  const [status, setStatus] = useState("All");

  const visible = useMemo(() => issues.filter(i =>
    `${i.id} ${i.category} ${i.description}`.toLowerCase().includes(query.toLowerCase()) &&
    (ward === "All" || String(i.ward) === ward) &&
    (status === "All" || i.status === status)
  ), [issues, query, ward, status]);

  return (
    <>
      <div className="page-title-row"><div><p className="section-kicker">RECORD MANAGEMENT</p><h1>Issue Register</h1><p>Search, filter and update local issues.</p></div></div>
      <section className="content-panel">
        <div className="filter-bar">
          <label className="search-field"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search issue or category"/></label>
          <label>Ward <select value={ward} onChange={e => setWard(e.target.value)}><option>All</option>{wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
          <label>Status <select value={status} onChange={e => setStatus(e.target.value)}><option>All</option>{["Reported", "Under Review", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}</select></label>
        </div>
        <div className="responsive-table">
          <table>
            <thead><tr><th>ID</th><th>WARD</th><th>CATEGORY / DESCRIPTION</th><th>RESPONSES</th><th>PRIORITY</th><th>STATUS</th></tr></thead>
            <tbody>
              {visible.map(issue => <tr key={issue.id}>
                <td>{issue.id}</td><td>{String(issue.ward).padStart(2, "0")}</td>
                <td><strong>{issue.category}</strong><br/><span className="description-text">{issue.description}</span></td>
                <td>{issue.responses}</td><td><Status value={issue.priority}/></td>
                <td><select className="status-select" value={issue.status} onChange={e => setIssues(current => current.map(i => i.id === issue.id ? {...i, status: e.target.value} : i))}>{["Reported", "Under Review", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}</select></td>
              </tr>)}
              {!visible.length && <tr><td colSpan="6">No matching issues found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Recommendations({ decisions, setDecisions }) {
  return (
    <>
      <div className="page-title-row"><div><p className="section-kicker">DECISION SUPPORT</p><h1>AI Recommendations</h1><p>Review suggested interventions and the evidence behind each suggestion.</p></div></div>
      <div className="notice-strip"><strong>Human review required.</strong> Recommendations support the implementation officer and do not automatically approve budgets or initiate public works.</div>
      {recommendations.map(rec => (
        <section className="content-panel recommendation-card" key={rec.id}>
          <div className="recommendation-heading">
            <div><span className="recommendation-id">{rec.id}</span><h2>{rec.title}</h2><p>Ward {String(rec.ward).padStart(2, "0")} · {rec.category}</p></div>
            <Status value={rec.priority}/>
          </div>
          <div className="evidence-block"><strong>Why is this suggested?</strong><p>{rec.reason}</p></div>
          <div className="evidence-block"><strong>Suggested next step</strong><p>{rec.action}</p></div>
          <p className="source-note">{rec.source}</p>
          <div className="recommendation-actions">
            <span>Officer decision: <strong>{decisions[rec.id] || "Awaiting review"}</strong></span>
            <div>
              <button className="decision-button accept" onClick={() => setDecisions(d => ({...d, [rec.id]: "Accepted for consideration"}))}><ThumbsUp size={15}/> Accept</button>
              <button className="decision-button reject" onClick={() => setDecisions(d => ({...d, [rec.id]: "Not accepted"}))}><ThumbsDown size={15}/> Reject</button>
            </div>
          </div>
        </section>
      ))}
      <p className="data-note">All recommendations are illustrative. A production version should display real evidence, retrieved scheme references, model details and decision history.</p>
    </>
  );
}

function CitizenDashboard({ user, requests, setPage }) {
  const mine = showAll ? requests.filter(req => req.id.startsWith("REQ-")) : requests.filter(req => req.name === user && req.id.startsWith("REQ-"));
  const open = mine.filter(req => req.status !== "Resolved").length;
  const underReview = mine.filter(req => req.status === "Under Review").length;
  const resolved = mine.filter(req => req.status === "Resolved").length;

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="section-kicker">CITIZEN SERVICES</p>
          <h1>Citizen Dashboard</h1>
          <p>Submit local issues and track requests sent through this demonstration portal.</p>
        </div>
        <button className="government-button" onClick={() => setPage("Submit an Issue")}>
          <Send size={15} /> Submit an Issue
        </button>
      </div>

      <div className="notice-strip">
        <strong>Demonstration portal:</strong> Submissions are saved in this browser only. They are not sent to the actual Panchayat office.
      </div>

      <section className="metrics-grid citizen-metrics">
        <Metric title="Your requests" value={mine.length} note="Submitted using this name" icon={ClipboardList} />
        <Metric title="Open requests" value={open} note="Not yet resolved" icon={Clock} />
        <Metric title="Under review" value={underReview} note="Being checked by an official" icon={Search} />
        <Metric title="Resolved" value={resolved} note="Marked as resolved" icon={CheckCircle} />
      </section>

      <section className="content-panel">
        <div className="panel-title">
          <h2>Recent requests</h2>
          <button className="text-link" onClick={() => setPage("Citizen Requests")}>View all requests →</button>
        </div>
        <CitizenRequestTable requests={mine.slice(0, 5)} />
      </section>

      <section className="content-panel citizen-help-panel">
        <div className="panel-title"><h2>How it works</h2></div>
        <div className="citizen-steps">
          <div><strong>1. Submit</strong><p>Choose the ward and issue category, then describe the local problem.</p></div>
          <div><strong>2. Review</strong><p>A Panchayat official can review the request and update its status.</p></div>
          <div><strong>3. Track</strong><p>Return to Citizen Requests to see the latest status.</p></div>
        </div>
      </section>
    </>
  );
}

function CitizenRequestTable({ requests }) {
  if (!requests.length) {
    return <div className="citizen-empty-state">
      <ClipboardList size={27} />
      <strong>No requests submitted yet</strong>
      <span>Choose “Submit an Issue” to create your first demonstration request.</span>
    </div>;
  }

  return (
    <div className="responsive-table">
      <table>
        <thead><tr><th>REFERENCE</th><th>SERVICE / ISSUE</th><th>WARD</th><th>STATUS</th></tr></thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.service}</td>
              <td>{String(req.ward).padStart(2, "0")}</td>
              <td><Status value={req.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CitizenRequests({ requests, onSubmitIssue, user, showForm = false, showAll = false }) {
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const mine = showAll ? requests.filter(req => req.id.startsWith("REQ-")) : requests.filter(req => req.name === user && req.id.startsWith("REQ-"));
  const visible = mine.filter(req =>
    `${req.id} ${req.service} ${req.status}`.toLowerCase().includes(search.toLowerCase()) &&
    (wardFilter === "All" || String(req.ward) === wardFilter) &&
    (categoryFilter === "All" || req.service === categoryFilter)
  );

  return (
    <>
      <div className="page-title-row">
        <div>
          <p className="section-kicker">PUBLIC PARTICIPATION</p>
          <h1>{showForm ? "Submit an Issue" : "Citizen Requests"}</h1>
          <p>{showForm ? "Report a local problem to the demonstration issue register." : "View and track the requests submitted using your citizen name."}</p>
        </div>
        {!showForm && <button className="government-button" onClick={() => window.print()}><Printer size={15} /> Print requests</button>}
      </div>

      {showForm && <form className="content-panel citizen-form" onSubmit={onSubmitIssue}>
        <h2>Report a local issue</h2>
        <p className="form-intro">Please provide enough detail to help the implementation officer understand the problem.</p>
        <div className="citizen-form-grid">
          <label>Ward
            <select name="ward" required defaultValue="1">
              {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </label>
          <label>Issue category
            <select name="category" required defaultValue="Waterlogging">
              {["Waterlogging", "Drinking water", "Road maintenance", "Waste management", "Street lighting", "Drainage", "Public health", "Other"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
        </div>
        <label>Location / landmark
          <input name="location" required maxLength={160} placeholder="e.g. near the bus stop or community hall" />
        </label>
        <label>Describe the issue
          <textarea name="description" required minLength={10} maxLength={1200} placeholder="Explain the problem, where it occurs and how it affects residents..." rows={5}/>
        </label>
        <div className="citizen-form-actions">
          <button className="government-button" type="submit"><Send size={15}/> Submit demonstration report</button>
          <button className="citizen-reset-button" type="reset">Clear form</button>
        </div>
        <p className="data-note">Demo submissions are stored in this browser only and are not sent to the Panchayat. Do not include sensitive personal information.</p>
      </form>}

      {!showForm && <section className="content-panel">
        <div className="filter-bar">
          <label className="search-field"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reference or issue"/></label>
          <label>Ward <select value={wardFilter} onChange={e => setWardFilter(e.target.value)}><option value="All">All wards</option>{wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
          <label>Category <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="All">All categories</option>{[...new Set(mine.map(req => req.service))].map(c => <option key={c}>{c}</option>)}</select></label>
        </div>
        <div className="panel-title"><h2>Your submitted requests</h2><span className="muted-small">{visible.length} request(s)</span></div>
        <CitizenRequestTable requests={visible} />
        <p className="data-note">Requests are associated with the name used at demo login. This is not secure identity verification.</p>
      </section>}
    </>
  );
}

function Reports({ issues }) {
  const counts = [
    ["Total recorded issues", issues.length],
    ["Reported", issues.filter(i => i.status === "Reported").length],
    ["Under review", issues.filter(i => i.status === "Under Review").length],
    ["In progress", issues.filter(i => i.status === "In Progress").length],
    ["Resolved", issues.filter(i => i.status === "Resolved").length],
  ];

  return (
    <>
      <div className="page-title-row"><div><p className="section-kicker">REPORTING AND DOCUMENTATION</p><h1>Reports</h1><p>Prepare a printable overview of the currently displayed sample data.</p></div><button className="government-button" onClick={() => window.print()}><Printer size={16}/> Export as PDF</button></div>
      <section className="content-panel report-print-area">
        <div className="report-heading">
          <Landmark size={28}/>
          <div><h2>Kanjikuzhi Gram Panchayat</h2><p>Implementation Officer Support System</p><p>Issue status summary · Demonstration report</p></div>
        </div>
        <table><thead><tr><th>INDICATOR</th><th>COUNT</th></tr></thead><tbody>{counts.map(([name, value]) => <tr key={name}><td>{name}</td><td>{value}</td></tr>)}</tbody></table>
        <h2 className="report-subheading">Issue details</h2>
        <div className="responsive-table"><table><thead><tr><th>Reference</th><th>Ward</th><th>Category</th><th>Priority</th><th>Status</th></tr></thead><tbody>{issues.map(i => <tr key={i.id}><td>{i.id}</td><td>{i.ward}</td><td>{i.category}</td><td>{i.priority}</td><td>{i.status}</td></tr>)}</tbody></table></div>
        <p className="data-note">Generated from frontend demonstration data. Verify records before using for official decisions.</p>
      </section>
    </>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [issues, setIssues] = useState(() => {
    try {
      const saved = localStorage.getItem("kanjikuzhi-demo-issues");
      return saved ? JSON.parse(saved) : initialIssues;
    } catch { return initialIssues; }
  });
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("kanjikuzhi-demo-requests");
      return saved ? JSON.parse(saved) : initialApplications;
    } catch { return initialApplications; }
  });
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    try { localStorage.setItem("kanjikuzhi-demo-issues", JSON.stringify(issues)); } catch {}
  }, [issues]);

  useEffect(() => {
    try { localStorage.setItem("kanjikuzhi-demo-requests", JSON.stringify(requests)); } catch {}
  }, [requests]);

  // Keep citizen-facing request status in sync with the official issue register.
  useEffect(() => {
    setRequests(current => current.map(req => {
      if (!req.issueId) return req;
      const linkedIssue = issues.find(issue => issue.id === req.issueId);
      return linkedIssue && linkedIssue.status !== req.status
        ? { ...req, status: linkedIssue.status }
        : req;
    }));
  }, [issues]);

  function login(role, user) {
    setSession({ role, user });
    setPage("Dashboard");
  }

  function submitIssue(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ward = Number(form.get("ward"));
    const category = String(form.get("category"));
    const description = String(form.get("description")).trim();
    const location = String(form.get("location") || "").trim();

    if (!description || description.length < 10 || !location) {
      window.alert("Please enter a location and a description of at least 10 characters.");
      return;
    }

    const id = `ISS-${Date.now().toString().slice(-6)}`;
    const requestId = `REQ-${Date.now().toString().slice(-6)}`;

    setIssues(current => [{
      id, ward, category, description, location, submittedBy: session.user,
      responses: 1, priority: "Medium", status: "Reported",
    }, ...current]);

    setRequests(current => [{
      id: requestId,
      issueId: id,
      name: session.user,
      service: category,
      description,
      location,
      ward,
      status: "Reported",
      submittedAt: new Date().toISOString(),
    }, ...current]);

    event.currentTarget.reset();
    window.alert(`Your demo request was submitted successfully. Reference: ${requestId}. It has not been sent to a real Panchayat office.`);
    setPage("Citizen Requests");
  }

  if (!session) return <Login onLogin={login} />;

  const isOfficial = session.role === "official";

  const pageContent = () => {
    if (isOfficial) {
      if (page === "Dashboard") return <Dashboard issues={issues} setPage={setPage}/>;
      if (page === "Ward Analysis") return <WardAnalysis issues={issues}/>;
      if (page === "Issue Register") return <IssueRegister issues={issues} setIssues={setIssues}/>;
      if (page === "AI Recommendations") return <Recommendations decisions={decisions} setDecisions={setDecisions}/>;
      if (page === "Citizen Requests") return <CitizenRequests requests={requests} user={session.user} showAll/>;
      if (page === "Reports") return <Reports issues={issues}/>;
      return <Dashboard issues={issues} setPage={setPage}/>;
    }

    if (page === "Submit an Issue") {
      return <CitizenRequests requests={requests} user={session.user} onSubmitIssue={submitIssue} showForm />;
    }
    if (page === "Citizen Requests") {
      return <CitizenRequests requests={requests} user={session.user} />;
    }
    return <CitizenDashboard user={session.user} requests={requests} setPage={setPage}/>;
  };

  return (
    <div className="portal-app">
      <Sidebar page={page} setPage={setPage} role={session.role} open={menuOpen} close={() => setMenuOpen(false)}/>
      <div className="portal-main">
        <Header role={session.role} user={session.user} onLogout={() => { setSession(null); setPage("Dashboard"); }} onMenu={() => setMenuOpen(true)}/>
        <main className="portal-content" key={`${session.role}-${page}`}>
          {pageContent()}
          <footer className="portal-footer">
            <span>Kanjikuzhi Gram Panchayat · Student Project</span>
            <span>Sample data · For demonstration only</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
