import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Hero.css'

const STATS = [
  { num: '8+', label: 'Years of Craft' },
  { num: '5',  label: 'Industries Mastered' },
  { num: '15+', label: 'Launched Products' },
  { num: '165+', label: 'Shipped Screens' },
  { num: '500+', label: 'User Insights' },
]

export default function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.fromTo('.navbar',       { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
      .fromTo('.intro-badge',  { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, '-=0.8')
      .fromTo('.hero-title',   { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4 }, '-=0.8')
      .fromTo('.hero-subtitle',{ y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.0')
      .fromTo('.hero-desc',    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.0')
      .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.0')
      .fromTo('.stat-card',    { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, '-=1.4')
      .fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5')
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="intro-badge">PRODUCT BUILDER &amp; ENGINEER</span>
          <h1 className="hero-title gradient-text">Hi, I'm Murthy.</h1>
          <h2 className="hero-subtitle">I build products from zero to scale.</h2>
          <p className="hero-desc">
            An engineer and designer at heart. I bridge the gap between user needs,
            pixel-perfect design, and robust code to launch digital products that users
            love and businesses grow on.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-secondary">See My Work</a>
          </div>
        </div>

        <div className="hero-stats-panel" id="stats">
          <div className="stats-panel-glow" />
          <div className="stats-grid">
            {STATS.map(({ num, label }) => (
              <div className="stat-card" key={label}>
                <span className="stat-number gradient-text">{num}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse-icon"><div className="wheel" /></div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  )
}
