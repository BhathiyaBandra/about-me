import { Suspense, lazy, Component, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { profile, about, projects, experience } from './data'

const Hero3D = lazy(() => import('./Hero3D'))

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
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
}
const projectIcons = [Icon.Bolt, Icon.Pipeline, Icon.Layers]

/* ─── Error boundary so a WebGL failure never breaks the page ── */
class SafeBoundary extends Component {
  constructor(p) {
    super(p)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

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

/* ─── Motion variants ──────────────────────────────────────── */
const easeOut = [0.22, 1, 0.36, 1]
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

/* Reveal wrapper — animates when scrolled into view (once). */
function Reveal({ children, className, delay = 0, as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut, delay } },
      }}
    >
      {children}
    </M>
  )
}

/* ─── Animated stat with count-up ──────────────────────────── */
function AnimatedStat({ value, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value)

  // Parse "6+", "7.5×", "2021" → number + prefix/suffix
  const match = String(value).match(/^([^\d]*)([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[2]) : null
  const pre = match ? match[1] : ''
  const suf = match ? match[3] : ''
  const decimals = match && match[2].includes('.') ? 1 : 0

  useEffect(() => {
    if (target == null) return
    if (reduce || !inView) {
      if (inView) setDisplay(value)
      return
    }
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const n = target * eased
      setDisplay(pre + n.toFixed(decimals) + suf)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, target, value, pre, suf, decimals])

  return (
    <motion.div
      ref={ref}
      className="stat"
      variants={rise}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="stat-value">{display}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}

/* ─── Scroll Hooks ─────────────────────────────────────────── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

function useScrollSpy(sectionIds) {
  const [activeSection, setActiveSection] = useState('top')
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds])
  return activeSection
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <motion.button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle color theme"
      title="Toggle theme"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
    </motion.button>
  )
}

function Nav({ theme, onToggle, activeSection, onOpenContact }) {
  const links = ['about', 'projects', 'experience', 'contact']
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <a href="#top" className="nav-brand">
          <span className="brand-mark">BB</span>
          Bhathiya Bandara
        </a>
        <nav className="nav-links">
          {links.map((l, i) => (
            <a
              key={l}
              href={`#${l}`}
              data-idx={`0${i + 1}`}
              className={`${l === activeSection ? 'active' : ''} ${l === 'contact' ? 'nav-cta' : ''}`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open mobile menu"
          >
            <Icon.Menu />
          </button>
        </nav>
      </motion.header>

      {mobileOpen && (
        <motion.div
          className="mobile-drawer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <button className="mobile-drawer-close" onClick={() => setMobileOpen(false)}>×</button>
          {links.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              className={l === activeSection ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
          <button
            className="btn btn-primary"
            onClick={() => {
              setMobileOpen(false)
              onOpenContact()
            }}
          >
            Send Message
          </button>
        </motion.div>
      )}
    </>
  )
}

function Hero({ show3d, accent, theme, onOpenContact }) {
  return (
    <section className="hero" id="top">
      {show3d && (
        <div className="hero-bg" aria-hidden="true">
          <SafeBoundary>
            <Suspense fallback={null}>
              <Hero3D accent={accent} theme={theme} />
            </Suspense>
          </SafeBoundary>
        </div>
      )}
      <motion.div className="hero-inner" variants={container} initial="hidden" animate="show">
        <motion.p className="hero-eyebrow" variants={rise}>
          <span className="dot" /> Available for data-engineering leadership roles
        </motion.p>
        <motion.h1 className="hero-name" variants={rise}>
          {profile.name}
        </motion.h1>
        <motion.h2 className="hero-role" variants={rise}>
          {profile.role}
        </motion.h2>
        <motion.p className="hero-tagline" variants={rise}>
          {profile.tagline}
        </motion.p>
        <motion.p className="hero-location" variants={rise}>
          <Icon.Pin /> {profile.location}
        </motion.p>
        <motion.div className="hero-actions" variants={rise}>
          <motion.a className="btn btn-primary" href="#projects" whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            View my work
          </motion.a>
          <motion.button className="btn" onClick={onOpenContact} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            <Icon.Mail /> Get in touch
          </motion.button>
          {profile.resumeUrl && (
            <motion.a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
              Résumé
            </motion.a>
          )}
        </motion.div>
      </motion.div>

      {profile.stats?.length > 0 && (
        <motion.div
          className="stats"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {profile.stats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} />
          ))}
        </motion.div>
      )}
    </section>
  )
}

function SectionHead({ num, title }) {
  return (
    <Reveal className="section-head">
      <span className="section-num">{num}</span>
      <h2 className="section-title">{title}</h2>
      <span className="section-rule" />
    </Reveal>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <SectionHead num="01." title="About" />
      <div className="about-grid">
        <Reveal className="about-text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
        <Reveal className="about-skills" delay={0.1}>
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
        </Reveal>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="section" id="projects">
      <SectionHead num="02." title="Selected Work" />
      <motion.div
        className="project-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {projects.map((p, i) => {
          const CardIcon = projectIcons[i % projectIcons.length]
          return (
            <motion.article
              className="card"
              key={p.title}
              variants={rise}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
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
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHead num="03." title="Experience" />
      <div className="timeline">
        {experience.map((job, i) => (
          <Reveal className="timeline-item" key={i} delay={i * 0.05}>
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
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ContactModal({ isOpen, onClose }) {
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setFormData({ name: '', email: '', message: '' })
      onClose()
    }, 2200)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="contact-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        <h3>Send a Message</h3>
        <p>Direct inquiry for {profile.name}</p>
        {sent ? (
          <div className="form-success">
            ✓ Thank you! Your message has been sent successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="modal-name">Your Name</label>
              <input
                id="modal-name"
                type="text"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal-email">Your Email</label>
              <input
                id="modal-email"
                type="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal-message">Message</label>
              <textarea
                id="modal-message"
                rows="4"
                required
                placeholder="Hi Bhathiya, I'd like to discuss a data engineering opportunity..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
              Send Message
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

function Contact({ onOpenContact }) {
  return (
    <section className="section contact" id="contact">
      <SectionHead num="04." title="Get in touch" />
      <Reveal className="contact-lead" as="p">
        I'm always open to interesting conversations and opportunities in data engineering. Feel free to reach out.
      </Reveal>
      <Reveal delay={0.08}>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button className="btn btn-primary" onClick={onOpenContact} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            <Icon.Mail /> Send Message
          </motion.button>
          <motion.a className="btn" href={`mailto:${profile.email}`} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
            Email Directly
          </motion.a>
        </div>
      </Reveal>
      <Reveal className="socials" delay={0.16}>
        {profile.socials.map((s) => {
          const SIcon = s.label === 'LinkedIn' ? Icon.LinkedIn : Icon.Mail
          return (
            <motion.a key={s.label} href={s.url} target="_blank" rel="noreferrer" whileHover={{ y: -3 }}>
              <SIcon /> {s.label}
            </motion.a>
          )
        })}
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name} · Built with React, Three.js &amp; Framer Motion
      </p>
    </footer>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const reduce = useReducedMotion()
  const scrollProgress = useScrollProgress()
  const activeSection = useScrollSpy(['top', 'about', 'projects', 'experience', 'contact'])
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // 3D canvas visibility based on motion preference & screen width
  const [show3d, setShow3d] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setShow3d(!reduce && window.innerWidth > 720)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [reduce])

  const accent = theme === 'dark' ? '#22c55e' : '#16a34a'

  return (
    <>
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <Nav
        theme={theme}
        onToggle={toggleTheme}
        activeSection={activeSection}
        onOpenContact={() => setIsContactModalOpen(true)}
      />
      <main className="container">
        <Hero show3d={show3d} accent={accent} theme={theme} onOpenContact={() => setIsContactModalOpen(true)} />
        <About />
        <Projects />
        <Experience />
        <Contact onOpenContact={() => setIsContactModalOpen(true)} />
      </main>
      <Footer />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  )
}
