import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const STAGES = [
  {
    num: '01',
    role: 'Engineer',
    years: '2018 – 2020',
    headline: 'Started by building the thing.',
    body: 'Before product, before research, before strategy — there was code. I built Examly\'s first assessment engine from scratch. Node.js, React, PostgreSQL, late nights, and a lot of console.log statements. Writing software taught me the most important lesson I never learned in a classroom: products break in ways documentation never warned you about.',
    shift: 'Then I noticed something. Users were confused by things I thought were obvious. The product worked. But it wasn\'t working for people.',
    arrow: 'That confusion became a question.',
    accent: '#dfb743',
  },
  {
    num: '02',
    role: 'Designer',
    years: '2019 – 2021',
    headline: 'Became the designer because there wasn\'t one.',
    body: 'There was no designer on the team. So I became one. Started with Figma, moved to full interface design for Examly and XOLOX. Designed onboarding flows, dashboards, mobile-first forms — not because design was my job, but because the product needed it and I was there.',
    shift: 'Design taught me that every interface is a series of decisions about what the user should see next. And most products get those decisions wrong.',
    arrow: 'I started asking why — not just what.',
    accent: '#818cf8',
  },
  {
    num: '03',
    role: 'Researcher',
    years: '2020 – 2022',
    headline: 'Discovered that software is really about people.',
    body: '50+ user interviews. 500+ survey responses. Field visits across 4 states. Sitting in kitchens in rural Andhra Pradesh watching farmers try to use a financial app I helped build. Research changed everything. It changed which features got built, which got killed, and which got renamed.',
    shift: 'Most teams skip research because it slows them down. It actually slows down the wrong work.',
    arrow: 'I started seeing systems, not screens.',
    accent: '#34d399',
  },
  {
    num: '04',
    role: 'Product Manager',
    years: '2021 – 2023',
    headline: 'Learned to connect the dots others couldn\'t see.',
    body: 'PM\'ing Examly LMS, MarketU, and Agri Khatha simultaneously. Writing PRDs that engineering actually shipped from. Running prioritization sessions that didn\'t turn into feature arguments. Shipping things that changed real numbers. The job wasn\'t to have answers — it was to ask the right question at the right moment.',
    shift: 'I stopped thinking about user outcomes in isolation. I started thinking about business outcomes — and how they reinforce each other.',
    arrow: 'Growth became the next frontier.',
    accent: '#fb923c',
  },
  {
    num: '05',
    role: 'Growth Leader',
    years: '2022 – 2024',
    headline: 'Building the product is half the job.',
    body: 'Led growth at NorthStar Academy. Built acquisition and retention systems. Ran experiments. Mapped the loop. Grew revenue, grew users, grew the team that grew both. The biggest insight: growth is a product problem disguised as a marketing problem. Every durable growth lever is a product improvement.',
    shift: 'I kept running into the limits of what a team of humans could build fast enough. AI changed the ceiling.',
    arrow: 'The next chapter was obvious.',
    accent: '#e879f9',
  },
  {
    num: '06',
    role: 'AI Product Builder',
    years: '2024 – Now',
    headline: 'The tools changed. The thinking got harder.',
    body: 'Built MarketU with Claude and OpenAI embedded into core workflows — not as a chatbot, as a collaborator. Built MyGold with blockchain verification under the hood. The more capable the AI, the more important the product judgment. AI doesn\'t replace thinking. It demands more of it.',
    shift: null,
    arrow: null,
    accent: '#38bdf8',
  },
]

export default function About() {
  const navigate = useNavigate()
  const pageRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo('.ab-hero-eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 })
      gsap.fromTo('.ab-hero-title', { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 })
      gsap.fromTo('.ab-hero-sub', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5 })

      // Spine scaleY scrub — grows as user scrolls the timeline
      gsap.fromTo('.ab-spine-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ab-timeline',
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 0.6,
          },
        }
      )

      // Stage cards
      gsap.utils.toArray('.ab-stage').forEach((el) => {
        gsap.fromTo(el.querySelector('.ab-stage-content'),
          { x: 32, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' }
          }
        )
        gsap.fromTo(el.querySelector('.ab-dot'),
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
            scrollTrigger: { trigger: el, start: 'top 80%' }
          }
        )
        gsap.fromTo(el.querySelector('.ab-role'),
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power4.out', delay: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%' }
          }
        )
      })

      gsap.fromTo('.ab-closing-inner',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.ab-closing', start: 'top 80%' }
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.div
      ref={pageRef}
      className="ab-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* ── Nav ── */}
      <nav className="ab-nav">
        <motion.button
          className="ab-nav-back"
          onClick={() => navigate('/')}
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </motion.button>
        <span className="ab-nav-title">About Me</span>
        <div />
      </nav>

      {/* ═══════════════
          HERO
      ═══════════════ */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-container">
          <span className="ab-hero-eyebrow">ABOUT ME</span>
          <h1 className="ab-hero-title">
            Six roles.<br />
            One direction.<br />
            <span className="gradient-text">Build things that matter.</span>
          </h1>
          <p className="ab-hero-sub">
            Not a biography. Not a LinkedIn summary. This is how I actually got here — the roles, the transitions, and what each one broke open.
          </p>
        </div>
      </section>

      {/* ═══════════════
          TIMELINE
      ═══════════════ */}
      <section className="ab-timeline-section">
        <div className="ab-container">
          <div className="ab-timeline">
            <div className="ab-spine">
              <div className="ab-spine-track" />
              <div className="ab-spine-fill" />
            </div>

            {STAGES.map((stage, idx) => {
              const isLast = idx === STAGES.length - 1
              return (
                <div key={stage.num} className="ab-stage">
                  <div
                    className={`ab-dot ${isLast ? 'ab-dot--last' : ''}`}
                    style={{ '--stage-accent': stage.accent }}
                  />
                  <div className="ab-stage-content">
                    <div className="ab-stage-header">
                      <span className="ab-stage-num">{stage.num}</span>
                      <div className="ab-stage-meta">
                        <h2 className="ab-role" style={{ '--stage-accent': stage.accent }}>
                          {stage.role}
                        </h2>
                        <span className="ab-years">{stage.years}</span>
                      </div>
                    </div>

                    <h3 className="ab-headline">{stage.headline}</h3>
                    <p className="ab-body">{stage.body}</p>

                    {stage.shift && (
                      <div className="ab-shift" style={{ '--stage-accent': stage.accent }}>
                        <span className="ab-shift-bar" />
                        <p className="ab-shift-text">{stage.shift}</p>
                      </div>
                    )}

                    {stage.arrow && (
                      <div className="ab-transition">
                        <div className="ab-transition-line" />
                        <span className="ab-transition-label">{stage.arrow}</span>
                        <div className="ab-transition-arrow">↓</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════
          CLOSING
      ═══════════════ */}
      <section className="ab-closing">
        <div className="ab-container">
          <div className="ab-closing-inner">
            <div className="ab-closing-line" />
            <h2 className="ab-closing-title">
              Still building.<br />
              <span className="gradient-text">Still learning what breaks.</span>
            </h2>
            <p className="ab-closing-sub">
              Every role expanded what I thought a product person could do. I haven't found the ceiling yet.
            </p>
            <div className="ab-closing-actions">
              <a href="mailto:contact@murthy.build" className="btn btn-primary btn-large">
                Work Together →
              </a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
