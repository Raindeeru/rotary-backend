import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand-link">
          <img src="/logo_rotary.jpg" alt="Rotary Club of San Fernando" className="navbar__logo-img" />
          <span className="navbar__title">Rotary Club of San Fernando (P)</span>
        </Link>
        <Link to="/login" className="navbar__login">Login</Link>
      </div>
    </header>
  );
}