import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Connect.css'

gsap.registerPlugin(ScrollTrigger)

export default function Connect() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.connect-box',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2,
          scrollTrigger: { trigger: '.connect-section', start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="connect-section">
      <div className="container connect-box">
        <div className="connect-glow" />
        <div className="connect-content">
          <h2 className="connect-title">Ready to take your product from zero to scale?</h2>
          <p className="connect-desc">
            I am currently open to consulting contracts, advising startups, and full-time product roles.
          </p>
          <div className="connect-actions">
            <a href="mailto:contact@murthy.build" className="btn btn-primary btn-large">Build with Murthy</a>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <span className="divider">/</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
