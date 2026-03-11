export function AboutPage() {
  return (
    <main className="main about-page">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero__overlay" />
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">Rotary Club of San Fernando, Pampanga</p>
          <h1 className="about-hero__title">About Us</h1>
          <p className="about-hero__subtitle">
            A fellowship of leaders committed to making a lasting difference
            in the communities we serve.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────── */}
      <section className="about-section about-mv">
        <div className="about-mv__grid">
          <div className="about-mv__card">
            <span className="about-mv__label">Our Mission</span>
            <h2 className="about-mv__heading">Service Above Self</h2>
            <p className="about-mv__body">
              We provide service to others, promote integrity, and advance
              world understanding, goodwill, and peace through our fellowship
              of business, professional, and community leaders in San Fernando,
              Pampanga and beyond.
            </p>
          </div>
          <div className="about-mv__card about-mv__card--dark">
            <span className="about-mv__label about-mv__label--light">Our Vision</span>
            <h2 className="about-mv__heading about-mv__heading--light">Together, We See a World</h2>
            <p className="about-mv__body about-mv__body--light">
              A world where people unite and take action to create lasting
              change — across the globe, in our communities, and in
              ourselves. We envision Pampanga as a province where every
              family has access to clean water, quality education, and
              meaningful opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* ── Four-Way Test ─────────────────────────────────── */}
      <section className="about-section about-fwt">
        <div className="about-fwt__inner">
          <p className="about-section__eyebrow">Our Guiding Principle</p>
          <h2 className="about-section__title">The Four-Way Test</h2>
          <p className="about-fwt__intro">
            Of the things we think, say, or do, Rotarians ask themselves
            four essential questions before acting:
          </p>
          <ol className="about-fwt__list">
            {[
              { n: '01', q: 'Is it the Truth?' },
              { n: '02', q: 'Is it Fair to all concerned?' },
              { n: '03', q: 'Will it build Goodwill and Better Friendships?' },
              { n: '04', q: 'Will it be Beneficial to all concerned?' },
            ].map(({ n, q }) => (
              <li key={n} className="about-fwt__item">
                <span className="about-fwt__num">{n}</span>
                <span className="about-fwt__question">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Club History ──────────────────────────────────── */}
      <section className="about-section">
        <div className="about-content-wrap">
          <p className="about-section__eyebrow">Our Story</p>
          <h2 className="about-section__title">Club History</h2>
          <div className="about-history__grid">
            <div className="about-history__text">
              <p>
                The Rotary Club of San Fernando, Pampanga was chartered as
                part of Rotary International's global network of more than
                46,000 clubs. Since its founding, the club has grown into one
                of the most active service organizations in Central Luzon,
                bringing together professionals, entrepreneurs, and civic
                leaders united by a passion for community service.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Over the decades, the club has spearheaded countless
                initiatives — from reforestation drives and medical missions
                to scholarship programs and livelihood projects — touching
                thousands of lives across Pampanga. Our members represent a
                wide cross-section of industries, reflecting the rich and
                vibrant community we are proud to call home.
              </p>
            </div>
            <div className="about-history__facts">
              {[
                { label: 'District', value: '3780' },
                { label: 'Meets', value: 'Weekly' },
                { label: 'Focus Areas', value: '7' },
                { label: 'Members', value: '20+' },
              ].map(({ label, value }) => (
                <div key={label} className="about-fact">
                  <span className="about-fact__value">{value}</span>
                  <span className="about-fact__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Areas of Focus ────────────────────────────────── */}
      <section className="about-section about-section--gray">
        <div className="about-content-wrap">
          <p className="about-section__eyebrow">What We Work On</p>
          <h2 className="about-section__title">Areas of Focus</h2>
          <p className="about-aof__intro">
            Rotary members focus their service in seven areas that have the
            greatest potential to help people live better lives and build
            stronger communities.
          </p>
          <div className="about-aof__grid">
            {[
                { title: 'Peace & Conflict Prevention', desc: 'Building a culture of peace through dialogue, tolerance, and understanding.' },
                { title: 'Disease Prevention & Treatment', desc: 'Strengthening health systems and eradicating preventable diseases.' },
                { title: 'Water, Sanitation & Hygiene', desc: 'Providing clean water and sanitation to underserved communities.' },
                { title: 'Maternal & Child Health', desc: 'Reducing preventable deaths and improving care for mothers and infants.' },
                { title: 'Basic Education & Literacy', desc: 'Helping children and adults gain the literacy skills they need to succeed.' },
                { title: 'Community Economic Development', desc: 'Creating sustainable livelihoods and economic opportunities for all.' },
                { title: 'Environment', desc: 'Protecting the natural environment through conservation and education.' },
                ].map(({ title, desc }) => (
               <div key={title} className="about-aof__card">
               <h3 className="about-aof__title">{title}</h3>
               <p className="about-aof__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ────────────────────────────────────── */}
      <section className="about-section">
        <div className="about-content-wrap">
          <p className="about-section__eyebrow">Club Leadership</p>
          <h2 className="about-section__title">Board Officers</h2>
          <p className="about-officers__intro">
            Our club is led by dedicated Rotarians who volunteer their time
            to steer programs, manage operations, and champion our values.
          </p>
          <div className="about-officers__grid">
            {[
              { role: 'President', name: 'Club President', period: 'Rotary Year 2024–2025' },
              { role: 'President-Elect', name: 'President-Elect', period: 'Rotary Year 2024–2025' },
              { role: 'Vice President', name: 'Vice President', period: 'Rotary Year 2024–2025' },
              { role: 'Secretary', name: 'Club Secretary', period: 'Rotary Year 2024–2025' },
              { role: 'Treasurer', name: 'Club Treasurer', period: 'Rotary Year 2024–2025' },
              { role: 'Sergeant-at-Arms', name: 'Sergeant-at-Arms', period: 'Rotary Year 2024–2025' },
            ].map(({ role, name, period }) => (
              <div key={role} className="about-officer">
                <div className="about-officer__avatar">
                  {role.charAt(0)}
                </div>
                <div className="about-officer__info">
                  <span className="about-officer__role">{role}</span>
                  <span className="about-officer__name">{name}</span>
                  <span className="about-officer__period">{period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join / Contact ────────────────────────────────── */}
      <section className="about-section about-join">
        <div className="about-join__inner">
          <h2 className="about-join__title">Become a Rotarian</h2>
          <p className="about-join__body">
            Rotary membership opens doors to a global network of leaders
            and the opportunity to make a tangible difference. If you share
            our commitment to integrity, service, and fellowship, we'd love
            to hear from you.
          </p>
          <div className="about-join__actions">
            <a
              href="/register"
              className="about-join__cta"
            >
              Join Our Club
            </a>
            <div className="about-join__contact">
              <div className="about-join__contact-item">
                <span className="about-join__contact-label">Email</span>
                <a href="mailto:rotary.sfpampanga@gmail.com" className="about-join__contact-value">
                  rotary.sfpampanga@gmail.com
                </a>
              </div>
              <div className="about-join__contact-item">
                <span className="about-join__contact-label">Facebook</span>
                <a
                  href="https://www.facebook.com/p/Rotary-Club-of-San-Fernando-Pampanga-100067421630823/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-join__contact-value"
                >
                  Rotary Club of San Fernando (P)
                </a>
              </div>
              <div className="about-join__contact-item">
                <span className="about-join__contact-label">Rotary International</span>
                <a
                  href="https://www.rotary.org/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-join__contact-value"
                >
                  www.rotary.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
