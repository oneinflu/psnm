import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Impact.css'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    id: 'growth',
    prefix: '', target: 45, suffix: '%',
    metric: 'Transaction Growth',
    context: 'MyGold Blockchain',
    caption: 'Redesigned the payment and gold transaction checkout layer. Removed 3 friction steps from the core flow. Conversion moved from baseline to a 45% lift within two months of launch.',
    bar: 45,
    accent: '#dfb743',
  },
  {
    id: 'tat',
    prefix: '', target: 60, suffix: '%',
    metric: 'TAT Reduction',
    context: 'XOLOX CRM',
    caption: 'Automated manual loan TAT logging and status handoffs across 4 team roles. What took 3 hours of back-office work per case dropped to under 72 minutes.',
    bar: 60,
    accent: '#34d399',
  },
  {
    id: 'origination',
    prefix: '', target: 40, suffix: '%',
    metric: 'Loan Origination Improvement',
    context: 'Agri Khatha',
    caption: 'Rebuilt a 12-step multi-form loan application into a 4-step guided wizard. Applicant drop-off fell 40%. First loan approved through the new flow within week one.',
    bar: 40,
    accent: '#818cf8',
  },
  {
    id: 'savings',
    prefix: '$', target: 1, suffix: 'M',
    metric: 'Operational Savings',
    context: 'MarketU + XOLOX',
    caption: 'Consolidated redundant vendor contracts, refactored cloud resource allocation, and eliminated manual ops work through automation. $1M saved across two products over 18 months.',
    bar: 100,
    accent: '#fb923c',
  },
]

export default function Impact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header
      gsap.fromTo('.impact-eyebrow',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.impact-section', start: 'top 78%' }
        }
      )
      gsap.fromTo('.impact-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.1,
          scrollTrigger: { trigger: '.impact-section', start: 'top 78%' }
        }
      )

      // Cards — stagger in
      gsap.fromTo('.impact-card',
        { y: 56, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.12,
          scrollTrigger: { trigger: '.impact-grid', start: 'top 82%' }
        }
      )

      // Counter + bar per card
      CARDS.forEach(({ id, prefix, target, suffix, bar }) => {
        const card = document.getElementById(`impact-card-${id}`)
        const numEl = card?.querySelector('.impact-number')
        const barEl = card?.querySelector('.impact-bar-fill')
        if (!card) return

        // Counter
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
          onUpdate() {
            numEl.textContent = prefix + (target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1)) + suffix
          },
        })

        // Progress bar
        if (barEl) {
          gsap.fromTo(barEl,
            { scaleX: 0 },
            {
              scaleX: bar / 100, duration: 2, ease: 'power3.out', transformOrigin: 'left',
              scrollTrigger: { trigger: card, start: 'top 85%' }
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="impact" className="impact-section" ref={sectionRef}>
      {/* Background ambient glow */}
      <div className="impact-bg-ambient" />

      <div className="container">
        {/* Header */}
        <div className="impact-section-header">
          <span className="impact-eyebrow">OUTCOMES</span>
          <h2 className="impact-heading">
            Numbers that<br />
            <span className="gradient-text">moved the business.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="impact-grid">
          {CARDS.map(({ id, prefix, target, suffix, metric, context, caption, accent }) => (
            <div key={id} id={`impact-card-${id}`} className="impact-card">
              {/* Glow orb */}
              <div className="impact-card-glow" style={{ '--card-accent': accent }} />

              <div className="impact-card-inner">
                {/* Context label */}
                <span className="impact-context">{context}</span>

                {/* Big number */}
                <div className="impact-number-wrap">
                  <span
                    className="impact-number"
                    style={{ '--card-accent': accent }}
                    data-prefix={prefix}
                    data-target={target}
                    data-suffix={suffix}
                  >
                    {prefix}0{suffix}
                  </span>
                </div>

                {/* Metric label */}
                <h3 className="impact-metric">{metric}</h3>

                {/* Caption */}
                <p className="impact-caption">{caption}</p>

                {/* Progress bar */}
                <div className="impact-bar-track">
                  <div className="impact-bar-fill" style={{ '--card-accent': accent }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
