import { useEffect, useState } from 'react'
import { profile, about, projects, experience } from './data'

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

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle color theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

function Nav({ theme, onToggle }) {
  const links = ['about', 'projects', 'experience', 'contact']
  return (
    <header className="nav">
      <a href="#top" className="nav-brand">
        {profile.name}
      </a>
      <nav className="nav-links">
        {links.map((l) => (
          <a key={l} href={`#${l}`}>
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
      <p className="hero-eyebrow">Hi, my name is</p>
      <h1 className="hero-name">{profile.name}</h1>
      <h2 className="hero-role">{profile.role}</h2>
      <p className="hero-tagline">{profile.tagline}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#projects">
          View my work
        </a>
        <a className="btn" href={`mailto:${profile.email}`}>
          Get in touch
        </a>
        {profile.resumeUrl && (
          <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Résumé
          </a>
        )}
      </div>
    </section>
  )
}

function Section({ id, title, children }) {
  return (
    <section className="section" id={id}>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="about-grid">
        <div className="about-text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="about-skills">
          <h3>Skills</h3>
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
    </Section>
  )
}

function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="project-grid">
        {projects.map((p) => (
          <article className="card" key={p.title}>
            <h3 className="card-title">{p.title}</h3>
            <p className="card-desc">{p.description}</p>
            <ul className="tag-list">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="card-links">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer">
                  Live ↗
                </a>
              )}
              {p.codeUrl && (
                <a href={p.codeUrl} target="_blank" rel="noreferrer">
                  Code ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="timeline">
        {experience.map((job, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-meta">
              <span className="timeline-period">{job.period}</span>
            </div>
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
    </Section>
  )
}

function Contact() {
  return (
    <Section id="contact" title="Get in touch">
      <p className="contact-lead">
        I'm always open to interesting conversations and opportunities. Feel free to reach out.
      </p>
      <a className="btn btn-primary" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="socials">
        {profile.socials.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with React &amp; Vite.
      </p>
    </footer>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  return (
    <>
      <Nav theme={theme} onToggle={toggleTheme} />
      <main className="container">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
