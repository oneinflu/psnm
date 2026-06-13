import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './MyExamlyCaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────────────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    icon: '🎓',
    role: 'Aspiring CPA / CMA Candidate',
    name: 'Recent Graduate',
    pain: 'Overwhelmed by 3,000+ hours of self-study with no adaptive guidance or early warning system.',
    need: 'A study plan that tells me what to do next and shows me if I\'m on track to pass.',
  },
  {
    icon: '💼',
    role: 'Working Professional',
    name: 'Finance Pro Upskilling',
    pain: 'Studying between 6–9 PM with no flexibility. Generic courses ignore my existing knowledge.',
    need: 'Adaptive pacing that respects my schedule and skips content I already know.',
  },
  {
    icon: '🏫',
    role: 'Education Institution',
    name: 'Coaching Institute Admin',
    pain: 'Can\'t identify at-risk students until exam results arrive. Intervention always comes too late.',
    need: 'Real-time dashboards that show which students are falling behind before it\'s too late.',
  },
  {
    icon: '🌍',
    role: 'Global Learner',
    name: 'International Student',
    pain: 'US certification prep content is expensive and calibrated for US test-takers only.',
    need: 'Affordable, high-quality prep with 24/7 AI tutor support across time zones.',
  },
]

const FEATURES = [
  {
    num: '01',
    title: 'Adaptive Learning Paths',
    desc: 'AI-driven study schedule that recalculates daily based on exam date, weak topic scores, and session performance. Students can\'t skip their weakest areas — the system force-allocates time based on data.',
    badge: 'AI Core',
  },
  {
    num: '02',
    title: 'Practice QBank',
    desc: '2,500+ MCQs and Task-Based Simulations (TBS) calibrated to exam-level difficulty. Adaptive difficulty engine ensures every session challenges the student at the right level.',
    badge: 'Assessment',
  },
  {
    num: '03',
    title: 'Video Lectures',
    desc: 'Full-syllabus video library with concept-level bookmarking, playback speed control, and auto-linked practice questions after each concept module.',
    badge: 'Content',
  },
  {
    num: '04',
    title: 'Live Classes',
    desc: 'Weekly live sessions with expert instructors via Zoom/Jitsi. Doubt resolution, mock exam walkthroughs, and office hours built into the study schedule.',
    badge: 'Live',
  },
  {
    num: '05',
    title: 'Progress Analytics',
    desc: 'Session-by-session readiness score updated after every practice session. Topic-level heatmap shows strong vs. weak areas. Educator dashboard surfaces at-risk students via behavioral signals.',
    badge: 'Analytics',
  },
  {
    num: '06',
    title: 'AI Tutor',
    desc: '24/7 domain-specific AI tutor for CPA, CMA, and EA concepts. Explains wrong answers, generates additional practice on demand, and surfaces related concepts the student may have missed.',
    badge: 'AI',
  },
  {
    num: '07',
    title: 'Offline Access',
    desc: 'Full study plan and content available offline on mobile. Progress syncs automatically when connectivity resumes — designed for students in low-connectivity environments.',
    badge: 'Mobile',
  },
  {
    num: '08',
    title: 'Support & Community',
    desc: 'Peer study groups, instructor Q&A forums, and Intercom-powered live chat. Community-driven flashcard sharing and mock exam co-study sessions.',
    badge: 'Community',
  },
]

const COMPARISON = [
  { feature: 'MCQ Count',             becker: '8,000+',     uworld: '9,000+',     examly: '2,500+ (growing)' },
  { feature: 'Task-Based Sims',       becker: '400+ TBS',   uworld: '500+ TBS',   examly: 'Full TBS + Essays' },
  { feature: 'Price (CPA Essential)', becker: '$3,099',      uworld: '~$3,499',    examly: '~$1,599' },
  { feature: 'AI Adaptive Schedule',  becker: 'Adapt2U',    uworld: 'SmartPath',  examly: 'AI Scheduler' },
  { feature: 'AI Tutor / Chat',       becker: 'Newt AI',    uworld: 'UAsk',       examly: '24/7 AI Tutor' },
  { feature: 'Mobile & Offline',      becker: 'Limited',    uworld: 'Limited',    examly: 'Full Offline' },
  { feature: 'Institution Dashboard', becker: '✗',          uworld: '✗',          examly: '✓ Admin Portal' },
  { feature: 'Live Weekly Classes',   becker: 'Paid Add-on', uworld: '✗',         examly: '✓ Included' },
]

const AI_COMPONENTS = [
  {
    icon: '🗓',
    title: 'Personalized Scheduler',
    desc: 'ML-based study plan that recalculates daily. Inputs: exam date, diagnostic score, historical session length, and weak-topic map. Forces minimum time allocation to lowest-scoring subjects.',
  },
  {
    icon: '🤖',
    title: 'AI Tutor Chat',
    desc: 'Domain-specific LLM fine-tuned on CPA, CMA, and EA exam content. Explains wrong answers in-context, generates practice variations on demand, and cross-links related concepts.',
  },
  {
    icon: '📊',
    title: 'Analytics AI',
    desc: 'Behavioral signal processor that tracks session length, skip rates, and score trends. Surfaces at-risk students to educators before self-reported struggle — 22% retention lift.',
  },
  {
    icon: '⚖️',
    title: 'Difficulty Analyzer',
    desc: 'Adaptive question selection engine that prioritizes underperforming topics and adjusts question difficulty based on recent session performance — keeps students in the productive struggle zone.',
  },
]

const STACK = [
  { layer: 'Frontend',    tech: 'React + Vite',         note: 'SPA with offline PWA support' },
  { layer: 'Backend',     tech: 'Node.js / Express API', note: 'REST API, modular service design' },
  { layer: 'Database',    tech: 'PostgreSQL',            note: 'Relational data model for users, assessments, progress' },
  { layer: 'Video',       tech: 'Cloud Storage (CDN)',   note: 'HLS streaming, adaptive bitrate' },
  { layer: 'Auth',        tech: 'JWT / OAuth 2.0',       note: 'SSO + institutional auth support' },
  { layer: 'Payments',    tech: 'Stripe / PayPal',       note: 'Subscriptions + one-time purchases' },
  { layer: 'Live Class',  tech: 'Zoom / Jitsi SDK',      note: 'Embedded in-platform live sessions' },
  { layer: 'Email / SMS', tech: 'SendGrid / Twilio',     note: 'Transactional alerts + study reminders' },
  { layer: 'Proctoring',  tech: 'Examity API',           note: 'Remote proctoring for mock exams' },
  { layer: 'Analytics',   tech: 'Mixpanel / GA',         note: 'Product analytics + funnel tracking' },
]

const ROADMAP = [
  {
    phase: 'MVP',
    timeline: 'Q1 2023',
    status: 'done',
    milestones: ['Adaptive Study Scheduler', 'Core QBank (500 MCQs)', 'Basic Analytics Dashboard', 'Video Lectures (CPA FAR)'],
  },
  {
    phase: 'Beta',
    timeline: 'Q2 2023',
    status: 'done',
    milestones: ['Live Class Integration (Zoom)', 'Offline Mobile App', 'Community Forum', 'Full CPA QBank (2,500+ MCQs)'],
  },
  {
    phase: 'Launch',
    timeline: 'Q3 2023',
    status: 'done',
    milestones: ['Full Catalog: CPA, CMA, EA', 'Exam Simulation Module (TBS)', 'AI Tutor v1', 'Institutional Admin Dashboard'],
  },
  {
    phase: 'Growth',
    timeline: '2024',
    status: 'done',
    milestones: ['Institution Partnerships', 'Enhanced Predictive Analytics', 'New Certifications: CIA, CPE', 'Stripe Subscription Billing'],
  },
  {
    phase: 'Future',
    timeline: '2025+',
    status: 'planned',
    milestones: ['Gamified Learning Paths', 'VR/AR Exam Simulations', 'Enterprise LMS Integrations (SCORM/xAPI)', 'Expanded Global Markets'],
  },
]

const LESSONS = [
  {
    num: '01',
    title: 'AI scheduling that forces weak-topic exposure adds measurable value.',
    body: 'Students in trials who used the AI Scheduler saw 40% faster syllabus completion vs. self-directed study. The key: the system made weak-topic sessions non-skippable. Motivation wasn\'t the problem — the tool was.',
  },
  {
    num: '02',
    title: 'Realistic exam simulation is the most trusted feature.',
    body: 'When the mock exam matched the real AICPA interface precisely — same timer, same TBS format, same difficulty curve — students\' confidence before their real attempt increased 30%. Fidelity wasn\'t polish. It was the product.',
  },
  {
    num: '03',
    title: 'Keep the UX focused on three jobs: study, practice, and know where you stand.',
    body: 'We cut 6 planned features after user testing showed students only needed the Learning Path, QBank, and Readiness Score to complete their core loop. Every feature beyond those three reduced engagement.',
  },
  {
    num: '04',
    title: 'Affordability is a moat in high-stakes markets.',
    body: 'Pricing 40% below Becker and UWorld attracted a segment that wasn\'t previously served — emerging-market students and career-changers who couldn\'t justify $3,000+ on one exam attempt. This wasn\'t a margin sacrifice; it was a market expansion.',
  },
  {
    num: '05',
    title: 'Educator dashboards retained students better than student-facing features.',
    body: 'The at-risk alert system for institutions drove 22% higher retention. When an instructor reached out proactively based on a behavioral signal, students felt seen and stayed. The B2B2C loop — institution adopts, student benefits — was the most underrated part of the product strategy.',
  },
]

const FLOW_SLIDES = [
  {
    title: 'Student Onboarding & Study Path',
    desc: 'Sign-up → diagnostic assessment → AI generates personalized study path → daily schedule active. 10-step flow with institution code entry, goal setting, and exam date input.',
    hint: 'Onboarding → Diagnostic → AI Scheduler → Dashboard',
    dims: '2400 × 900 · Figma Export',
  },
  {
    title: 'Exam Simulation Engine',
    desc: 'Select exam section → enter simulation → timer-locked MCQ + TBS → auto-graded on submit → detailed score report with weak-area breakdown.',
    hint: 'Simulation → Timer → Auto-Grade → Score Report',
    dims: '2400 × 900 · Figma Export',
  },
  {
    title: 'AI Tutor Interaction',
    desc: 'Student flags a wrong answer → AI Tutor explains concept → generates 3 practice variations → links related topic → updates weak-area map.',
    hint: 'Wrong Answer → AI Explain → Practice Variations → Map Update',
    dims: '1800 × 900 · Figma Export',
  },
  {
    title: 'Grading & Feedback Loop',
    desc: 'Answer submission → server-side grading → performance delta computed → readiness score updated → study path recalculated for next session.',
    hint: 'Submit → Grade → Delta → Readiness Score → Plan Update',
    dims: '2000 × 900 · Figma Export',
  },
  {
    title: 'Admin Content Management',
    desc: 'Institution admin → upload question bank → tag by topic + difficulty → publish to student cohort → monitor cohort performance in real time.',
    hint: 'Admin → Upload → Tag → Publish → Monitor',
    dims: '2400 × 1200 · Figma Export',
  },
]

const SCREEN_SLIDES = [
  {
    title: 'Dashboard & Study Path',
    desc: 'Daily agenda, readiness score ring, and topic heatmap. The dashboard is the first screen every session — it orients the student immediately.',
    hint: 'Study Plan · Readiness Ring · Topic Heatmap · Session Timer',
    dims: '1440 × 900 · Desktop',
  },
  {
    title: 'Practice QBank View',
    desc: 'Adaptive MCQ interface with confidence scoring, flag-for-review, and side-panel AI Tutor. Mimics the AICPA interface layout for exam-day familiarity.',
    hint: 'MCQ Interface · Confidence Slider · Flag · AI Side Panel',
    dims: '1440 × 900 · Desktop',
  },
  {
    title: 'Exam Simulation Interface',
    desc: 'Full-fidelity mock exam: timer locked, TBS active, no hints. Score report generates immediately post-submission with topic-level breakdown.',
    hint: 'Full-Fidelity Mock · Timer · TBS · Instant Score Report',
    dims: '1440 × 900 · Desktop',
  },
  {
    title: 'Progress Analytics & Heatmap',
    desc: 'Line chart of readiness score over time, topic heatmap by performance decile, and session-length trend. Available to students and institution admins.',
    hint: 'Readiness Trend · Topic Heatmap · Session Trends · Admin View',
    dims: '1440 × 900 · Desktop',
  },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function ImgPlaceholder({ title, hint, ratio = '16/9', dims = '' }) {
  return (
    <div className="gr-img-placeholder" style={{ aspectRatio: ratio }}>
      <div className="gr-placeholder-grid" aria-hidden="true" />
      <div className="gr-placeholder-content">
        <svg className="gr-placeholder-icon" width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="2" y="6" width="32" height="24" rx="3" stroke="rgba(56,189,248,0.35)" strokeWidth="1.5"/>
          <circle cx="11" cy="15" r="3" stroke="rgba(56,189,248,0.35)" strokeWidth="1.5"/>
          <path d="M2 26l8-7 5 5 5-5 8 6" stroke="rgba(56,189,248,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="gr-placeholder-title">{title}</span>
        {hint && <span className="gr-placeholder-hint">{hint}</span>}
      </div>
      {dims && <span className="gr-placeholder-dims">{dims}</span>}
    </div>
  )
}

function Carousel({ slides }) {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <div className="gr-carousel">
      <div className="gr-carousel-viewport">
        <div
          className="gr-carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="gr-carousel-slide" key={i}>
              {slide.img ? (
                <div className="gr-carousel-img-wrap">
                  <img src={slide.img} alt={slide.title} className="gr-carousel-img" />
                </div>
              ) : (
                <ImgPlaceholder
                  title={slide.title}
                  hint={slide.hint}
                  ratio={slide.ratio || '16/9'}
                  dims={slide.dims}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="gr-carousel-controls">
        <button className="gr-carousel-btn" onClick={prev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="gr-carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`gr-carousel-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="gr-carousel-btn" onClick={next} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="gr-carousel-counter">{current + 1} / {slides.length}</span>
      </div>

      <div className="gr-carousel-caption">
        <span className="gr-carousel-cap-num">{String(current + 1).padStart(2, '0')}</span>
        <div>
          <div className="gr-carousel-cap-title">{slides[current].title}</div>
          {slides[current].desc && (
            <div className="gr-carousel-cap-desc">{slides[current].desc}</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyExamlyCaseStudy() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-reveal
      gsap.utils.toArray('.me-reveal').forEach(el => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })
      gsap.utils.toArray('.me-reveal-stagger').forEach(parent => {
        gsap.fromTo(parent.children,
          { y: 32, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: parent, start: 'top 88%' },
          }
        )
      })

      // Counter animations
      const counters = [
        { id: '#me-cnt-pass',      to: 94,  suffix: '%' },
        { id: '#me-cnt-students',  to: 3,   suffix: 'M+' },
        { id: '#me-cnt-questions', to: 2,   suffix: 'M+' },
        { id: '#me-cnt-savings',   to: 40,  suffix: '%' },
      ]
      counters.forEach(({ id, to, suffix }) => {
        const el = document.querySelector(id)
        if (!el) return
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: to,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate() { el.textContent = Math.round(proxy.val) + suffix },
        })
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
      {/* ── Back button ──────────────────────────────────────── */}
      <button className="me-back-btn" onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Back
      </button>

      {/* ════════════════════════════════════════════════════════
          COVER
      ════════════════════════════════════════════════════════ */}
      <header className="me-cover">
        <div className="me-cover-bg" aria-hidden="true" />

        {/* Floating cert badges */}
        <div className="me-cover-certs" aria-hidden="true">
          <div className="me-cert me-cert--cpa">CPA</div>
          <div className="me-cert me-cert--cma">CMA</div>
          <div className="me-cert me-cert--ea">EA</div>
        </div>

        <div className="me-cover-inner container">
          <div className="me-cover-meta">
            <span className="me-eyebrow">Case Study</span>
            <span className="me-cover-timeline">2021 – 2023</span>
          </div>

          <h1 className="me-cover-title">MyExamly<span className="me-cover-dot">.</span></h1>

          <p className="me-cover-subtitle">
            AI-Powered Certification Exam Prep Platform<br />
            <span className="me-cover-subtitle-dim">CPA · CMA · EA — Built for the 94% pass rate.</span>
          </p>

          <div className="me-cover-chips">
            {['EdTech', 'AI / ML', 'Adaptive Learning', 'CPA Prep', 'Assessment Engine', 'Web + Mobile'].map(t => (
              <span key={t} className="me-chip">{t}</span>
            ))}
          </div>

          <div className="me-cover-kpis">
            <div className="me-cover-kpi">
              <span id="me-cnt-pass" className="me-kpi-value">94%</span>
              <span className="me-kpi-label">First-attempt pass rate</span>
            </div>
            <div className="me-cover-kpi-divider" />
            <div className="me-cover-kpi">
              <span id="me-cnt-students" className="me-kpi-value">3M+</span>
              <span className="me-kpi-label">Active learners</span>
            </div>
            <div className="me-cover-kpi-divider" />
            <div className="me-cover-kpi">
              <span id="me-cnt-questions" className="me-kpi-value">2M+</span>
              <span className="me-kpi-label">Questions answered</span>
            </div>
            <div className="me-cover-kpi-divider" />
            <div className="me-cover-kpi">
              <span id="me-cnt-savings" className="me-kpi-value">40%</span>
              <span className="me-kpi-label">Below Becker / UWorld pricing</span>
            </div>
          </div>
        </div>

        <div className="me-scroll-hint">
          <div className="me-scroll-mouse"><div className="me-scroll-wheel" /></div>
          <span>Scroll</span>
        </div>
      </header>

      <div className="container me-content">

        {/* ════════════════════════════════════════════════════════
            CH01 — THE PROBLEM
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">01</span>
            <span className="me-eyebrow">The Problem</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Professional certification students were studying hard but failing at{' '}
            <span className="me-amber">predictable rates</span> — and no one could see it coming.
          </h2>

          <p className="me-body me-reveal">
            CPA, CMA, and EA candidates were self-studying with generic PDFs, static video courses, and
            no adaptive guidance. Assessment feedback arrived weeks after exams — far too late to change
            outcomes. Students who were on track to fail showed identical surface behavior to students who
            would pass, right up until the last few weeks of study. Coaching institutes had no early warning
            system. The platform existed, but it wasn't working for the people who needed it most.
          </p>

          <div className="me-problem-stats me-reveal-stagger">
            <div className="me-stat-pill">
              <span className="me-stat-val">500K+</span>
              <span className="me-stat-lbl">CPA/CMA candidates annually in India</span>
            </div>
            <div className="me-stat-pill">
              <span className="me-stat-val">45%</span>
              <span className="me-stat-lbl">Average first-attempt pass rate for CPA globally</span>
            </div>
            <div className="me-stat-pill">
              <span className="me-stat-val">₹2L+</span>
              <span className="me-stat-lbl">Average investment per certification attempt</span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH02 — MARKET CONTEXT & COMPETITION
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">02</span>
            <span className="me-eyebrow">Market Context</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Becker and UWorld own the premium tier. The{' '}
            <span className="me-amber">underserved gap</span> is everyone else.
          </h2>

          <p className="me-body me-reveal">
            The US professional exam prep market is dominated by Becker ($3,099 for CPA) and UWorld
            (~$3,499). Both have strong MCQ banks and AI adaptive features. Neither has built for
            institution B2B partnerships, full offline mobile access, or the global learner priced out
            of their tier. MyExamly targets the quality-conscious student who can't — or won't — justify
            $3,000+ on a single exam section.
          </p>

          <div className="me-comparison me-reveal">
            <div className="me-compare-row me-compare-header">
              <div className="me-col-feature">Feature</div>
              <div className="me-col-brand">Becker</div>
              <div className="me-col-brand">UWorld</div>
              <div className="me-col-brand me-col-brand--ours">MyExamly</div>
            </div>
            {COMPARISON.map(row => (
              <div className="me-compare-row" key={row.feature}>
                <div className="me-col-feature">{row.feature}</div>
                <div className="me-col-val">{row.becker}</div>
                <div className="me-col-val">{row.uworld}</div>
                <div className="me-col-val me-col-val--ours">{row.examly}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH03 — RESEARCH
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">03</span>
            <span className="me-eyebrow">Research & Discovery</span>
          </div>

          <h2 className="me-section-title me-reveal">
            8 weeks of diary studies revealed the gap between{' '}
            <span className="me-amber">what students said</span> and what the data showed.
          </h2>

          <p className="me-body me-reveal">
            We ran diary studies with 30 active certification candidates over 8 weeks — tracking daily
            study behavior, self-assessment confidence, and anxiety levels. We analyzed the study
            patterns of students who eventually passed vs. those who failed. The biggest finding: their
            behavioral patterns looked identical until week 6. The platform had no mechanism to distinguish
            them in real time.
          </p>

          <div className="me-methods me-reveal-stagger">
            {['Student Diary Studies (8 weeks)', 'Educator Interviews (15+)', 'Failure Mode Analysis', 'Assessment Analytics Review', 'Study Pattern Comparison: Pass vs. Fail'].map(m => (
              <div key={m} className="me-method-tag">
                <span className="me-method-dot" />
                {m}
              </div>
            ))}
          </div>

          <div className="me-insights me-reveal-stagger">
            <div className="me-insight">
              <span className="me-insight-num">01</span>
              <div>
                <h4 className="me-insight-title">Students systematically avoid their weakest topics — not from laziness, but because it feels bad.</h4>
                <p className="me-insight-body">Students consistently over-studied comfortable subjects and avoided weak ones. This drove the AI scheduler's force-allocation design: minimum weak-topic sessions per day, non-skippable.</p>
              </div>
            </div>
            <div className="me-insight">
              <span className="me-insight-num">02</span>
              <div>
                <h4 className="me-insight-title">"Silent Achievers" — high engagement, high drop rate — were invisible to educators.</h4>
                <p className="me-insight-body">Students with the highest session frequency but declining scores never self-reported. This drove the proactive intervention system: triggered by behavioral signals, not raised hands.</p>
              </div>
            </div>
            <div className="me-insight">
              <span className="me-insight-num">03</span>
              <div>
                <h4 className="me-insight-title">Students trust the platform's readiness score more than their own gut feeling.</h4>
                <p className="me-insight-body">When students could see a real-time readiness percentage, they stayed 40% longer than those who couldn't. The readiness score wasn't a feature — it was the motivational engine.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH04 — PERSONAS
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">04</span>
            <span className="me-eyebrow">Who We Built For</span>
          </div>

          <h2 className="me-section-title me-reveal">Four distinct personas, one shared problem: no <span className="me-amber">adaptive guidance</span>.</h2>

          <div className="me-personas me-reveal-stagger">
            {PERSONAS.map(p => (
              <div className="me-persona" key={p.role}>
                <div className="me-persona-icon">{p.icon}</div>
                <div className="me-persona-role">{p.role}</div>
                <div className="me-persona-name">{p.name}</div>
                <div className="me-persona-divider" />
                <div className="me-persona-pain">
                  <span className="me-persona-label">Pain</span>
                  <p>{p.pain}</p>
                </div>
                <div className="me-persona-need">
                  <span className="me-persona-label me-persona-label--need">Need</span>
                  <p>{p.need}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH05 — USER JOURNEY FLOWS
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">05</span>
            <span className="me-eyebrow">User Journey Flows</span>
          </div>

          <h2 className="me-section-title me-reveal">Five critical flows mapped — from <span className="me-amber">first login</span> to graded result.</h2>

          <p className="me-body me-reveal">
            Each flow was mapped end-to-end, from the student's trigger moment through to outcome.
            The student onboarding flow is 10 steps; the simulation engine is 5. Every flow was
            pressure-tested in prototype sessions before spec was written.
          </p>

          <div className="me-reveal">
            <Carousel slides={FLOW_SLIDES} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH06 — FEATURES
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">06</span>
            <span className="me-eyebrow">Feature Modules</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Eight modules. Every one tied to a <span className="me-amber">student outcome</span>, not a feature list.
          </h2>

          <div className="me-features me-reveal-stagger">
            {FEATURES.map(f => (
              <div className="me-feature" key={f.num}>
                <div className="me-feature-header">
                  <span className="me-feature-num">{f.num}</span>
                  <span className="me-feature-badge">{f.badge}</span>
                </div>
                <h3 className="me-feature-title">{f.title}</h3>
                <p className="me-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH07 — UI / DESIGN
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">07</span>
            <span className="me-eyebrow">Interface Design</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Dashboard, QBank, Simulation, Analytics — designed for the <span className="me-amber">exam-ready mindset</span>.
          </h2>

          <p className="me-body me-reveal">
            Every screen centers one question: "Does this help the student know what to study next,
            and whether they're ready?" The dashboard readiness ring, topic heatmap, and daily agenda
            answer that question in under 5 seconds per session.
          </p>

          <div className="me-reveal">
            <Carousel slides={SCREEN_SLIDES} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH08 — AI COMPONENTS
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">08</span>
            <span className="me-eyebrow">AI Components</span>
          </div>

          <h2 className="me-section-title me-reveal">
            AI that <span className="me-amber">forces good study habits</span> — not just recommends them.
          </h2>

          <p className="me-body me-reveal">
            The platform has four AI components, each targeting a specific failure mode identified in
            research. None of them ask the student to do something differently — they change what the
            system does automatically.
          </p>

          <div className="me-ai-grid me-reveal-stagger">
            {AI_COMPONENTS.map(ai => (
              <div className="me-ai-card" key={ai.title}>
                <span className="me-ai-icon">{ai.icon}</span>
                <h3 className="me-ai-title">{ai.title}</h3>
                <p className="me-ai-desc">{ai.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH09 — ARCHITECTURE
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">09</span>
            <span className="me-eyebrow">Architecture & Stack</span>
          </div>

          <h2 className="me-section-title me-reveal">
            Full-stack platform with <span className="me-amber">10 integrated services</span> — from video CDN to exam proctoring.
          </h2>

          <div className="me-stack me-reveal">
            {STACK.map(s => (
              <div className="me-stack-row" key={s.layer}>
                <span className="me-stack-layer">{s.layer}</span>
                <span className="me-stack-tech">{s.tech}</span>
                <span className="me-stack-note">{s.note}</span>
              </div>
            ))}
          </div>

          <div className="me-arch-placeholder me-reveal">
            <ImgPlaceholder
              title="System Architecture Diagram"
              hint="Frontend → API → DB / Cache / AI / CDN / Auth / Payments / Proctoring"
              ratio="21/9"
              dims="3200 × 1350 · Architecture Export"
            />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH10 — IMPACT
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">10</span>
            <span className="me-eyebrow">Impact</span>
          </div>

          <h2 className="me-section-title me-reveal">
            94% pass rate. 3M+ learners. 40% cheaper than the market leader.{' '}
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
              <span className="me-impact-num">2M+</span>
              <span className="me-impact-label">Questions answered</span>
              <p className="me-impact-desc">Practice questions graded and fed back to the adaptive model.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">30%</span>
              <span className="me-impact-label">More syllabus covered</span>
              <p className="me-impact-desc">By students using the AI Scheduler vs. self-directed study.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">20%</span>
              <span className="me-impact-label">Higher mock exam scores</span>
              <p className="me-impact-desc">For students who completed at least 3 full simulation sessions.</p>
            </div>
            <div className="me-impact-card">
              <span className="me-impact-num">22%</span>
              <span className="me-impact-label">Higher student retention</span>
              <p className="me-impact-desc">For institutions using the educator at-risk alert dashboard.</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH11 — ROADMAP
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">11</span>
            <span className="me-eyebrow">Product Roadmap</span>
          </div>

          <h2 className="me-section-title me-reveal">
            From 500 MCQs at MVP to <span className="me-amber">VR simulations</span> on the horizon.
          </h2>

          <div className="me-roadmap me-reveal">
            {ROADMAP.map((phase, i) => (
              <div className={`me-phase${phase.status === 'planned' ? ' me-phase--planned' : ''}`} key={phase.phase}>
                <div className="me-phase-spine">
                  <div className="me-phase-node" />
                  {i < ROADMAP.length - 1 && <div className="me-phase-line" />}
                </div>
                <div className="me-phase-body">
                  <div className="me-phase-header">
                    <span className="me-phase-name">{phase.phase}</span>
                    <span className="me-phase-timeline">{phase.timeline}</span>
                    {phase.status === 'planned' && <span className="me-phase-status">Planned</span>}
                  </div>
                  <ul className="me-phase-milestones">
                    {phase.milestones.map(m => <li key={m}>{m}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CH12 — LESSONS
        ════════════════════════════════════════════════════════ */}
        <section className="me-section">
          <div className="me-section-label me-reveal">
            <span className="me-ch-num">12</span>
            <span className="me-eyebrow">What I'd Tell Myself at the Start</span>
          </div>

          <h2 className="me-section-title me-reveal">Five lessons from building an <span className="me-amber">AI-powered EdTech</span> product at scale.</h2>

          <div className="me-lessons me-reveal-stagger">
            {LESSONS.map(l => (
              <div className="me-lesson" key={l.num}>
                <span className="me-lesson-num">{l.num}</span>
                <div>
                  <h3 className="me-lesson-title">{l.title}</h3>
                  <p className="me-lesson-body">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            CTA
        ════════════════════════════════════════════════════════ */}
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
