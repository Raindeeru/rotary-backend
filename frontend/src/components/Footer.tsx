export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand-row">
          <img src="/logo_rotary.jpg" alt="Rotary Club of San Fernando" className="footer__logo-img" />
          <div className="footer__brand-text">
            <span className="footer__brand">Rotary Club of San Fernando (P)</span>
            <div className="footer__links">
              <a
                href="https://www.facebook.com/p/Rotary-Club-of-San-Fernando-Pampanga-100067421630823/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Facebook
              </a>
              <span className="footer__link-divider">·</span>
              <a
                href="https://www.rotary.org/en"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Rotary International
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}