import { useNavigate } from 'react-router-dom';

export type AdminTab = 'home' | 'members' | 'projects' | 'events' | 'about' | 'profile';

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'home',     label: 'Home' },
  { id: 'members',  label: 'Members' },
  { id: 'projects', label: 'Projects' },
  { id: 'events',   label: 'Events' },
  { id: 'about',    label: 'About' },
  { id: 'profile',  label: 'Profile' },
];

type AdminNavbarProps = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
};

export function AdminNavbar({ activeTab, onTabChange }: AdminNavbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('rotary_access_token');
    navigate('/login', { replace: true });
  }

  return (
    <header className="dash-navbar">
      <div className="dash-navbar__inner">
        <div className="dash-navbar__brand">
          <img src="/logo_rotary.jpg" alt="Rotary Club of San Fernando" className="navbar__logo-img" />
          <span className="dash-navbar__title">Rotary Club of San Fernando (P)</span>
        </div>

        <nav className="dash-navbar__nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`dash-navbar__link${activeTab === tab.id ? ' dash-navbar__link--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button type="button" className="dash-navbar__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}