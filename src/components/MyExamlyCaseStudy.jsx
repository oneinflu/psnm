import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './MyExamlyCaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESEARCH_METHODS = [
  {
    num: '01',
    method: 'In-Depth User Interviews',
    n: 52,
    label: 'participants',
    profile: 'Mix of active CPA/CMA candidates (working professionals + recent graduates), exam failures, and first-time passers',
    format: '45–60 min · Semi-structured · Remote (Zoom)',
    findings: [
      'Daily study routine & time management',
      'Emotional experience during prep',
      'How candidates decide what to study each day',
      'Past tool usage and frustrations',
      'Confidence levels approaching exam',
    ],
  },
  {
    num: '02',
    method: 'Contextual Inquiry',
    n: 12,
    label: 'sessions',
    profile: 'Observed in actual study environments — home desk, commute, lunch breaks',
    format: 'In-situ observation · Live note-taking',
    findings: [
      '8 of 12 had multiple browser tabs open — no single source of truth',
      'Most handwrote "what I need to study" lists on paper or sticky notes',
      'Work interruptions caused complete loss of momentum',
    ],
  },
  {
    num: '03',
    method: 'Survey',
    n: 340,
    label: 'responses',
    profile: 'CPA candidate communities, LinkedIn CPA groups, partner institutes',
    format: 'Quantitative + open text · 12 questions',
    findings: [
      'Only 31% stick to a self-made study plan for more than 3 weeks',
      '67% waste 15–40 min per session deciding what to study',
      '79% describe high anxiety in the final 2 weeks before exam',
      '54% who bought Becker or UWorld dropped active usage within 6 weeks',
    ],
  },
  {
    num: '04',
    method: 'Competitive Benchmarking',
    n: 5,
    label: 'platforms',
    profile: 'Becker CPA Review, UWorld CPA, Roger CPA, Surgent CPA, Ninja CPA',
    format: '6 evaluation dimensions · 40+ hours of hands-on usage',
    findings: [
      'Becker & UWorld have deep content but overwhelming UI — students feel "lost in features"',
      'No tool adapts the schedule dynamically if a student misses days',
      'Analytics exist but are backward-looking — no actionable "study this now" signal',
      'Mobile experience is secondary; none optimized for micro-learning on commutes',
      'Price barrier ($2,500–$3,500) excludes large segments, especially international candidates',
    ],
  },
  {
    num: '05',
    method: 'Diary Study',
    n: 18,
    label: 'participants',
    profile: '3-week longitudinal — daily 2-min voice/text logs: what they did, how they felt, what blocked them',
    format: '3 weeks · Daily logs · 18 active learners',
    findings: [
      'Study sessions under 30 min happened 3x more than planned 2-hour sessions',
      'Emotional state (stressed from work) directly correlated with study skips',
      'Students who scored well on a quiz stopped studying that topic — overconfidence bias',
      'Weekends produced 60% of weekly study hours but with lower retention per hour',
    ],
  },
]

const AFFINITY_THEMES = [
  { icon: '🧊', theme: 'Planning paralysis', desc: 'Candidates don\'t know where to start — the blank slate kills momentum before it begins.' },
  { icon: '👻', theme: 'Progress invisibility', desc: 'Effort doesn\'t feel like it\'s compounding. Studying for months with no sense of forward motion.' },
  { icon: '🎭', theme: 'Simulation gap', desc: 'Practice questions feel nothing like the real exam — creating false confidence or false failure.' },
  { icon: '🏜', theme: 'Support desert', desc: 'No one to ask "is this answer right?" at 11pm when most working professionals study.' },
  { icon: '🌊', theme: 'Life happens', desc: 'Work, family, and health derail even motivated candidates. No plan survives contact with real life.' },
]

const JTBDS = [
  {
    job: 'When I sit down to study, I want to know exactly what to focus on, so I don\'t waste time deciding or feel like I\'m going in circles.',
    frequency: 'Daily',
    driver: 'Anxiety reduction',
  },
  {
    job: 'When I take a practice test, I want to feel like it\'s the real thing, so I build confidence and not just pattern-match to a specific platform\'s format.',
    frequency: 'Weekly',
    driver: 'Confidence building',
  },
  {
    job: 'When I fall behind my plan, I want the system to adapt automatically, so I don\'t have to rebuild my schedule from scratch and lose motivation.',
    frequency: 'Occasional',
    driver: 'Recovery from setbacks',
  },
  {
    job: 'When I get a concept wrong, I want to understand why immediately — not just see "Correct Answer: C".',
    frequency: 'Every session',
    driver: 'Mastery & clarity',
  },
  {
    job: 'When I\'m commuting or have 15 mins free, I want to do something useful toward my exam so prep fits my real life — not just ideal conditions.',
    frequency: 'Daily',
    driver: 'Efficiency & life fit',
  },
]

const KEY_INSIGHTS = [
  {
    id: 'I-01',
    insight: 'Study plan failure is an emotional problem, not an information problem.',
    evidence: 'Candidates knew what they "should" study — they just couldn\'t start when tired or stressed. Information is not the bottleneck; motivation and momentum are.',
    implication: 'Build momentum mechanics — micro-wins, streaks, "pick up where you left off" — not just more content.',
  },
  {
    id: 'I-02',
    insight: 'The daily study decision is a hidden tax on every candidate\'s time and energy.',
    evidence: '67% report 15–40 min lost per session just deciding what to study. Decision fatigue compounds over months of prep.',
    implication: 'Remove the decision entirely — the system prescribes today\'s task, not a menu of options.',
  },
  {
    id: 'I-03',
    insight: 'Quiz scores create false confidence. Students stop studying topics they score 70% on — not knowing 75% is the pass threshold.',
    evidence: 'Diary study: 11 of 18 participants stopped revisiting topics after first "good" attempt.',
    implication: 'Build readiness scoring against actual pass benchmarks, not relative performance.',
  },
  {
    id: 'I-04',
    insight: 'Exam simulation is a trust exercise, not just a practice exercise.',
    evidence: 'Candidates who felt mock exams "felt real" reported 2x higher confidence heading into the actual exam.',
    implication: 'Mirror AICPA/IMA exam format exactly — same timing, UI constraints, question types and proportions.',
  },
  {
    id: 'I-05',
    insight: 'The support gap peaks at 10pm–1am — when most working professionals study.',
    evidence: 'Interviewees consistently mentioned hitting a concept wall with no one to ask. Forums are slow, tutors unavailable.',
    implication: 'AI tutor must be instant, context-aware, and good at "explain this differently" — not just a search wrapper.',
  },
]

const PERSONAS = [
  {
    id: 'P-01',
    name: 'Priya',
    tag: 'The Exhausted Achiever',
    age: 27,
    role: 'Senior Associate, Big 4 Accounting Firm',
    location: 'Chicago, IL',
    exam: 'CPA USA (FAR + AUD)',
    quote: 'I spend my weekends studying but I still don\'t feel ready. I don\'t even know if I\'m studying the right things.',
    goals: ['Pass CPA within 12 months', 'Balance exam prep with 55-hour work weeks', 'Get promoted to Manager — CPA is mandatory'],
    frustrations: ['Becker feels like drinking from a firehose', 'Misses study days due to late work nights and loses track completely', 'Doesn\'t know if she\'s on track until she fails a mock exam'],
    behaviors: ['Studies in 20–30 min bursts during commute or lunch', 'Watches video lectures at 2x speed', 'Gives up on topics she doesn\'t understand and "moves on"'],
    state: 'High anxiety · Imposter syndrome · Time-poor',
    color: '#f59e0b',
  },
  {
    id: 'P-02',
    name: 'Arjun',
    tag: 'The Self-Directed Learner',
    age: 24,
    role: 'Recent B.Com Graduate, Job Seeker',
    location: 'Hyderabad, India',
    exam: 'CPA USA (all 4 sections)',
    quote: 'I need CPA to get into a US firm. I\'m studying from YouTube and free resources but I\'m not sure if it\'s enough.',
    goals: ['Clear CPA to get placed in a US-affiliated accounting firm', 'Self-fund prep — can\'t afford Becker at $3,000', 'Stay disciplined without a classroom or peer group'],
    frustrations: ['No structured roadmap — switches between topics randomly', 'Can\'t afford premium platforms', 'No community or accountability group'],
    behaviors: ['Studies 4–5 hrs/day', 'Highly motivated but unfocused', 'Relies heavily on community forums and Reddit'],
    state: 'Motivated but directionless · Financially anxious',
    color: '#38bdf8',
  },
  {
    id: 'P-03',
    name: 'Deepa',
    tag: 'The Institute Coordinator',
    age: 35,
    role: 'Academic Head, CPA Coaching Institute',
    location: 'Bangalore, India',
    exam: 'N/A — manages 200+ students across CPA & CMA batches',
    quote: 'I need to track which students are at risk before they fail — not after the results come.',
    goals: ['Improve institute-level pass rates', 'Get early warning signals on struggling students', 'Reduce instructor time spent on repeated concept explanations'],
    frustrations: ['Current LMS gives no per-student risk signal', 'Faculty spend time re-teaching basics instead of advanced problem-solving', 'Students don\'t report struggles until it\'s too late'],
    behaviors: ['Reviews student dashboards weekly', 'Holds group doubt-clearing sessions every Saturday', 'Tracks attendance as proxy for performance'],
    state: 'Accountable · Data-hungry · Time-strapped',
    color: '#a78bfa',
  },
]

const HMW = [
  'How might we remove the daily "what to study" decision so candidates can start immediately?',
  'How might we make progress feel visible and compounding — not invisible?',
  'How might we simulate the real exam environment well enough that candidates feel confident, not surprised, on test day?',
  'How might we support candidates at 11pm when no tutor is available?',
  'How might we keep the plan alive when life disrupts the schedule?',
]

const DESIGN_PRINCIPLES = [
  { principle: 'Prescribe, don\'t present', rationale: 'Candidates don\'t need more options — they need a clear "do this today". Choice creates friction.' },
  { principle: 'Surface the gap, not just the score', rationale: 'Showing a 72% score is meaningless without "you need 75% to pass". Always anchor to the real benchmark.' },
  { principle: 'Make recovery as easy as starting', rationale: 'Life will disrupt any plan. The product must absorb disruptions and resume without guilt or manual rebuilding.' },
  { principle: 'Earn confidence through realism', rationale: 'Confidence on exam day is built by simulations that feel indistinguishable from the real exam — not by feel-good scores.' },
  { principle: 'Explain like a tutor, not a textbook', rationale: 'Wrong answer feedback should answer "why" in plain language — not reference a chapter number.' },
]

const FEATURES = [
  { feature: 'AI Adaptive Study Scheduler', problem: 'Decision fatigue + plan collapse after missed days', impact: 'High', effort: 'High', priority: 'P0', metric: '% of candidates completing 90%+ of daily tasks' },
  { feature: 'Exam Simulation Engine (AICPA-mirror)', problem: 'Simulation gap — practice ≠ real exam experience', impact: 'High', effort: 'High', priority: 'P0', metric: 'Candidate confidence score before exam (self-reported)' },
  { feature: 'Section Readiness Score (vs. passing benchmark)', problem: 'Progress invisibility + false confidence from raw scores', impact: 'High', effort: 'Medium', priority: 'P0', metric: 'Reduction in "shocked by failure" post-exam feedback' },
  { feature: 'AI Tutor (instant concept Q&A)', problem: 'Support desert at late study hours', impact: 'High', effort: 'Medium', priority: 'P1', metric: 'Tutor session satisfaction rate, concept clarity rating' },
  { feature: 'Auto-reschedule after missed days', problem: 'Plan abandonment after life disruptions', impact: 'Medium-High', effort: 'Medium', priority: 'P1', metric: 'Plan resumption rate after 1+ missed day' },
  { feature: 'Offline Mode (mobile)', problem: 'Working professionals studying during commutes', impact: 'Medium', effort: 'Medium', priority: 'P1', metric: '% of sessions from mobile, offline session count' },
  { feature: 'Gamification (streaks, badges)', problem: 'Motivation over 12–18 month prep journey', impact: 'Medium', effort: 'Low', priority: 'P2', metric: 'DAU retention at 30/60/90 days' },
  { feature: 'Admin Risk Dashboard (institutes)', problem: 'Institute coordinators need early student failure signals', impact: 'High (B2B)', effort: 'Medium', priority: 'P1 B2B', metric: 'Institute-level pass rate improvement MoM' },
]

const DESIGN_PHASES = [
  { phase: 'Concept Sketching', output: 'Lo-fi sketches for 6 key flows: onboarding, dashboard, study session, mock exam, results, AI tutor', tested: false, screens: null },
  { phase: 'Wireframing', output: 'Mid-fidelity wireframes in Figma — 28 screens', tested: true, test: 'Cognitive walkthrough · 8 participants', screens: 28 },
  { phase: 'Prototype (Clickable)', output: 'High-fidelity Figma prototype — 42 screens', tested: true, test: 'Usability testing — moderated, remote', screens: 42 },
  { phase: 'Design System', output: 'Component library covering 30+ reusable components with accessibility annotations', tested: false, screens: null },
]

const CRITICAL_DECISIONS = [
  {
    decision: 'Show ONE task for today, not a full week calendar on the dashboard',
    rationale: 'Early wireframes showed the week view overwhelmed users. Cognitive load test showed users spent 3x longer deciding where to start. Simplifying to "Today\'s Focus" reduced task-start time from avg 4.2 mins to 48 seconds.',
    dropped: 'Weekly plan calendar (dropped after testing)',
  },
  {
    decision: 'Readiness meter anchored to 75% pass threshold, not 100%',
    rationale: 'Users consistently misread progress bars as "how much content I\'ve covered" not "am I ready to pass". Relabeling to exam-benchmark readiness reduced support tickets about "am I ready" by 38% in beta.',
    dropped: 'Content completion % bar (dropped — misleading)',
  },
  {
    decision: 'AI tutor as a floating persistent widget, not a separate page',
    rationale: 'When placed as a separate menu item, AI tutor usage was near zero in beta. Floating widget increased usage by 4.6x — students ask questions mid-lesson, not after.',
    dropped: 'Dedicated AI Tutor page in nav (dropped after beta)',
  },
  {
    decision: 'Mock exam launches full-screen with no sidebar or navigation',
    rationale: 'Tested 3 variants. Full-screen lock-in improved reported "felt like real exam" score from 3.1/5 to 4.4/5. Sidebar distracted and broke simulation immersion.',
    dropped: 'Mock exam with regular app chrome visible',
  },
]

const USABILITY_ROUNDS = [
  {
    round: 1,
    fidelity: 'Mid-fidelity wireframe',
    participants: 8,
    method: 'Moderated remote · Think-aloud protocol',
    sus: 61,
    findings: [
      { finding: 'Users couldn\'t distinguish "Practice Mode" from "Mock Exam" — assumed both were the same', severity: 'High', fix: 'Renamed and added a clear modal explaining the distinction before each mode launched' },
      { finding: 'Onboarding diagnostic quiz felt like a test — 3 users wanted to skip out of anxiety', severity: 'Medium', fix: 'Added framing copy: "This isn\'t graded — it helps us build your personalized plan." Skip option added for returning users.' },
      { finding: 'Progress analytics screen was data-dense — users didn\'t know where to look first', severity: 'Medium', fix: 'Introduced a single priority insight callout: "Your weakest area this week: FAR - Leases. Study this first."' },
    ],
  },
  {
    round: 2,
    fidelity: 'High-fidelity clickable prototype',
    participants: 12,
    method: 'Unmoderated (Maze) + 4 moderated sessions',
    sus: 79,
    findings: [
      { finding: 'AI tutor responses felt generic — users typed specific accounting questions and got broad answers', severity: 'High', fix: 'Fine-tuned on CPA/CMA-specific content; added follow-up prompt suggestions ("Ask: Give me an example")' },
      { finding: 'Task completion for "start a mock exam" was 67% — users couldn\'t find the button', severity: 'High', fix: 'Moved Mock Exam CTA to dashboard cards + added it to the sidebar nav as a persistent item' },
      { finding: 'After submitting mock exam, users didn\'t know what to do next — results page felt like an endpoint', severity: 'Medium', fix: 'Added "Next Recommended Session" CTA at the bottom of results with one-click resume' },
    ],
  },
]

const INPUT_METRICS = [
  { metric: 'Daily Task Completion Rate', desc: '% of assigned daily study tasks completed by active users', target: 70, current: 74, suffix: '%' },
  { metric: 'Mock Exam Attempt Rate', desc: '% of enrolled users who attempt ≥2 full mock exams before their exam date', target: 60, current: 63, suffix: '%' },
  { metric: 'Readiness Score at Exam Date', desc: 'Average readiness score of users on the day before their scheduled exam', target: 75, current: 78, suffix: '%' },
  { metric: 'Plan Resumption Rate', desc: '% of users who resume their study plan within 48hrs of missing a day', target: 55, current: 61, suffix: '%' },
  { metric: 'AI Tutor Satisfaction', desc: '% of AI tutor sessions rated 4/5 or above', target: 80, current: 76, suffix: '%' },
]

const QUOTES = [
  {
    quote: 'I\'d tried Becker twice and dropped out both times. MyExamly was the first platform where I knew exactly what to do every single day.',
    persona: 'Priya — Working professional, CPA candidate',
    outcome: 'Passed FAR on first attempt',
  },
  {
    quote: 'The mock exam felt exactly like the real thing. I wasn\'t surprised on exam day — I\'d already lived through it.',
    persona: 'Arjun — Self-directed learner',
    outcome: 'Passed BEC and REG in same exam window',
  },
  {
    quote: 'As an institute, we can now identify at-risk students 3 weeks before their exam and intervene. That\'s changed our pass rates fundamentally.',
    persona: 'Deepa — Institute coordinator',
    outcome: 'Institute pass rate improved from 71% to 89% in one batch',
  },
]

const RETRO = {
  worked: [
    'Removing study decision fatigue through prescriptive daily tasks was the single highest-impact UX change — before any other feature.',
    'Anchoring all progress to the actual passing benchmark (75%) created clarity that generic progress bars never could.',
    'AI tutor adoption spiked 4.6x when moved from a separate page to a floating persistent widget — placement matters as much as the feature itself.',
    'Contextual inquiry (observing users in real study environments) revealed behaviors that interviews alone never would have surfaced.',
  ],
  change: [
    'Should have tested the onboarding diagnostic framing much earlier — anxiety was a real barrier we only caught in Round 1 testing.',
    'B2B admin features were de-scoped too late in the process — should have been a separate design track from the beginning.',
    'Launched gamification (streaks) too early in MVP without enough data on what motivational patterns actually work for this specific audience.',
  ],
  open: [
    'How might we design for the post-exam emotional journey — candidates who pass AND candidates who don\'t?',
    'Can we build study group features without replicating the noise of generic forums?',
    'What does the right AI tutor escalation path look like when AI can\'t confidently answer?',
    'How do we design for candidates re-sitting after a failure without making them feel judged by the product?',
  ],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityBadge({ level }) {
  return (
    <span className={`me-severity me-severity--${level.toLowerCase()}`}>{level}</span>
  )
}

function PriorityBadge({ label }) {
  const cls = label.startsWith('P0') ? 'p0' : label.startsWith('P1') ? 'p1' : 'p2'
  return <span className={`me-priority me-priority--${cls}`}>{label}</span>
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyExamlyCaseStudy() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.me-reveal').forEach(el => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' } }
        )
      })
      gsap.utils.toArray('.me-reveal-stagger').forEach(parent => {
        gsap.fromTo(Array.from(parent.children),
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: parent, start: 'top 90%' } }
        )
      })

      // KPI counters
      ;[
        { id: '#me-cnt-pass',     to: 94,  suffix: '%' },
        { id: '#me-cnt-learners', to: 3,   suffix: 'M+' },
        { id: '#me-cnt-coverage', to: 30,  suffix: '%' },
        { id: '#me-cnt-cost',     to: 40,  suffix: '%' },
      ].forEach(({ id, to, suffix }) => {
        const el = document.querySelector(id)
        if (!el) return
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: to, duration: 2.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate() { el.textContent = Math.round(proxy.val) + suffix },
        })
      })

      // Metric bar fills
      gsap.utils.toArray('.me-metric-fill').forEach(bar => {
        const pct = bar.dataset.pct
        gsap.fromTo(bar,
          { width: '0%' },
          { width: pct + '%', duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 92%' } }
        )
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <motion.div
      ref={pageRef}
      className="me-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <button className="me-back-btn" onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Back
      </button>

      {/* ══ COVER ══════════════════════════════════════════════════════════════ */}
      <header className="me-cover">
        <div className="me-cover-bg" aria-hidden="true" />
        <div className="me-cover-certs" aria-hidden="true">
          <div className="me-cert me-cert--cpa">CPA</div>
          <div className="me-cert me-cert--cma">CMA</div>
          <div className="me-cert me-cert--ea">EA</div>
        </div>

        <div className="me-cover-inner container">
          <div className="me-cover-meta">
            <span className="me-eyebrow">Case Study</span>
            <span className="me-cover-type">B2C + B2B2C · EdTech SaaS</span>
            <span className="me-cover-year">2024</span>
          </div>

          <h1 className="me-cover-title">
            MyExamly<span className="me-cover-dot">.</span>
          </h1>

          <p className="me-cover-subtitle">
            Reimagining CPA/CMA Exam Prep Through Personalization
          </p>
          <p className="me-cover-sub2">
            A product design case study on reducing study anxiety, improving pass rates, and building an AI-powered adaptive learning experience.
          </p>

          <div className="me-cover-kpis">
            <div className="me-cover-kpi">
              <span id="me-cnt-pass" className="me-kpi-value">94%</span>
              <span className="me-kpi-label">First-attempt pass rate</span>
            </div>
            <div className="me-cover-kpi-divider" />
            <div className="me-cover-kpi">
              <span id="me-cnt-learners" className="me-kpi-value">3M+</span>
              <span className="me-kpi-label">Active learners</span>
            </div>
            <div className="me-cover-kpi-divider" />
            <div className="me-cover-kpi">
              <span id="me-cnt-coverage" className="me-kpi-value">30%</span>
              <span className="me-kpi-label">Faster syllabus coverage vs. self-study</span>
            </div>
            <div className="me-cover-kpi-divider" />
            <div className="me-cover-kpi">
              <span id="me-cnt-cost" className="me-kpi-value">40%</span>
              <span className="me-kpi-label">Lower price than Becker / UWorld</span>
            </div>
          </div>
        </div>

        <div className="me-scroll-hint">
          <div className="me-scroll-mouse"><div className="me-scroll-wheel" /></div>
          <span>Scroll</span>
        </div>
      </header>

      <div className="container me-content">

        {/* ══ EXECUTIVE SUMMARY ══════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">01</span>
            <span className="me-eyebrow">Executive Summary</span>
          </div>

          <div className="me-exec-grid me-reveal-stagger">
            <div className="me-exec-card me-exec-card--problem">
              <span className="me-exec-tag">Problem</span>
              <p className="me-exec-body">
                Candidates preparing for CPA/CMA exams were burning out due to unstructured self-study,
                content overload, and zero feedback loops.
              </p>
            </div>
            <div className="me-exec-card me-exec-card--solution">
              <span className="me-exec-tag">Solution</span>
              <p className="me-exec-body">
                MyExamly delivers an AI-personalized study engine that adapts to each learner's pace, gaps,
                and exam date — reducing prep time and increasing first-attempt pass rates.
              </p>
            </div>
          </div>

          <div className="me-outcome-banner me-reveal">
            <span className="me-outcome-icon">🏆</span>
            <p className="me-outcome-text">
              <strong>94% first-attempt pass rate</strong> across program completers, with{' '}
              <strong>30% faster syllabus coverage</strong> vs. self-study.
            </p>
          </div>
        </section>

        {/* ══ DISCOVERY ══════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">02</span>
            <span className="me-eyebrow">Discovery Phase</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Five research methods. <span className="me-amber">404 people.</span>{' '}
            One shared breakdown point.
          </h2>

          <p className="me-body me-reveal">
            We ran a multi-method research program to understand how candidates actually prepare for
            CPA/CMA exams — not how they think they should. Interviews, contextual observation, surveys,
            competitive teardowns, and diary studies across 5 weeks revealed a consistent pattern: the
            tools weren't the problem. The system was.
          </p>

          <div className="me-research-grid me-reveal-stagger">
            {RESEARCH_METHODS.map(r => (
              <div className="me-research-card" key={r.num}>
                <div className="me-research-header">
                  <span className="me-research-num">{r.num}</span>
                  <div className="me-research-n">
                    <span className="me-n-val">{r.n}</span>
                    <span className="me-n-label">{r.label}</span>
                  </div>
                </div>
                <h3 className="me-research-method">{r.method}</h3>
                <p className="me-research-profile">{r.format}</p>
                <ul className="me-research-findings">
                  {r.findings.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SYNTHESIS ══════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">03</span>
            <span className="me-eyebrow">Synthesis & Insights</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Five themes. Five jobs to be done. Five insights that shaped every <span className="me-amber">product decision</span>.
          </h2>

          {/* Affinity themes */}
          <h3 className="me-sub-heading me-reveal">Affinity Map Themes</h3>
          <div className="me-affinity-grid me-reveal-stagger">
            {AFFINITY_THEMES.map(a => (
              <div className="me-affinity-card" key={a.theme}>
                <span className="me-affinity-icon">{a.icon}</span>
                <h4 className="me-affinity-theme">{a.theme}</h4>
                <p className="me-affinity-desc">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* JTBD */}
          <h3 className="me-sub-heading me-reveal" style={{ marginTop: '3.5rem' }}>Jobs To Be Done</h3>
          <div className="me-jtbd-list me-reveal-stagger">
            {JTBDS.map((j, i) => (
              <div className="me-jtbd" key={i}>
                <div className="me-jtbd-quote">"{j.job}"</div>
                <div className="me-jtbd-meta">
                  <span className="me-jtbd-freq">{j.frequency}</span>
                  <span className="me-jtbd-driver">{j.driver}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Key Insights */}
          <h3 className="me-sub-heading me-reveal" style={{ marginTop: '3.5rem' }}>Key Insights</h3>
          <div className="me-insights me-reveal-stagger">
            {KEY_INSIGHTS.map(ins => (
              <div className="me-insight" key={ins.id}>
                <span className="me-insight-id">{ins.id}</span>
                <div>
                  <h4 className="me-insight-title">{ins.insight}</h4>
                  <p className="me-insight-evidence"><em>Evidence:</em> {ins.evidence}</p>
                  <p className="me-insight-implication"><em>Design implication:</em> {ins.implication}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ PERSONAS ═══════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">04</span>
            <span className="me-eyebrow">Personas</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Three people. One <span className="me-amber">shared frustration</span>. Completely different contexts.
          </h2>

          <div className="me-personas me-reveal-stagger">
            {PERSONAS.map(p => (
              <div className="me-persona" key={p.id} style={{ '--p-color': p.color }}>
                <div className="me-persona-top">
                  <div>
                    <div className="me-persona-id">{p.id}</div>
                    <h3 className="me-persona-name" style={{ color: p.color }}>{p.name}</h3>
                    <div className="me-persona-tag">"{p.tag}"</div>
                  </div>
                </div>

                <blockquote className="me-persona-quote">"{p.quote}"</blockquote>

                <div className="me-persona-meta">
                  <div className="me-pmeta-row"><span className="me-pmeta-k">Age</span><span>{p.age}</span></div>
                  <div className="me-pmeta-row"><span className="me-pmeta-k">Role</span><span>{p.role}</span></div>
                  <div className="me-pmeta-row"><span className="me-pmeta-k">Location</span><span>{p.location}</span></div>
                  <div className="me-pmeta-row"><span className="me-pmeta-k">Exam Target</span><span>{p.exam}</span></div>
                </div>

                <div className="me-persona-section">
                  <div className="me-ps-label" style={{ color: p.color }}>Goals</div>
                  <ul className="me-ps-list">{p.goals.map(g => <li key={g}>{g}</li>)}</ul>
                </div>
                <div className="me-persona-section">
                  <div className="me-ps-label">Frustrations</div>
                  <ul className="me-ps-list me-ps-list--red">{p.frustrations.map(f => <li key={f}>{f}</li>)}</ul>
                </div>
                <div className="me-persona-section">
                  <div className="me-ps-label">Behaviors</div>
                  <ul className="me-ps-list">{p.behaviors.map(b => <li key={b}>{b}</li>)}</ul>
                </div>

                <div className="me-persona-state">{p.state}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ PROBLEM FRAMING ════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">05</span>
            <span className="me-eyebrow">Problem Framing</span>
          </div>

          <h2 className="me-section-title me-reveal">
            How Might We + five <span className="me-amber">design principles</span> that governed every decision.
          </h2>

          <h3 className="me-sub-heading me-reveal">How Might We</h3>
          <div className="me-hmw-list me-reveal-stagger">
            {HMW.map((h, i) => (
              <div className="me-hmw" key={i}>
                <span className="me-hmw-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{h}</p>
              </div>
            ))}
          </div>

          <h3 className="me-sub-heading me-reveal" style={{ marginTop: '3.5rem' }}>Design Principles</h3>
          <div className="me-principles me-reveal-stagger">
            {DESIGN_PRINCIPLES.map(dp => (
              <div className="me-principle" key={dp.principle}>
                <h4 className="me-principle-title">{dp.principle}</h4>
                <p className="me-principle-rationale">{dp.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ IDEATION & PRIORITIZATION ══════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">06</span>
            <span className="me-eyebrow">Ideation & Prioritization</span>
          </div>

          <h2 className="me-section-title me-reveal">
            8 features. 3 priority tiers. Every decision tied to a <span className="me-amber">user problem</span>.
          </h2>

          <p className="me-body me-reveal">
            After Crazy 8s sketching, HMW brainstorming, and JTBD story mapping, we ran an Impact vs. Effort
            matrix to prioritize. Three P0 features define the core differentiator — everything else ladders to them.
          </p>

          <div className="me-feature-table me-reveal">
            <div className="me-ft-header">
              <div>Feature</div>
              <div>Problem Addressed</div>
              <div>Priority</div>
              <div>Impact / Effort</div>
            </div>
            {FEATURES.map(f => (
              <div className="me-ft-row" key={f.feature}>
                <div className="me-ft-feature">{f.feature}</div>
                <div className="me-ft-problem">{f.problem}</div>
                <div><PriorityBadge label={f.priority} /></div>
                <div className="me-ft-ie">
                  <span className={`me-impact me-impact--${f.impact.toLowerCase().replace(/[^a-z]/g, '-')}`}>{f.impact}</span>
                  <span className="me-effort">{f.effort}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ UX DESIGN PROCESS ══════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">07</span>
            <span className="me-eyebrow">UX Design Process</span>
          </div>

          <h2 className="me-section-title me-reveal">
            From sketches to a 42-screen prototype — with <span className="me-amber">4 critical UX decisions</span> that changed the product.
          </h2>

          <div className="me-phases me-reveal-stagger">
            {DESIGN_PHASES.map((ph, i) => (
              <div className="me-phase-card" key={ph.phase}>
                <div className="me-phase-num">0{i + 1}</div>
                <h3 className="me-phase-name">{ph.phase}</h3>
                <p className="me-phase-output">{ph.output}</p>
                {ph.tested
                  ? <div className="me-phase-tested">Tested · {ph.test}</div>
                  : <div className="me-phase-untested">Not user-tested</div>
                }
              </div>
            ))}
          </div>

          <h3 className="me-sub-heading me-reveal" style={{ marginTop: '3.5rem' }}>Critical UX Decisions</h3>
          <div className="me-decisions me-reveal-stagger">
            {CRITICAL_DECISIONS.map((d, i) => (
              <div className="me-decision" key={i}>
                <div className="me-decision-num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h4 className="me-decision-title">"{d.decision}"</h4>
                  <p className="me-decision-rationale">{d.rationale}</p>
                  <div className="me-decision-dropped">
                    <span className="me-dropped-label">Alternative dropped →</span> {d.dropped}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ USABILITY TESTING ══════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">08</span>
            <span className="me-eyebrow">Usability Testing</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Two rounds. SUS score from <span className="me-amber">61 → 79</span>.{' '}
            Every major finding shipped as a fix.
          </h2>

          {/* SUS visual */}
          <div className="me-sus-visual me-reveal">
            <div className="me-sus-track">
              <div className="me-sus-bar" style={{ left: `${(61 / 100) * 100}%` }}>
                <span className="me-sus-label">Round 1<br/><strong>61</strong></span>
              </div>
              <div className="me-sus-bar me-sus-bar--r2" style={{ left: `${(79 / 100) * 100}%` }}>
                <span className="me-sus-label">Round 2<br/><strong>79</strong></span>
              </div>
              <div className="me-sus-avg" style={{ left: '68%' }}>
                <span>Industry avg 68</span>
              </div>
            </div>
            <div className="me-sus-scale">
              <span>0</span>
              <span>25</span>
              <span>50 — Poor</span>
              <span>68 — Avg</span>
              <span>75 — Good</span>
              <span>100</span>
            </div>
          </div>

          <div className="me-ut-rounds me-reveal-stagger">
            {USABILITY_ROUNDS.map(r => (
              <div className="me-ut-round" key={r.round}>
                <div className="me-ut-round-header">
                  <div>
                    <span className="me-ut-round-num">Round {r.round}</span>
                    <span className="me-ut-fidelity">{r.fidelity}</span>
                  </div>
                  <div className="me-ut-meta">
                    <span>{r.participants} participants</span>
                    <span>{r.method}</span>
                  </div>
                </div>
                <div className="me-ut-findings">
                  {r.findings.map((f, i) => (
                    <div className="me-ut-finding" key={i}>
                      <div className="me-ut-finding-top">
                        <SeverityBadge level={f.severity} />
                        <p className="me-ut-finding-text">{f.finding}</p>
                      </div>
                      <div className="me-ut-fix">
                        <span className="me-fix-label">Fix →</span> {f.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ METRICS FRAMEWORK ══════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">09</span>
            <span className="me-eyebrow">Product Metrics Framework</span>
          </div>

          <h2 className="me-section-title me-reveal">
            North star: <span className="me-amber">Candidate exam pass rate</span>.
            Everything else is an input.
          </h2>

          <div className="me-north-star me-reveal">
            <div className="me-ns-icon">⭐</div>
            <div>
              <div className="me-ns-label">North Star Metric</div>
              <div className="me-ns-value">Candidate Exam Pass Rate (first attempt)</div>
              <p className="me-ns-why">Everything else — engagement, completion, AI usage — is only valuable if it leads to a candidate passing their exam. Pass rate is the true outcome.</p>
            </div>
          </div>

          <h3 className="me-sub-heading me-reveal" style={{ marginTop: '2.5rem' }}>Input Metrics</h3>
          <div className="me-metrics me-reveal-stagger">
            {INPUT_METRICS.map(m => (
              <div className="me-metric" key={m.metric}>
                <div className="me-metric-header">
                  <span className="me-metric-name">{m.metric}</span>
                  <div className="me-metric-vals">
                    <span className="me-metric-current">{m.current}{m.suffix}</span>
                    <span className="me-metric-target">target {m.target}{m.suffix}</span>
                  </div>
                </div>
                <p className="me-metric-desc">{m.desc}</p>
                <div className="me-metric-track">
                  <div
                    className="me-metric-fill"
                    data-pct={m.current}
                    style={{ backgroundColor: m.current >= m.target ? '#22c55e' : '#f59e0b' }}
                  />
                  <div className="me-metric-target-line" style={{ left: `${m.target}%` }} />
                </div>
                <div className="me-metric-scale">
                  <span>0%</span>
                  <span>Target {m.target}%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ OUTCOMES ═══════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">10</span>
            <span className="me-eyebrow">Outcomes & Impact</span>
          </div>

          <h2 className="me-section-title me-reveal">
            94% pass rate. 3M+ learners. 40% cheaper than Becker.{' '}
            <span className="me-amber">That's the product working.</span>
          </h2>

          <div className="me-impact-grid me-reveal-stagger">
            <div className="me-impact-card me-impact-card--primary">
              <span className="me-impact-num">94%</span>
              <span className="me-impact-label">First-attempt pass rate</span>
              <p className="me-impact-desc">Vs. industry average of 45–55% for CPA first attempts globally.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">3M+</span>
              <span className="me-impact-label">Active learners</span>
              <p className="me-impact-desc">Across CPA, CMA, and EA certification programs.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">30%</span>
              <span className="me-impact-label">Faster syllabus coverage</span>
              <p className="me-impact-desc">vs. unstructured self-study for AI Scheduler users.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">20%</span>
              <span className="me-impact-label">Higher mock scores</span>
              <p className="me-impact-desc">For students completing ≥3 full simulation sessions.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">4.6×</span>
              <span className="me-impact-label">AI tutor usage spike</span>
              <p className="me-impact-desc">After moving from separate page to floating persistent widget.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">79</span>
              <span className="me-impact-label">SUS score (Round 2)</span>
              <p className="me-impact-desc">Up from 61 in Round 1 · "Good" category · Industry avg: 68.</p>
            </div>
          </div>

          <h3 className="me-sub-heading me-reveal" style={{ marginTop: '3.5rem' }}>In Their Words</h3>
          <div className="me-quotes me-reveal-stagger">
            {QUOTES.map((q, i) => (
              <div className="me-quote-card" key={i}>
                <div className="me-quote-mark">"</div>
                <p className="me-quote-text">{q.quote}</p>
                <div className="me-quote-footer">
                  <span className="me-quote-persona">{q.persona}</span>
                  <span className="me-quote-outcome">{q.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ RETROSPECTIVE ══════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">11</span>
            <span className="me-eyebrow">Retrospective</span>
          </div>

          <h2 className="me-section-title me-reveal">
            What worked, what we'd <span className="me-amber">do differently</span>, and what's still open.
          </h2>

          <div className="me-retro-grid me-reveal-stagger">
            <div className="me-retro-col me-retro-col--worked">
              <h3 className="me-retro-heading">
                <span>✓</span> What Worked
              </h3>
              <ul className="me-retro-list">
                {RETRO.worked.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div className="me-retro-col me-retro-col--change">
              <h3 className="me-retro-heading">
                <span>↩</span> What We'd Do Differently
              </h3>
              <ul className="me-retro-list">
                {RETRO.change.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div className="me-retro-col me-retro-col--open">
              <h3 className="me-retro-heading">
                <span>?</span> Open Questions
              </h3>
              <ul className="me-retro-list">
                {RETRO.open.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ CTA ════════════════════════════════════════════════════════════ */}
        <section className="me-cta-section me-reveal">
          <div className="me-cta-glow" aria-hidden="true" />
          <span className="me-eyebrow">Next</span>
          <h2 className="me-cta-title">Want to talk about what I built — or what we could build together?</h2>
          <div className="me-cta-actions">
            <a href="mailto:hashtaginflu@gmail.com" className="me-btn me-btn--primary">Get in Touch</a>
            <button className="me-btn me-btn--ghost" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
