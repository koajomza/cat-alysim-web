'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = { value: number; suffix: string; label: string };
type Feature = { title: string; description: string; icon: string; featured?: boolean };
type Faq = { question: string; answer: string };

const stats: Stat[] = [
  { value: 90, suffix: '%', label: 'Faster Reporting' },
  { value: 120, suffix: '+', label: 'Document Templates' },
  { value: 50, suffix: 'K', label: 'Cases Processed' },
];

const overviewCards = [
  {
    title: 'Centralized Case Hub',
    description: 'Manage all active and archived cases from a unified, searchable workspace with role-based access control.',
  },
  {
    title: 'Offline-Ready Windows App',
    description: 'Runs fully on your local network. No cloud dependency, no data leaving your station, and stronger operational privacy.',
  },
  {
    title: 'Audit-Ready Records',
    description: 'Every action is timestamped and logged. Produce court-ready documents and audit trails in seconds.',
  },
];

const features: Feature[] = [
  {
    title: 'Case Management',
    description: 'Track every case from first report to closure. Assign officers, set priorities, monitor status, and maintain a complete chain of evidence in one place.',
    icon: '⌘',
  },
  {
    title: 'OCR & Document Scanning',
    description: 'Scan physical documents and extract text automatically. Import IDs, reports, and evidence into case files without manual data entry.',
    icon: '◫',
    featured: true,
  },
  {
    title: 'Smart Form Builder',
    description: 'Create and fill standardized incident forms with validation rules and reusable workflow structure.',
    icon: '✦',
  },
  {
    title: 'Duty Schedule Manager',
    description: 'Build and manage rotating duty rosters with clearer scheduling, assignment tracking, and quick overview panels.',
    icon: '◷',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Visualize case trends, closure rates, and workload distribution through focused operational dashboards.',
    icon: '▣',
  },
  {
    title: 'Document Generation',
    description: 'Auto-generate reports, summons, warrants, and evidence receipts directly from case data.',
    icon: '↓',
  },
];

const faqs: Faq[] = [
  {
    question: 'Is CAT-ALYSIM a web app?',
    answer: 'No. The product presented here is a Windows desktop application. This site is a showcase and download page.',
  },
  {
    question: 'Does this page store live case records?',
    answer: 'No. It is not the operational case environment for real records. It is a presentation surface for the product.',
  },
  {
    question: 'Why is the site a single long page?',
    answer: 'Because the goal is direct: explain the system, show the interface, answer common questions, and let visitors download fast.',
  },
];

function Counter({ value, suffix, active }: Stat & { active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1400;
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.3 + 0.04),
      a: Math.random() * 0.28 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.pulse += 0.02;
        if (dot.y < -20) {
          dot.y = canvas.height + 20;
          dot.x = Math.random() * canvas.width;
        }
        if (dot.x < -20) dot.x = canvas.width + 20;
        if (dot.x > canvas.width + 20) dot.x = -20;
        const alpha = dot.a * (0.72 + 0.28 * Math.sin(dot.pulse));
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(18, 184, 255, ${alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="particles-layer" aria-hidden="true" />;
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeStats, setActiveStats] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        }
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => revealObserver.observe(node));

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActiveStats(true);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (statRef.current) statsObserver.observe(statRef.current);

    return () => {
      revealObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <main className="site-wrap">
      <Particles />
      <div className="page-noise" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-left" aria-hidden="true" />
      <div className="hero-glow hero-glow-right" aria-hidden="true" />
      <div className="hero-scanline" aria-hidden="true" />
      <div className="aurora aurora-left" aria-hidden="true" />
      <div className="aurora aurora-right" aria-hidden="true" />
      <div className="aurora aurora-center" aria-hidden="true" />
      <div className="beam beam-left" aria-hidden="true" />
      <div className="beam beam-right" aria-hidden="true" />

      <header className="topbar">
        <a href="#hero" className="brand">
          CAT-ALYSIM
        </a>
        <nav className="navlinks">
          <a href="#overview">OVERVIEW</a>
          <a href="#features">FEATURES</a>
          <a href="#screenshots">SCREENSHOTS</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="#download" className="nav-download">
          DOWNLOAD
        </a>
      </header>

      <section className="hero" id="hero">
        <div className="hero-inner" data-reveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            V2.4 — WINDOWS DESKTOP APPLICATION
          </div>

          <h1 className="hero-title">
            <span className="hero-line hero-line-main">Next-Gen</span>
            <span className="hero-line hero-line-outline">Intelligence</span>
            <span className="hero-line hero-line-mixed">
              <span className="white-text">for</span> <span className="gradient-text">Police</span>
            </span>
            <span className="hero-line hero-line-gradient">Work</span>
          </h1>

          <p className="hero-description">
            CAT-ALYSIM transforms case management and workflow documentation into one focused desktop environment for OCR, smart forms, and instant reporting.
          </p>

          <div className="hero-actions">
            <a href="#download" className="primary-btn">
              ↓ DOWNLOAD FOR WINDOWS
            </a>
            <a href="#features" className="hero-link">
              Explore Features →
            </a>
          </div>

          <div className="hero-stats" ref={statRef}>
            {stats.map((item, index) => (
              <div className="hero-stat" key={item.label}>
                <strong>
                  <Counter {...item} active={activeStats} />
                </strong>
                <span>{item.label}</span>
                {index < stats.length - 1 && <i className="hero-stat-divider" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overview-section section-shell" id="overview">
        <div className="overview-grid">
          <div className="overview-visual reveal-item" data-reveal>
            <div className="overview-window overview-window-main">
              <div className="window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="window-body">
                <aside className="window-sidebar">
                  <i className="active" />
                  <i />
                  <i />
                  <i />
                  <i />
                </aside>
                <div className="window-main">
                  <div className="window-top-row">
                    <div />
                    <div />
                    <div />
                  </div>
                  <div className="window-chart" />
                  <div className="window-table">
                    <span className="cyan" />
                    <span />
                    <span />
                    <span className="cyan short" />
                    <span />
                    <span />
                    <span />
                    <span className="cyan" />
                    <span />
                  </div>
                </div>
              </div>
            </div>
            <div className="overview-window overview-window-float">
              <div className="window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="float-card-body">
                <div className="float-line cyan" />
                <div className="float-line" />
                <div className="float-line short" />
                <div className="float-panel" />
              </div>
            </div>
          </div>

          <div className="overview-copy reveal-item" data-reveal>
            <div className="section-kicker">PLATFORM OVERVIEW</div>
            <h2 className="section-title left">Built for the <span className="gradient-text">Demands of Law</span></h2>
            <p className="section-copy left">
              CAT-ALYSIM is a comprehensive desktop platform that centralizes every aspect of police case management from intake to archiving.
            </p>
            <div className="overview-card-list">
              {overviewCards.map((card) => (
                <article className="overview-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section section-shell" id="features">
        <div className="section-head center reveal-item" data-reveal>
          <div className="section-kicker">CORE CAPABILITIES</div>
          <h2 className="section-title">Everything Your Team <span className="gradient-text">Needs.</span> Nothing It <span className="gradient-text">Doesn&apos;t.</span></h2>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article
              className={`feature-card${feature.featured ? ' featured' : ''}`}
              key={feature.title}
              data-reveal
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="screens-section section-shell" id="screenshots">
        <div className="section-head center reveal-item" data-reveal>
          <div className="section-kicker">SCREENSHOTS</div>
          <h2 className="section-title">See It In <span className="gradient-text">Action</span></h2>
          <p className="section-copy center">Click any screenshot to view in full screen.</p>
        </div>
        <div className="shots-grid reveal-item" data-reveal>
          <div className="shot shot-wide">
            <div className="shot-bar" />
            <div className="shot-chart" />
            <div className="shot-caption">Analytics Dashboard — Case Overview</div>
          </div>
          <div className="shot">
            <div className="shot-bar" />
            <div className="shot-lines compact" />
            <div className="shot-caption">Case List</div>
          </div>
          <div className="shot">
            <div className="shot-bar" />
            <div className="shot-form" />
            <div className="shot-caption">Incident Form</div>
          </div>
          <div className="shot shot-wide-bottom">
            <div className="shot-bar" />
            <div className="shot-calendar" />
            <div className="shot-caption">Duty Schedule</div>
          </div>
        </div>
      </section>

      <section className="download-section section-shell" id="download">
        <div className="download-card reveal-item" data-reveal>
          <div className="download-icon">↓</div>
          <h2 className="section-title">Download <span className="gradient-text">CAT-ALYSIM</span></h2>
          <p className="section-copy center slim">
            Free to deploy on your station&apos;s local network. No internet required. No license fees. Just install and go.
          </p>
          <a className="primary-btn large" href="/downloads/CAT-ALYSIM-Setup.exe" download>
            DOWNLOAD FOR WINDOWS
          </a>
          <div className="download-meta">
            <span>Secure local installation</span>
            <span>Windows 10/11</span>
            <span>Free support included</span>
          </div>
        </div>
      </section>

      <section className="faq-section section-shell" id="faq">
        <div className="section-head reveal-item" data-reveal>
          <div className="section-kicker">FAQ</div>
          <h2 className="section-title left">Direct answers before the <span className="gradient-text">download</span></h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <article
                className={`faq-item${isOpen ? ' open' : ''}`}
                key={item.question}
                data-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)}>
                  <span>{item.question}</span>
                  <span className="faq-plus">+</span>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
