import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Clock3,
  CalendarCheck,
  Repeat2,
  Megaphone,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  MapPin,
  LogOut,
  BriefcaseBusiness,
  Coffee,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { supabase } from "./supabase.js";

const navigation = [
  ["Dashboard", LayoutDashboard],
  ["Rota", CalendarDays],
  ["Employees", Users],
  ["Availability", CalendarCheck],
  ["Leave", Coffee],
  ["Shift swaps", Repeat2],
  ["Timesheets", Clock3],
  ["Announcements", Megaphone],
  ["Documents", FileText],
  ["Reports", BarChart3],
  ["Settings", Settings],
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="loginPage">
      <div className="loginGlow loginGlowOne"></div>
      <div className="loginGlow loginGlowTwo"></div>

      <div className="loginCard glass">
        <div className="loginLogo">O</div>

        <div className="loginIntro">
          <span>OMED</span>

          <h1>Welcome back.</h1>

          <p>Sign in to your workplace.</p>
        </div>

        <form onSubmit={login} className="loginForm">
          <label>
            Email

            <input
              type="email"
              value={email}
              placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password

            <div className="passwordField">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </label>

          {error && (
            <div className="loginError">
              {error}
            </div>
          )}

          <button
            className="loginSubmit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="loginBottom">
          No public signup · Accounts are created by your company
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="loadingPage">
      <div className="loginLogo">O</div>
      <Loader2 size={25} className="spin" />
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [page, setPage] = useState("Dashboard");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function start() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        await loadProfile(session.user.id);
      }

      setLoading(false);
    }

    start();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (newSession) {
          setLoading(true);

          await loadProfile(
            newSession.user.id
          );

          setLoading(false);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(userId) {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        company_id,
        location_id,
        companies (
          name
        ),
        locations (
          name
        )
      `)
      .eq("id", userId)
      .single();

    if (error) {
      console.error(
        "Profile error:",
        error
      );

      setProfile(null);

      return;
    }

    setProfile(data);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    return <Login />;
  }

  if (!profile) {
    return (
      <div className="loadingPage">
        <div className="glass accountProblem">
          <h2>Account needs setup</h2>

          <p>
            Your login works, but your Omed profile has not been
            assigned to a company yet.
          </p>

          <button
            className="primary"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const roleName = {
    admin: "Admin",
    area_manager: "Area Manager",
    store_manager: "Store Manager",
    employee: "Employee",
  };

  const isManager = [
    "admin",
    "area_manager",
    "store_manager",
  ].includes(profile.role);

  const name =
    profile.full_name ||
    session.user.email;

  const companyName =
    profile.companies?.name ||
    "Omed";

  const locationName =
    profile.locations?.name ||
    "No store";

  return (
    <div className="shell">
      <div className="orb one"></div>
      <div className="orb two"></div>

      <aside className="sidebar glass">
        <div className="brand">
          <div className="logo">
            O
          </div>

          <div>
            <b>Omed</b>
            <small>Workforce</small>
          </div>
        </div>

        <div className="company">
          <BriefcaseBusiness size={16} />

          <div>
            <b>{companyName}</b>
            <small>{locationName}</small>
          </div>
        </div>

        <nav>
          {navigation.map(
            ([label, Icon]) => {
              if (
                profile.role === "employee" &&
                ["Employees", "Reports"].includes(label)
              ) {
                return null;
              }

              return (
                <button
                  key={label}
                  onClick={() =>
                    setPage(label)
                  }
                  className={
                    page === label
                      ? "active"
                      : ""
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            }
          )}
        </nav>

        <div className="profile">
          <div className="avatar">
            {name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <b>{name}</b>

            <small>
              {roleName[
                profile.role
              ]}
            </small>
          </div>

          <button
            className="tiny"
            onClick={signOut}
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="kicker">
              {companyName.toUpperCase()}
            </p>

            <h1>{page}</h1>

            <p className="sub">
              {page === "Dashboard"
                ? `Good morning, ${name}.`
                : `Manage ${page.toLowerCase()}.`}
            </p>
          </div>

          <div className="headerActions">
            <button className="round glass">
              <Search size={18} />
            </button>

            <button className="round glass">
              <Bell size={18} />
              <i></i>
            </button>

            {isManager && (
              <button className="primary">
                <Plus size={17} />
                New
              </button>
            )}
          </div>
        </header>

        {page === "Dashboard" ? (
          <Dashboard
            name={name}
            isManager={isManager}
            locationName={locationName}
          />
        ) : (
          <Module
            page={page}
            isManager={isManager}
          />
        )}
      </main>
    </div>
  );
}

function Dashboard({
  isManager,
  locationName,
}) {
  return (
    <>
      <div className="stats">
        <section className="glass card">
          <div className="statIcon">
            <Users size={18} />
          </div>

          <span>
            {isManager
              ? "Staff today"
              : "Next shift"}
          </span>

          <strong>
            {isManager
              ? "12"
              : "Opening"}
          </strong>

          <small>
            {isManager
              ? "10 scheduled · 2 off"
              : "05:30 – 14:00"}
          </small>
        </section>

        <section className="glass card">
          <div className="statIcon">
            <Clock3 size={18} />
          </div>

          <span>
            Hours this week
          </span>

          <strong>32.5</strong>

          <small>Scheduled</small>
        </section>

        <section className="glass card">
          <div className="statIcon">
            <CalendarCheck
              size={18}
            />
          </div>

          <span>Requests</span>

          <strong>
            {isManager ? "3" : "0"}
          </strong>

          <small>
            {isManager
              ? "Need attention"
              : "Pending"}
          </small>
        </section>

        <section className="glass card">
          <div className="statIcon">
            <MapPin size={18} />
          </div>

          <span>Location</span>

          <strong className="smallStat">
            {locationName}
          </strong>

          <small>
            Current workplace
          </small>
        </section>
      </div>

      <div className="grid">
        <section className="glass card wide">
          <div className="title">
            <div>
              <h3>
                {isManager
                  ? "This week's rota"
                  : "My rota"}
              </h3>

              <small>
                Opening · Middle · Closing
              </small>
            </div>
          </div>

          <div className="rota">
            {[
              ["Mon", "17", "Opening", "05:30 – 14:00"],
              ["Tue", "18", "Middle", "12:00 – 17:00"],
              ["Wed", "19", "Closing", "15:00 – 23:00"],
            ].map(
              ([day, date, shift, time]) => (
                <div
                  className="rotaRow"
                  key={day}
                >
                  <div className="date">
                    <small>{day}</small>
                    <b>{date}</b>
                  </div>

                  <div
                    className={`stripe ${shift.toLowerCase()}`}
                  ></div>

                  <div className="grow">
                    <b>{shift}</b>
                    <small>{time}</small>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section className="glass card">
          <div className="title">
            <div>
              <h3>
                {isManager
                  ? "Live attendance"
                  : "Clock in"}
              </h3>

              <small>Today</small>
            </div>
          </div>

          {isManager ? (
            <>
              <div className="bigNumber">
                8
              </div>

              <p className="sub">
                people currently clocked
                in
              </p>

              <div className="progress">
                <span></span>
              </div>
            </>
          ) : (
            <div className="clockPanel">
              <Clock3 size={30} />

              <h2>
                Ready for work?
              </h2>

              <p className="sub">
                Your clock-in button will
                connect to Supabase next.
              </p>

              <button className="primary clockButton">
                Clock in
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Module({
  page,
  isManager,
}) {
  const text = {
    Rota:
      "Create and manage Opening, Middle and Closing shifts.",
    Employees:
      "Manage employees, managers, stores and roles.",
    Availability:
      "Employees can submit their availability.",
    Leave:
      "Request and manage annual leave and sickness.",
    "Shift swaps":
      "Request and approve shift swaps.",
    Timesheets:
      "Review clock-in and clock-out records.",
    Announcements:
      "Publish company and store announcements.",
    Documents:
      "Manage employee and company documents.",
    Reports:
      "View attendance and staffing reports.",
    Settings:
      "Manage company and Omed settings.",
  };

  return (
    <section className="glass card module">
      <div className="moduleIcon">
        <CalendarDays size={30} />
      </div>

      <p className="kicker">
        OMED
      </p>

      <h2>{page}</h2>

      <p className="sub">
        {text[page]}
      </p>

      {isManager && (
        <button className="primary">
          <Plus size={17} />
          Add new
        </button>
      )}

      <div className="coming">
        <b>Login connected</b>

        <span>
          Real module functionality next
        </span>
      </div>
    </section>
  );
}

export default App;
