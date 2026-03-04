import { useEffect, useState } from 'react';
import { AdminNavbar, AdminTab } from '../components/AdminNavbar';

const API_BASE = 'http://localhost:8000';

type Tab = AdminTab;

type Stats = {
  members: number;
  projects: number;
  events: number;
};

type Project = {
  id: number;
  title: string;
  status: string;
  total_expenses: number;
  remaining_balance: number;
};

type Event = {
  id: number;
  title: string;
  date: string;
  event_type: string;
};

function getToken() {
  return localStorage.getItem('rotary_access_token') ?? '';
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

/* ── Stat card ────────────────────────────────────────── */
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="dash-stat">
      <span className="dash-stat__value">{value}</span>
      <span className="dash-stat__label">{label}</span>
      {sub && <span className="dash-stat__sub">{sub}</span>}
    </div>
  );
}

/* ── Home tab ─────────────────────────────────────────── */
function HomeTab() {
  const [stats, setStats] = useState<Stats>({ members: 0, projects: 0, events: 0 });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [membersRes, projectsRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE}/members/`, { headers: authHeaders() }),
          fetch(`${API_BASE}/projects/`),
          fetch(`${API_BASE}/events/`, { headers: authHeaders() }),
        ]);

        const members = membersRes.ok ? await membersRes.json() : [];
        const projects: Project[] = projectsRes.ok ? await projectsRes.json() : [];
        const events: Event[] = eventsRes.ok ? await eventsRes.json() : [];

        setStats({ members: members.length, projects: projects.length, events: events.length });
        setRecentProjects(projects.slice(0, 3));
        setUpcomingEvents(events.slice(0, 3));
      } catch {
        // silently fail — show zeroes
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="dash-loading">Loading…</div>;
  }

  return (
    <div className="dash-home">
      {/* Stats row */}
      <div className="dash-stats-row">
        <StatCard label="Members" value={stats.members} sub="Active members" />
        <StatCard label="Projects" value={stats.projects} sub="All projects" />
        <StatCard label="Events" value={stats.events} sub="Scheduled events" />
      </div>

      {/* Two-column overview */}
      <div className="dash-overview">
        {/* Recent projects */}
        <div className="dash-panel">
          <h3 className="dash-panel__title">Recent Projects</h3>
          {recentProjects.length === 0 ? (
            <p className="dash-panel__empty">No projects yet.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>
                      <span className={`dash-badge dash-badge--${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>₱{p.remaining_balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upcoming events */}
        <div className="dash-panel">
          <h3 className="dash-panel__title">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p className="dash-panel__empty">No events scheduled.</p>
          ) : (
            <ul className="dash-event-list">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="dash-event-item">
                  <div className="dash-event-item__date">
                    {new Date(e.date).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="dash-event-item__info">
                    <span className="dash-event-item__title">{e.title}</span>
                    <span className="dash-event-item__type">{e.event_type}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Placeholder tab ──────────────────────────────────── */
function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="dash-placeholder">
      <span className="dash-placeholder__icon">🚧</span>
      <h2 className="dash-placeholder__title">{name}</h2>
      <p className="dash-placeholder__sub">This section is coming soon.</p>
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────────── */
export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="dash-layout">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <main className="dash-content">
        <div className="dashboard">
          {activeTab === 'home' && (
            <>
              <h1 className="dashboard__title">Dashboard</h1>
              <p className="dashboard__subtitle">Welcome back, Admin. Here's what's happening.</p>
              <HomeTab />
            </>
          )}
          {activeTab === 'members'  && <PlaceholderTab name="Members" />}
          {activeTab === 'projects' && <PlaceholderTab name="Projects" />}
          {activeTab === 'events'   && <PlaceholderTab name="Events" />}
          {activeTab === 'profile'  && <PlaceholderTab name="Profile" />}
        </div>
      </main>
    </div>
  );
}