import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProductThinking.css'

gsap.registerPlugin(ScrollTrigger)

// ── Stage data: the full PM system ──────────────────────────────
const STAGES = [
  {
    id: 'discovery',
    num: '01',
    name: 'Discovery',
    tagline: 'Find the right problem before writing a single spec.',
    description:
      'Discovery is not a phase — it\'s a posture. I start every product cycle by spending time with the people who have the problem, not the people who think they know the solution. The goal is to understand what\'s worth building before committing to building it.',
    questions: [
      'What job is the user actually trying to get done?',
      'What is the cost of NOT solving this problem?',
      'Who else has tried — and why did they fail?',
      'Is this a problem worth solving at all?',
    ],
    tools: ['User Interviews', 'Stakeholder Mapping', 'Market Scanning', 'Observation'],
    output: 'Opportunity brief: problem space, affected users, and business case.',
    loop: null,
  },
  {
    id: 'research',
    num: '02',
    name: 'Research',
    tagline: 'Understand behavior, not just opinions.',
    description:
      'Research separates what users say from what users do. I combine qualitative depth — interviews, shadowing, observation — with quantitative breadth — analytics, funnels, cohorts — to find patterns that neither method reveals alone.',
    questions: [
      'Where does behavior diverge from stated preference?',
      'What workarounds have users already invented?',
      'What does the data show about where users drop off?',
      'Who are the power users — and what makes them different?',
    ],
    tools: ['User Interviews', 'Mixpanel', 'Hotjar', 'Surveys', 'Session Recording'],
    output: 'Research synthesis: behavioral patterns, personas, journey maps.',
    loop: null,
  },
  {
    id: 'problem-framing',
    num: '03',
    name: 'Problem Framing',
    tagline: 'A well-defined problem is half the solution.',
    description:
      'Most teams rush past problem framing to get to solutions. I slow down here deliberately. The goal is to collapse all the research into one crisp, testable problem statement that everyone — engineering, design, leadership — can align on before a single wireframe is drawn.',
    questions: [
      'What is the root cause, not just the visible symptom?',
      'Is this a product problem or a user mental model problem?',
      'Can we state the problem in one sentence without mentioning a solution?',
      'What would solving this completely look like?',
    ],
    tools: ['Jobs-to-be-Done', 'How Might We', 'Point of View Statements', 'Fishbone Analysis'],
    output: 'Problem statement, JTBD framework, success metrics definition.',
    loop: null,
  },
  {
    id: 'prioritization',
    num: '04',
    name: 'Prioritization',
    tagline: 'Deciding what NOT to build is the hardest call.',
    description:
      'Every team has more ideas than capacity. Prioritization is where product strategy becomes real. I use structured frameworks to make trade-offs explicit and transparent — not just for the team, but for leadership. "Not now" is a product decision, not a rejection.',
    questions: [
      'What gives the most user value for the least engineering effort?',
      'Which bet moves the core business metric most directly?',
      'What happens if we don\'t ship this in the next quarter?',
      'What are we explicitly NOT building — and why?',
    ],
    tools: ['RICE Scoring', 'Impact / Effort Matrix', 'MoSCoW', 'Opportunity Scoring'],
    output: 'Prioritized backlog, roadmap, and documented trade-off decisions.',
    loop: null,
  },
  {
    id: 'prd',
    num: '05',
    name: 'PRD',
    tagline: 'Write it once. Build it right. Ship it fast.',
    description:
      'A PRD is a contract between Product, Design, and Engineering. I write PRDs that define scope tightly, anticipate edge cases early, and make every constraint explicit — so the team can move fast without rework and without ambiguity.',
    questions: [
      'What exactly does this feature do — and what does it NOT do?',
      'What are the edge cases that could break the experience?',
      'What does "done" actually look like?',
      'What assumptions are we making that need validation?',
    ],
    tools: ['Linear', 'Notion', 'Confluence', 'User Stories', 'Acceptance Criteria'],
    output: 'PRD with user stories, edge cases, scope boundaries, and acceptance criteria.',
    loop: null,
  },
  {
    id: 'ux',
    num: '06',
    name: 'UX',
    tagline: 'Design for the user who is busy, distracted, and not reading instructions.',
    description:
      'Great UX is invisible friction removal — not beautiful screens. I design with the assumption that users are in a hurry, on a bad connection, and won\'t read any help text. If it needs explaining, it needs redesigning.',
    questions: [
      'What is the single most important action on this screen?',
      'Can a first-time user complete the core task without any guidance?',
      'Where does cognitive load spike — and how do we reduce it?',
      'Does this design survive the 3am, low-battery, bad-wifi test?',
    ],
    tools: ['Figma', 'Maze', 'Usability Testing', 'User Flows', 'Prototyping'],
    output: 'User flows, wireframes, hi-fi designs, tested prototype.',
    loop: null,
  },
  {
    id: 'mvp',
    num: '07',
    name: 'MVP',
    tagline: 'Ship to learn. Not to impress.',
    description:
      'The MVP is a learning vehicle, not a scaled-down product. I define the smallest possible surface area that can answer the most important question — then ship it to real users as fast as possible. Speed is the point. Polish is earned, not assumed.',
    questions: [
      'What is the one question this ship must answer?',
      'What can we cut without losing the ability to learn?',
      'Who is the right user to test this with first?',
      'What does "validated" actually look like in this context?',
    ],
    tools: ['Feature Flags', 'Staged Rollouts', 'Agile Sprints', 'A/B Testing'],
    output: 'Working product, shipped to a real segment, with instrumented feedback loops.',
    loop: null,
  },
  {
    id: 'analytics',
    num: '08',
    name: 'Analytics',
    tagline: 'Measure what matters. Ignore everything else.',
    description:
      'Analytics is not about collecting data — it\'s about answering questions. I define metrics before shipping, instrument the product to capture them precisely, and build dashboards that tell a story rather than just displaying numbers. Data is only useful if it changes a decision.',
    questions: [
      'Are users doing what we expected — and if not, why not?',
      'What is the activation rate on the core value moment?',
      'Where in the funnel are we losing users we shouldn\'t be losing?',
      'What would prove this is working? What would prove it isn\'t?',
    ],
    tools: ['Mixpanel', 'Amplitude', 'SQL', 'Looker', 'PostHog'],
    output: 'Metric dashboard, retention curves, decision log, iteration plan.',
    loop: 'Analytics closes the loop — findings feed directly back into Discovery for the next cycle.',
  },
  {
    id: 'growth',
    num: '09',
    name: 'Growth',
    tagline: 'Find the loop. Fuel the loop. Protect the loop.',
    description:
      'Growth is not a campaign — it\'s a system. I look for the natural growth loop embedded in the product itself, then design features and channels that accelerate it. The most durable growth levers are product improvements, not marketing budgets.',
    questions: [
      'What is the one metric that, if it moved, would move everything else?',
      'Is the growth loop in the product — or dependent on paid spend?',
      'What is the viral coefficient, and can product design improve it?',
      'Where is the biggest gap between acquisition and long-term retention?',
    ],
    tools: ['A/B Testing', 'Referral Mechanics', 'SEO', 'Product-Led Growth', 'Cohort Analysis'],
    output: 'Growth model, acquisition channels, retention improvements, experiment roadmap.',
    loop: 'Growth surfaces new problems at scale — which loops back into Discovery.',
  },
]

// ── Mini flowchart node positions for the header map ────────────
// Arranged as S-curve: row 1 L→R, row 2 R→L, row 3 L→R
const FLOWMAP_ROWS = [
  [STAGES[0], STAGES[1], STAGES[2]],  // Discovery → Research → Problem Framing
  [STAGES[5], STAGES[4], STAGES[3]],  // UX ← PRD ← Prioritization
  [STAGES[6], STAGES[7], STAGES[8]],  // MVP → Analytics → Growth
]

export default function ProductThinking() {
  const [activeId, setActiveId] = useState('discovery')
  const navigate    = useNavigate()
  const pageRef     = useRef(null)
  const activeStage = STAGES.find(s => s.id === activeId)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      gsap.fromTo('.pt-hero-label', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 })
      gsap.fromTo('.pt-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'power4.out', delay: 0.25 })
      gsap.fromTo('.pt-hero-desc',  { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5 })

      gsap.fromTo('.fmap-node',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: '.pt-flowmap', start: 'top 80%' } }
      )

      gsap.fromTo('.stage-node',
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.pt-stage-list', start: 'top 75%' } }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.div
      ref={pageRef}
      className="pt-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* ── Nav ── */}
      <nav className="pt-nav">
        <motion.button className="pt-nav-back" onClick={() => navigate('/')} whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </motion.button>
        <span className="pt-nav-title">How I Build Products</span>
        <div />
      </nav>

      <div className="pt-body">

        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <section className="pt-hero">
          <div className="pt-hero-bg" />
          <div className="pt-container">
            <span className="pt-hero-label">PRODUCT THINKING</span>
            <h1 className="pt-hero-title">
              How I Build<br />
              <span className="gradient-text">Products.</span>
            </h1>
            <p className="pt-hero-desc">
              Not a checklist. A system. Nine interlocking stages that turn ambiguity into shipped product — and shipped product into growth.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════
            MINI FLOWMAP (S-curve overview)
        ══════════════════════════════ */}
        <section className="pt-flowmap-section">
          <div className="pt-container">
            <p className="pt-flowmap-label">THE FULL SYSTEM</p>
            <div className="pt-flowmap">
              {FLOWMAP_ROWS.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`fmap-row ${rowIdx % 2 === 1 ? 'fmap-row--reversed' : ''}`}
                >
                  {row.map((stage, colIdx) => {
                    const isLast = colIdx === row.length - 1
                    return (
                      <div key={stage.id} className="fmap-node-wrap">
                        <button
                          className={`fmap-node ${activeId === stage.id ? 'fmap-node--active' : ''}`}
                          onClick={() => setActiveId(stage.id)}
                        >
                          <span className="fmap-num">{stage.num}</span>
                          <span className="fmap-name">{stage.name}</span>
                        </button>
                        {!isLast && (
                          <div className="fmap-h-arrow">
                            <div className="fmap-h-line" />
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                              <path d="M1 1L7 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {/* Turn connector between rows */}
                  {rowIdx < FLOWMAP_ROWS.length - 1 && (
                    <div className={`fmap-turn ${rowIdx % 2 === 0 ? 'fmap-turn--right' : 'fmap-turn--left'}`}>
                      <div className="fmap-turn-line" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            MAIN SPLIT — STAGE LIST + DETAIL
        ══════════════════════════════ */}
        <section className="pt-main">
          <div className="pt-container pt-split">

            {/* LEFT — Stage list */}
            <div className="pt-stage-list">
              <div className="pt-stage-spine" />
              {STAGES.map((stage, idx) => {
                const isActive = stage.id === activeId
                const activeIdx = STAGES.findIndex(s => s.id === activeId)
                const isPast = idx < activeIdx
                return (
                  <div key={stage.id} className="stage-node-wrap">
                    <button
                      className={`stage-node ${isActive ? 'stage-node--active' : ''} ${isPast ? 'stage-node--past' : ''}`}
                      onClick={() => setActiveId(stage.id)}
                    >
                      <div className={`stage-dot ${isActive ? 'stage-dot--active' : ''} ${isPast ? 'stage-dot--past' : ''}`}>
                        {isPast && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3.5 6L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="stage-node-text">
                        <span className="stage-node-num">{stage.num}</span>
                        <span className="stage-node-name">{stage.name}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          className="stage-node-active-bar"
                          layoutId="active-bar"
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                    </button>
                    {/* Spine segment — filled if past or active */}
                    {idx < STAGES.length - 1 && (
                      <div className={`spine-segment ${isPast || isActive ? 'spine-segment--filled' : ''}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* RIGHT — Stage detail */}
            <div className="pt-detail-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  className="pt-detail"
                  initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
                  exit={{    opacity: 0, x: -24, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="pt-detail-header">
                    <span className="pt-detail-eyebrow">{activeStage.num}</span>
                    <h2 className="pt-detail-name">{activeStage.name}</h2>
                  </div>

                  <p className="pt-detail-tagline">{activeStage.tagline}</p>
                  <p className="pt-detail-desc">{activeStage.description}</p>

                  {/* Key Questions */}
                  <div className="pt-block">
                    <span className="pt-block-label">Key Questions</span>
                    <ul className="pt-questions">
                      {activeStage.questions.map((q, i) => (
                        <motion.li
                          key={i}
                          className="pt-question"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 + 0.15, duration: 0.4, ease: 'power3.out' }}
                        >
                          <span className="pt-q-mark">?</span>
                          {q}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools */}
                  <div className="pt-block">
                    <span className="pt-block-label">Tools &amp; Frameworks</span>
                    <div className="pt-tools">
                      {activeStage.tools.map((t, i) => (
                        <motion.span
                          key={t}
                          className="pt-tool"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 + 0.2, duration: 0.3 }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Output */}
                  <div className="pt-block">
                    <span className="pt-block-label">Output</span>
                    <div className="pt-output">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="pt-output-icon">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="pt-output-text">{activeStage.output}</p>
                    </div>
                  </div>

                  {/* Feedback loop */}
                  {activeStage.loop && (
                    <div className="pt-loop">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M12 7A5 5 0 1 1 7 2M12 2v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="pt-loop-text">{activeStage.loop}</p>
                    </div>
                  )}

                  {/* Prev / Next within stages */}
                  <div className="pt-stage-nav">
                    {STAGES[STAGES.findIndex(s => s.id === activeId) - 1] && (
                      <button
                        className="pt-stage-nav-btn"
                        onClick={() => setActiveId(STAGES[STAGES.findIndex(s => s.id === activeId) - 1].id)}
                      >
                        ← {STAGES[STAGES.findIndex(s => s.id === activeId) - 1].name}
                      </button>
                    )}
                    {STAGES[STAGES.findIndex(s => s.id === activeId) + 1] && (
                      <button
                        className="pt-stage-nav-btn pt-stage-nav-btn--next"
                        onClick={() => setActiveId(STAGES[STAGES.findIndex(s => s.id === activeId) + 1].id)}
                      >
                        {STAGES[STAGES.findIndex(s => s.id === activeId) + 1].name} →
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════
            CLOSING STATEMENT
        ══════════════════════════════ */}
        <section className="pt-closing">
          <div className="pt-container">
            <div className="pt-closing-inner">
              <p className="pt-closing-quote">
                "The best PMs I've worked with don't just manage products.<br />
                They build systems for making better decisions, faster."
              </p>
              <a href="mailto:contact@murthy.build" className="btn btn-primary btn-large">
                Let's Build Something →
              </a>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
