import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <main className="auth">
      <div className="auth__panel" style={{ textAlign: 'center' }}>
        <img
          src="/logo_rotary.jpg"
          alt="Rotary Club of San Fernando"
          style={{ width: 72, height: 72, objectFit: 'contain', margin: '0 auto 1.2rem' }}
        />
        <header className="auth__header" style={{ marginBottom: '1rem' }}>
          <h1 className="auth__title">Want to join?</h1>
          <p className="auth__subtitle" style={{ marginTop: '0.4rem' }}>
            Membership to the Rotary Club of San Fernando (P) is by invitation only.
            Accounts are created by club administrators.
          </p>
        </header>

        <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          If you've been invited, your administrator will provide you with a temporary password.
          You can then log in and update your profile.
        </p>

        <Link to="/login" className="auth__submit" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
          Go to Login
        </Link>

        <p className="auth__hint" style={{ marginTop: '1.2rem' }}>
          Already have an account? <Link to="/login">Sign in here</Link>.
        </p>
      </div>
    </main>
  );
}