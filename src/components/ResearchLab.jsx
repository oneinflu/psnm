import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ResearchLab.css'

gsap.registerPlugin(ScrollTrigger)

// ── Research stats ────────────────────────────────────────────
const STATS = [
  { value: 50, suffix: '+', label: 'User Interviews' },
  { value: 500, suffix: '+', label: 'Survey Responses' },
  { value: 4, suffix: '', label: 'States Covered' },
  { value: 3, suffix: '', label: 'Industries' },
]

// ── Methods ───────────────────────────────────────────────────
const METHODS = [
  {
    id: 'interviews',
    num: '01',
    name: 'User Interviews',
    shortDesc: '1:1 depth sessions to surface what surveys never reach.',
    stat: '50+',
    statLabel: 'conducted',
    tagline: 'The fastest way to be wrong less.',
    description:
      'I run 45–60 minute interviews with room for open-ended probing. Every session follows a hypothesis I\'m trying to disprove — not confirm. I use SPIN questioning to move from situation → problem → implication → need-payoff without leading the witness. The goal is to find the uncomfortable truth, not validate the roadmap.',
    techniques: ['SPIN Questioning', '5 Whys', 'Think-Aloud Protocol', 'Retrospective Probing', 'Laddering'],
    outputs: [
      'Behavioral pattern clusters',
      'Mental model maps',
      'Verbatim insight library',
      'Top unmet needs ranking',
    ],
    field: {
      product: 'Agri Khatha',
      finding:
        'Farmers weren\'t rejecting the app — they were handing the phone to their children to fill it out. The actual user wasn\'t who we designed for.',
      impact:
        'Redesigned onboarding for a "guided by family member" usage pattern. Activation rate increased 38%.',
    },
  },
  {
    id: 'journey-maps',
    num: '02',
    name: 'Journey Maps',
    shortDesc: 'Map where the product ends and the user\'s life continues.',
    stat: '12+',
    statLabel: 'journeys mapped',
    tagline: 'Where your product ends is where the user\'s life begins.',
    description:
      'I build journeys that extend beyond the product screen — from the moment a need arises to the moment it\'s fully resolved (which is often outside the app). Maps are built in collaborative workshops combining direct observation, interview quotes, and drop-off analytics. I\'m looking for moments of invisible friction: the workaround users invented that they\'ve stopped noticing.',
    techniques: ['Cross-functional workshops', 'Emotional arc mapping', 'Touchpoint audits', 'Service blueprinting', 'Shadow sessions'],
    outputs: [
      'Moments of truth inventory',
      'Pain and gain by phase',
      'Cross-channel experience map',
      'Prioritized friction list',
    ],
    field: {
      product: 'XOLOX CRM',
      finding:
        'Sales reps were copying CRM data into WhatsApp messages to share with clients. They had silently built a shadow system because the real one couldn\'t do this.',
      impact:
        'Added WhatsApp-native sharing from lead cards. Reduced manual re-entry by 70% per rep per week.',
    },
  },
  {
    id: 'personas',
    num: '03',
    name: 'Personas',
    shortDesc: 'Behavioral archetypes — not age ranges and job titles.',
    stat: '18+',
    statLabel: 'personas validated',
    tagline: 'Not demographics. Behaviors.',
    description:
      'Demographic personas die in the first sprint. I build behavioral personas — clustered around goals, anxieties, and mental models, not age brackets. Every persona starts from raw interview transcripts. I use affinity clustering to find behavioral patterns that cut across demographic lines, then stress-test each persona against real usage data.',
    techniques: ['Behavioral clustering', 'Empathy mapping', 'Scenario writing', 'Anti-persona definition', 'Validation scoring'],
    outputs: [
      '3–5 validated personas per product',
      'Behavior × goal matrix',
      'Anti-persona: who not to design for',
      'Persona confidence scorecard',
    ],
    field: {
      product: 'Examly LMS',
      finding:
        '"Silent Achievers" — students who never raised flags but had the highest dropout rate. They were too proud to self-report confusion. We had been designing only for the vocal 20%.',
      impact:
        'Built proactive intervention triggered by behavioral signals, not self-reported struggle. Retention improved 22%.',
    },
  },
  {
    id: 'surveys',
    num: '04',
    name: 'Survey Analysis',
    shortDesc: 'Quantitative validation at scale — after the interviews, not instead of them.',
    stat: '500+',
    statLabel: 'responses analyzed',
    tagline: 'Scale the signal. Filter the noise.',
    description:
      'Surveys validate what interviews surface — they don\'t generate hypotheses. I build an analysis model before a survey goes live: specific question to answer, hypothesis to confirm or kill, statistical threshold for significance. I use max-diff, Likert, and NPS methodologies depending on what decision needs to be made.',
    techniques: ['Max-diff scaling', 'NPS driver analysis', 'Conjoint analysis', 'Open-text thematic coding', 'Cohort segmentation'],
    outputs: [
      'Statistically significant preference rankings',
      'NPS by cohort with driver analysis',
      'Feature priority matrix',
      'Validated problem statement',
    ],
    field: {
      product: 'MarketU',
      finding:
        '83% of operations managers rated "finding the latest version of an SOP" as their #1 daily friction — not creating them. We had been building the wrong thing entirely.',
      impact:
        'Pivoted MVP to SOP discovery + version clarity instead of creation. First enterprise client onboarded in week 2.',
    },
  },
  {
    id: 'jtbd',
    num: '05',
    name: 'Jobs to be Done',
    shortDesc: 'Find what job the user is actually hiring the product to do.',
    stat: '6',
    statLabel: 'products framed',
    tagline: 'People don\'t buy products. They hire them.',
    description:
      'JTBD reframes every product question. Instead of "what features do users want?", I ask "what job is the user hiring this product to do?" I run switch interviews — conversations with users who recently changed tools — to understand the struggling moment that triggered the switch. The anxiety that kept them stuck and the pull that made them move.',
    techniques: ['Switch interviews', 'Forces of Progress diagram', 'Functional/emotional/social job mapping', 'Opportunity scoring', 'Job story library'],
    outputs: [
      'Core JTBD statement',
      'Forces diagram: push, pull, anxiety, habit',
      'Competing hires analysis',
      'Job story library per persona',
    ],
    field: {
      product: 'Output Marketplace',
      finding:
        'Freelancers weren\'t hiring the platform to "find work." They were hiring it to "feel like a real professional." Credibility, not income, was the core job.',
      impact:
        'Added portfolio showcase, client testimonials, and skill badges to MVP. Profile completion hit 78% in month one.',
    },
  },
  {
    id: 'opportunity-mapping',
    num: '06',
    name: 'Opportunity Mapping',
    shortDesc: 'Find the underserved outcomes before your competitor does.',
    stat: '4',
    statLabel: 'landscapes mapped',
    tagline: 'Find the white space before your competitor does.',
    description:
      'Opportunity mapping combines competitive analysis, unmet need identification, and importance-satisfaction scoring to reveal where the market is genuinely underserved. I use Opportunity-Solution Trees to connect desired outcomes → opportunities → solutions — keeping the team anchored to problems rather than drifting into feature-building mode.',
    techniques: ['Opportunity-Solution Trees', 'Importance × satisfaction mapping', 'Competitive gap analysis', 'Outcome-Driven Innovation scoring', 'Adjacent space scanning'],
    outputs: [
      'Opportunity landscape map',
      'Top 10 underserved outcomes ranked',
      'Competitive positioning matrix',
      'Opportunity-Solution Tree',
    ],
    field: {
      product: 'MyGold Blockchain',
      finding:
        'The gold loan market had 3 major digital players — but none had solved "trust verification" at the branch level. Physical verification was the bottleneck no one had digitized.',
      impact:
        'Identified trust verification as the highest importance, lowest satisfaction outcome. Became core differentiator; secured first 3 enterprise partnerships.',
    },
  },
]

// ── Icon components (inline SVG) ─────────────────────────────
function IconInterviews() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconJourney() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M2 11h4l3-7 4 14 3-7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPersonas() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 13c2.21 0 4 1.567 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconSurveys() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h8M7 11h8M7 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconJTBD() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 6v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconOpportunity() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2l2.4 7H21l-6.2 4.5 2.4 7L11 16.5 4.8 20.5l2.4-7L1 9h7.6L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const METHOD_ICONS = {
  'interviews': <IconInterviews />,
  'journey-maps': <IconJourney />,
  'personas': <IconPersonas />,
  'surveys': <IconSurveys />,
  'jtbd': <IconJTBD />,
  'opportunity-mapping': <IconOpportunity />,
}

export default function ResearchLab() {
  const [activeId, setActiveId] = useState('interviews')
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const activeMethod = METHODS.find(m => m.id === activeId)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo('.rl-hero-eyebrow',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo('.rl-hero-title',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power4.out', delay: 0.2 }
      )
      gsap.fromTo('.rl-hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.45 }
      )
      gsap.utils.toArray('.rl-stat-value').forEach((el) => {
        const target = parseInt(el.dataset.target, 10)
        const hasSuffix = el.dataset.suffix || ''
        gsap.fromTo({ val: 0 }, { val: target }, {
          duration: 1.6,
          ease: 'power2.out',
          delay: 0.5,
          onUpdate() {
            el.textContent = Math.round(this.targets()[0].val) + hasSuffix
          },
          scrollTrigger: { trigger: '.rl-stats', start: 'top 85%' },
        })
      })
      gsap.fromTo('.rl-method-card',
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: '.rl-grid', start: 'top 80%' },
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.div
      ref={pageRef}
      className="rl-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* ── Nav ── */}
      <nav className="rl-nav">
        <motion.button className="rl-nav-back" onClick={() => navigate('/')} whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </motion.button>
        <span className="rl-nav-title">Research Lab</span>
        <div />
      </nav>

      <div className="rl-body">

        {/* ════════════════════════
            HERO
        ════════════════════════ */}
        <section className="rl-hero">
          <div className="rl-hero-bg" />
          <div className="rl-container">
            <span className="rl-hero-eyebrow">RESEARCH LAB</span>
            <h1 className="rl-hero-title">
              Research that<br />
              <span className="gradient-text">Changes Decisions.</span>
            </h1>
            <p className="rl-hero-sub">
              Most PMs talk to users once a quarter. I built a research practice from scratch across three industries and four states — because the product is only as good as the understanding behind it.
            </p>
          </div>
        </section>

        {/* ════════════════════════
            STATS STRIP
        ════════════════════════ */}
        <div className="rl-stats">
          <div className="rl-container">
            <div className="rl-stats-grid">
              {STATS.map((s) => (
                <div key={s.label} className="rl-stat">
                  <span
                    className="rl-stat-value"
                    data-target={s.value}
                    data-suffix={s.suffix}
                  >
                    0{s.suffix}
                  </span>
                  <span className="rl-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════
            MAIN SPLIT — GRID + DETAIL
        ════════════════════════ */}
        <section className="rl-main">
          <div className="rl-container">
            <div className="rl-split">

              {/* LEFT — Method grid */}
              <div className="rl-grid-wrap">
                <p className="rl-grid-label">THE TOOLKIT</p>
                <div className="rl-grid">
                  {METHODS.map((m) => {
                    const isActive = m.id === activeId
                    return (
                      <motion.button
                        key={m.id}
                        className={`rl-method-card ${isActive ? 'rl-method-card--active' : ''}`}
                        onClick={() => setActiveId(m.id)}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="rl-card-top">
                          <span className={`rl-card-icon ${isActive ? 'rl-card-icon--active' : ''}`}>
                            {METHOD_ICONS[m.id]}
                          </span>
                          <span className="rl-card-num">{m.num}</span>
                        </div>
                        <div className="rl-card-body">
                          <h3 className="rl-card-name">{m.name}</h3>
                          <p className="rl-card-desc">{m.shortDesc}</p>
                        </div>
                        <div className="rl-card-stat">
                          <span className="rl-card-stat-value">{m.stat}</span>
                          <span className="rl-card-stat-label">{m.statLabel}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            className="rl-card-active-line"
                            layoutId="card-active"
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* RIGHT — Detail panel */}
              <div className="rl-detail-wrap">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId}
                    className="rl-detail"
                    initial={{ opacity: 0, x: 28, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -28, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Header */}
                    <div className="rl-detail-header">
                      <span className={`rl-detail-icon`}>{METHOD_ICONS[activeId]}</span>
                      <div>
                        <span className="rl-detail-eyebrow">{activeMethod.num}</span>
                        <h2 className="rl-detail-name">{activeMethod.name}</h2>
                      </div>
                    </div>

                    <p className="rl-detail-tagline">"{activeMethod.tagline}"</p>
                    <p className="rl-detail-desc">{activeMethod.description}</p>

                    {/* Techniques */}
                    <div className="rl-block">
                      <span className="rl-block-label">Techniques</span>
                      <div className="rl-tags">
                        {activeMethod.techniques.map((t, i) => (
                          <motion.span
                            key={t}
                            className="rl-tag"
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                          >
                            {t}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Outputs */}
                    <div className="rl-block">
                      <span className="rl-block-label">Outputs</span>
                      <ul className="rl-outputs">
                        {activeMethod.outputs.map((o, i) => (
                          <motion.li
                            key={i}
                            className="rl-output-item"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 + 0.15, duration: 0.35 }}
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="rl-check">
                              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {o}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* From the Field */}
                    <motion.div
                      className="rl-field"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className="rl-field-header">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 7.5L2.5 10L3.5 6.5L1 4.5H4.5L6 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        </svg>
                        <span>From the field — {activeMethod.field.product}</span>
                      </div>
                      <div className="rl-field-body">
                        <div className="rl-field-finding">
                          <span className="rl-field-pill">Finding</span>
                          <p>{activeMethod.field.finding}</p>
                        </div>
                        <div className="rl-field-impact">
                          <span className="rl-field-pill rl-field-pill--impact">Impact</span>
                          <p>{activeMethod.field.impact}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Next method */}
                    {METHODS[METHODS.findIndex(m => m.id === activeId) + 1] && (
                      <button
                        className="rl-next-btn"
                        onClick={() => setActiveId(METHODS[METHODS.findIndex(m => m.id === activeId) + 1].id)}
                      >
                        Next: {METHODS[METHODS.findIndex(m => m.id === activeId) + 1].name} →
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════
            PHILOSOPHY STRIP
        ════════════════════════ */}
        <section className="rl-philosophy">
          <div className="rl-container">
            <div className="rl-phil-grid">
              {[
                { num: '01', rule: 'Research to disprove, not to confirm.', body: 'Every session has a hypothesis I\'m trying to kill. Confirmation bias is the death of good product research.' },
                { num: '02', rule: 'Talk to the outliers first.', body: 'Power users and churned users reveal the floor and ceiling of the product. Start at the edges, not the middle.' },
                { num: '03', rule: 'Behavior over preference.', body: 'What users do is data. What users say they\'ll do is a story. I build on data.' },
                { num: '04', rule: 'Research changes decisions or it didn\'t happen.', body: 'If I do research and the roadmap doesn\'t move, I did the wrong research. The output is a decision, not a report.' },
              ].map((p) => (
                <div key={p.num} className="rl-phil-card">
                  <span className="rl-phil-num">{p.num}</span>
                  <h3 className="rl-phil-rule">{p.rule}</h3>
                  <p className="rl-phil-body">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════
            CLOSING
        ════════════════════════ */}
        <section className="rl-closing">
          <div className="rl-container">
            <div className="rl-closing-inner">
              <p className="rl-closing-quote">
                "You can't build the right thing<br />
                if you don't understand the person who needs it."
              </p>
              <a href="mailto:contact@murthy.build" className="btn btn-primary btn-large">
                Talk Research →
              </a>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
