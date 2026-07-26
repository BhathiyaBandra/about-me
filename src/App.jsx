import { useEffect, useRef, useState } from 'react'
import { profile, about, projects, experience } from './data'

/* ─── Icons (inline SVG, currentColor) ─────────────────────── */
const Icon = {
  Sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.24 8h4.5v13H.24V8zM8.5 8h4.3v1.78h.06c.6-1.06 2.06-2.18 4.24-2.18C21.4 7.4 22 9.98 22 13.3V21h-4.5v-6.8c0-1.62-.03-3.7-2.26-3.7-2.26 0-2.6 1.76-2.6 3.58V21H8.5V8z" />
    </svg>
  ),
  Bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Pipeline: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  ),
  Layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m12 2 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  ),
}

const projectIcons = [Icon.Bolt, Icon.Pipeline, Icon.Layers]

/* ─── Theme hook ───────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {}
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

/* ─── Scroll-reveal hook (respects reduced motion) ─────────── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els?.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in-view'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Toggle color theme" title="Toggle theme">
      {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
    </button>
  )
}

function Nav({ theme, onToggle }) {
  const links = ['about', 'projects', 'experience', 'contact']
  return (
    <header className="nav">
      <a href="#top" className="nav-brand">
        <span className="brand-mark">BB</span>
        Bhathiya Bandara
      </a>
      <nav className="nav-links">
        {links.map((l, i) => (
          <a key={l} href={`#${l}`} data-idx={`0${i + 1}`} className={l === 'contact' ? 'nav-cta' : ''}>
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <p className="hero-eyebrow">
        <span className="dot" /> Available for data-engineering leadership roles
      </p>
      <h1 className="hero-name">{profile.name}</h1>
      <h2 className="hero-role">{profile.role}</h2>
      <p className="hero-tagline">{profile.tagline}</p>
      <p className="hero-location">
        <Icon.Pin /> {profile.location}
      </p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#projects">
          View my work
        </a>
        <a className="btn" href={`mailto:${profile.email}`}>
          <Icon.Mail /> Get in touch
        </a>
        {profile.resumeUrl && (
          <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Résumé
          </a>
        )}
      </div>

      {profile.stats?.length > 0 && (
        <div className="stats">
          {profile.stats.map((s) => (
            <div className="stat reveal" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function SectionHead({ num, title }) {
  return (
    <div className="section-head">
      <span className="section-num">{num}</span>
      <h2 className="section-title">{title}</h2>
      <span className="section-rule" />
    </div>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <SectionHead num="01." title="About" />
      <div className="about-grid reveal">
        <div className="about-text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="about-skills">
          <h3>Tech stack</h3>
          {about.skillGroups.map((group) => (
            <div className="skill-group" key={group.label}>
              <span className="skill-group-label">{group.label}</span>
              <ul className="skill-list">
                {group.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="section" id="projects">
      <SectionHead num="02." title="Selected Work" />
      <div className="project-grid">
        {projects.map((p, i) => {
          const CardIcon = projectIcons[i % projectIcons.length]
          return (
            <article className="card reveal" key={p.title}>
              <div className="card-icon">
                <CardIcon />
              </div>
              <h3 className="card-title">{p.title}</h3>
              <p className="card-desc">{p.description}</p>
              <ul className="tag-list">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {(p.liveUrl || p.codeUrl) && (
                <div className="card-links">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer">
                      Live <Icon.Arrow />
                    </a>
                  )}
                  {p.codeUrl && (
                    <a href={p.codeUrl} target="_blank" rel="noreferrer">
                      Code <Icon.Arrow />
                    </a>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHead num="03." title="Experience" />
      <div className="timeline">
        {experience.map((job, i) => (
          <div className="timeline-item reveal" key={i}>
            <div className="timeline-period">{job.period}</div>
            <div className="timeline-body">
              <h3 className="timeline-role">
                {job.role} <span className="timeline-company">· {job.company}</span>
              </h3>
              <ul className="timeline-points">
                {job.points.map((pt, j) => (
                  <li key={j}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section contact" id="contact">
      <SectionHead num="04." title="Get in touch" />
      <p className="contact-lead reveal">
        I'm always open to interesting conversations and opportunities in data engineering. Feel free to reach out.
      </p>
      <a className="btn btn-primary reveal" href={`mailto:${profile.email}`}>
        <Icon.Mail /> {profile.email}
      </a>
      <div className="socials reveal">
        {profile.socials.map((s) => {
          const SIcon = s.label === 'LinkedIn' ? Icon.LinkedIn : Icon.Mail
          return (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              <SIcon /> {s.label}
            </a>
          )
        })}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name} · Built with React &amp; Vite
      </p>
    </footer>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const revealRef = useReveal()
  return (
    <div ref={revealRef}>
      <Nav theme={theme} onToggle={toggleTheme} />
      <main className="container">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
