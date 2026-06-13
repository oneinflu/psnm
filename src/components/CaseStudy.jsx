import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

// ── Split text into word spans for scrub animation ──
function ScrubWords({ text, className }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="scrub-word">{word}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </span>
  )
}

// ── Shared chapter eyebrow ──
function Eyebrow({ num, label }) {
  return (
    <div className="chapter-eyebrow">
      <span className="eyebrow-num">{num}</span>
      <span className="eyebrow-slash">/</span>
      <span className="eyebrow-label">{label}</span>
    </div>
  )
}

export default function CaseStudy({ product, allProducts, onClose, onNavigate }) {
  const overlayRef = useRef(null)
  const scrollRef  = useRef(null)
  const ctxRef     = useRef(null)
  const { caseStudy: cs } = product

  const currentIndex = allProducts.findIndex(p => p.id === product.id)
  const prev = allProducts[currentIndex - 1]
  const next = allProducts[currentIndex + 1]

  // ── Clean up and re-run animations when product changes ──
  const setupAnimations = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    scrollEl.scrollTop = 0

    // Kill previous context
    if (ctxRef.current) ctxRef.current.revert()

    // Register custom scroller so ScrollTrigger tracks the overlay div
    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        if (arguments.length) scrollEl.scrollTop = value
        return scrollEl.scrollTop
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })

    const onScroll = () => ScrollTrigger.update()
    scrollEl.addEventListener('scroll', onScroll, { passive: true })

    ctxRef.current = gsap.context(() => {
      const S = (trigger, extra = {}) => ({
        scroller: scrollEl,
        trigger,
        start: 'top 72%',
        ...extra,
      })

      // ── Cover entrance ──
      const coverTl = gsap.timeline({ delay: 0.15 })
      coverTl
        .fromTo('.cs-cover-meta',    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo('.cs-cover-name',    { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'power4.out' }, '-=0.3')
        .fromTo('.cs-cover-tagline', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .fromTo('.cs-cover-attrs',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .fromTo('.cs-scroll-hint',   { opacity: 0 },        { opacity: 1, duration: 0.6 }, '-=0.2')

      // ── Generic section reveal (eyebrow + headline + body) ──
      overlayRef.current.querySelectorAll('.cs-section').forEach(section => {
        const eyebrow  = section.querySelector('.chapter-eyebrow')
        const headline = section.querySelector('.cs-headline')
        const body     = section.querySelector('.cs-body')

        if (eyebrow)  gsap.fromTo(eyebrow,  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', scrollTrigger: S(section) })
        if (headline) gsap.fromTo(headline, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out', scrollTrigger: S(section, { start: 'top 68%' }) })
        if (body)     gsap.fromTo(body,     { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: S(section, { start: 'top 62%' }) })
      })

      // ── 02 Market: stats count up ──
      scrollEl.querySelectorAll('.market-stat-value').forEach(el => {
        const raw     = el.textContent.trim()
        const num     = parseFloat(raw.replace(/[^0-9.]/g, ''))
        const prefix  = raw.match(/^[^\d]*/)?.[0] ?? ''
        const suffix  = raw.match(/[^\d.]+$/)?.[0] ?? ''
        if (isNaN(num)) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: num, duration: 1.8, ease: 'power2.out',
          scrollTrigger: S('.cs-section--market', { start: 'top 65%', toggleActions: 'play none none none' }),
          onUpdate: () => { el.textContent = prefix + (Number.isInteger(num) ? Math.floor(obj.v) : obj.v.toFixed(1)) + suffix },
        })
      })

      gsap.fromTo('.market-stat',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: S('.cs-section--market', { start: 'top 65%' }) }
      )

      // ── 03 Research: method pills stagger ──
      gsap.fromTo('.method-pill',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.4)',
          scrollTrigger: S('.cs-section--research') }
      )

      // ── 04 Insights: cards slide in from right ──
      gsap.fromTo('.insight-card',
        { x: 72, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.14, duration: 0.75, ease: 'power3.out',
          scrollTrigger: S('.cs-section--insights', { start: 'top 68%' }) }
      )

      // ── 05 Hypothesis: scrub word-by-word ──
      const hypoWords = scrollEl.querySelectorAll('.scrub-word')
      if (hypoWords.length) {
        gsap.fromTo(hypoWords,
          { opacity: 0.15, y: 10, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            stagger: 0.035, ease: 'none',
            scrollTrigger: {
              trigger: '.cs-section--hypothesis',
              scroller: scrollEl,
              start: 'top 65%',
              end: 'bottom 55%',
              scrub: 1.2,
            },
          }
        )
      }

      // ── 06 Journey: steps and connectors ──
      gsap.fromTo('.journey-step',
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.13, duration: 0.7, ease: 'power3.out',
          scrollTrigger: S('.cs-section--journey', { start: 'top 65%' }) }
      )
      gsap.fromTo('.journey-line',
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, stagger: 0.13, duration: 0.4, ease: 'none',
          scrollTrigger: S('.cs-section--journey', { start: 'top 62%' }) }
      )

      // ── 07 Solution: decisions stagger left ──
      gsap.fromTo('.decision-item',
        { x: -32, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out',
          scrollTrigger: S('.cs-section--solution', { start: 'top 65%' }) }
      )

      // ── 08 Impact: count-up + block reveal ──
      scrollEl.querySelectorAll('.impact-num').forEach(el => {
        const raw    = el.dataset.raw ?? el.textContent.trim()
        const num    = parseFloat(raw.replace(/[^0-9.]/g, ''))
        const prefix = raw.match(/^[^\d]*/)?.[0] ?? ''
        const suffix = raw.match(/[^\d.]+$/)?.[0] ?? ''
        if (isNaN(num)) return
        const obj = { v: 0 }
        gsap.to(obj, {
          v: num, duration: 2.2, ease: 'power2.out',
          scrollTrigger: S('.cs-section--impact', { start: 'top 68%', toggleActions: 'play none none none' }),
          onUpdate: () => { el.textContent = prefix + (Number.isInteger(num) ? Math.floor(obj.v) : obj.v.toFixed(1)) + suffix },
        })
      })

      gsap.fromTo('.impact-block',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.85, ease: 'power3.out',
          scrollTrigger: S('.cs-section--impact', { start: 'top 70%' }) }
      )

      // Glow pulse on impact numbers
      gsap.fromTo('.impact-num',
        { textShadow: '0 0 0px rgba(223,183,67,0)' },
        {
          textShadow: '0 0 40px rgba(223,183,67,0.35)',
          duration: 1.5, ease: 'power2.out',
          scrollTrigger: S('.cs-section--impact', { start: 'top 68%', toggleActions: 'play none none none' }),
        }
      )

      // ── 09 Lessons ──
      gsap.fromTo('.lesson-item',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.18, duration: 0.7, ease: 'power3.out',
          scrollTrigger: S('.cs-section--lessons', { start: 'top 68%' }) }
      )

      // ── Scroll progress bar ──
      gsap.to('.cs-progress-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          scroller: scrollEl,
          trigger: scrollEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0,
        },
      })

    }, overlayRef)

    ScrollTrigger.refresh()

    return () => {
      scrollEl.removeEventListener('scroll', onScroll)
    }
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const cleanup = setupAnimations()
    return () => {
      cleanup?.()
      if (ctxRef.current) ctxRef.current.revert()
      document.body.style.overflow = ''
    }
  }, [setupAnimations])

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0, y: 48, duration: 0.35, ease: 'power3.in', onComplete: onClose,
    })
  }

  const handleNavigate = (id) => {
    gsap.to(scrollRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
      onNavigate(id)
    }})
  }

  return (
    <motion.div
      ref={overlayRef}
      className="cs-overlay"
      initial={{ opacity: 0, y: 64 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Scroll progress bar ── */}
      <div className="cs-progress-track">
        <div className="cs-progress-bar" />
      </div>

      {/* ── Floating nav ── */}
      <nav className="cs-nav">
        <motion.button
          className="cs-nav-back"
          onClick={handleClose}
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Work
        </motion.button>

        <span className="cs-nav-title">{product.name}</span>

        <div className="cs-nav-tags">
          {product.tags.slice(0, 2).map(t => (
            <span key={t} className="cs-nav-tag">{t}</span>
          ))}
        </div>
      </nav>

      {/* ── Scrollable content ── */}
      <div className="cs-scroll" ref={scrollRef}>

        {/* ════════════════════════════════════════
            COVER
        ════════════════════════════════════════ */}
        <section className="cs-cover">
          <div className="cs-cover-bg" />
          <div className="cs-cover-inner">
            <div className="cs-cover-meta">
              <span>NorthStar Academy</span>
              <span className="cs-cover-dot" />
              <span>Case Study</span>
            </div>
            <h1 className="cs-cover-name gradient-text">{product.name}</h1>
            <p className="cs-cover-tagline">{product.tagline}</p>
            <div className="cs-cover-attrs">
              {[
                ['Role', product.meta.role],
                ['Timeline', product.meta.timeline],
                ['Platform', product.meta.platform],
              ].map(([label, val]) => (
                <div key={label} className="cs-cover-attr">
                  <span className="attr-label">{label}</span>
                  <span className="attr-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cs-scroll-hint">
            <div className="scroll-hint-wheel" />
            <span>Scroll to explore</span>
          </div>
        </section>

        {/* ════════════════════════════════════════
            01  PROBLEM
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--problem">
          <div className="cs-section-inner">
            <Eyebrow num="01" label="Problem" />
            <blockquote className="cs-headline cs-headline--xl">{cs.problem.headline}</blockquote>
            <p className="cs-body">{cs.problem.body}</p>
          </div>
          <div className="section-glow section-glow--red" />
        </section>

        {/* ════════════════════════════════════════
            02  MARKET CONTEXT
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--market">
          <div className="cs-section-inner">
            <Eyebrow num="02" label="Market Context" />
            <p className="cs-headline cs-headline--lg">{cs.marketContext.body}</p>
            <div className="market-stats-row">
              {cs.marketContext.stats.map((s, i) => (
                <div key={i} className="market-stat">
                  <span className="market-stat-value gradient-text">{s.value}</span>
                  <span className="market-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            03  RESEARCH
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--research">
          <div className="cs-section-inner">
            <Eyebrow num="03" label="Research" />
            <div className="methods-row">
              {cs.research.methods.map(m => (
                <span key={m} className="method-pill">{m}</span>
              ))}
            </div>
            <p className="cs-body">{cs.research.body}</p>
          </div>
        </section>

        {/* ════════════════════════════════════════
            04  INSIGHTS
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--insights">
          <div className="cs-section-inner">
            <Eyebrow num="04" label="Insights" />
            <div className="insights-grid">
              {cs.insights.map(ins => (
                <div key={ins.num} className="insight-card">
                  <span className="insight-num">{ins.num}</span>
                  <h3 className="insight-headline">{ins.headline}</h3>
                  <p className="insight-body">{ins.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="section-glow section-glow--gold" />
        </section>

        {/* ════════════════════════════════════════
            05  HYPOTHESIS
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--hypothesis">
          <div className="cs-section-inner">
            <Eyebrow num="05" label="Hypothesis" />
            <div className="hypothesis-frame">
              <span className="hypothesis-the-bet">The Bet</span>
              <p className="hypothesis-statement">
                <ScrubWords text={cs.hypothesis.statement} className="scrub-target" />
              </p>
            </div>
            <p className="cs-body">{cs.hypothesis.body}</p>
          </div>
          <div className="section-glow section-glow--amber" />
        </section>

        {/* ════════════════════════════════════════
            06  USER JOURNEY
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--journey">
          <div className="cs-section-inner">
            <Eyebrow num="06" label="User Journey" />
            <div className="journey-flow">
              {cs.userJourney.map((step, i) => (
                <div key={step.phase} className="journey-step">
                  <div className="journey-step-left">
                    <div className="journey-dot" />
                    {i < cs.userJourney.length - 1 && <div className="journey-line" />}
                  </div>
                  <div className="journey-step-right">
                    <div className="journey-step-header">
                      <span className="journey-step-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="journey-phase">{step.phase}</span>
                    </div>
                    <p className="journey-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            07  SOLUTION
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--solution">
          <div className="cs-section-inner">
            <Eyebrow num="07" label="Solution" />
            <blockquote className="cs-headline cs-headline--xl">{cs.solution.headline}</blockquote>
            <p className="cs-body">{cs.solution.body}</p>
            <div className="decisions-list">
              {cs.solution.decisions.map((d, i) => (
                <div key={i} className="decision-item">
                  <div className="decision-dot" />
                  <p className="decision-text">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="section-glow section-glow--teal" />
        </section>

        {/* ════════════════════════════════════════
            08  IMPACT
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--impact">
          <div className="cs-section-inner">
            <Eyebrow num="08" label="Impact" />
            <div className="impact-grid">
              {cs.impact.map((item, i) => (
                <div key={i} className="impact-block">
                  <span
                    className="impact-num gradient-text"
                    data-raw={item.metric}
                  >
                    {item.metric}
                  </span>
                  <span className="impact-label">{item.label}</span>
                  <p className="impact-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="section-glow section-glow--gold-strong" />
        </section>

        {/* ════════════════════════════════════════
            09  LESSONS LEARNED
        ════════════════════════════════════════ */}
        <section className="cs-section cs-section--lessons">
          <div className="cs-section-inner">
            <Eyebrow num="09" label="Lessons Learned" />
            <div className="lessons-list">
              {cs.lessons.map(lesson => (
                <div key={lesson.num} className="lesson-item">
                  <span className="lesson-num">{lesson.num}</span>
                  <div>
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <p className="cs-body">{lesson.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            Footer nav
        ════════════════════════════════════════ */}
        <div className="cs-footer-nav">
          {prev ? (
            <motion.button
              className="cs-nav-btn cs-nav-btn--prev"
              onClick={() => handleNavigate(prev.id)}
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>
                <span className="cs-nav-btn-label">Previous</span>
                <span className="cs-nav-btn-name">{prev.name}</span>
              </span>
            </motion.button>
          ) : <div />}

          {next ? (
            <motion.button
              className="cs-nav-btn cs-nav-btn--next"
              onClick={() => handleNavigate(next.id)}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span>
                <span className="cs-nav-btn-label">Next</span>
                <span className="cs-nav-btn-name">{next.name}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          ) : <div />}
        </div>

      </div>
    </motion.div>
  )
}
