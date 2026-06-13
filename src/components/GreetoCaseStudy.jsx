import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './GreetoCaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ─────────────────────────────────────────────── */
const PERSONAS = [
  {
    id: 'priya',
    icon: '📊',
    role: 'Marketing Manager',
    name: 'Priya',
    quote: '"I need to reach customers on their preferred channel without jumping between apps."',
    insight: 'Manages multi-channel campaigns for a retail business. Needs easy broadcast tools, unified audience lists, and per-channel performance reports.',
  },
  {
    id: 'amit',
    icon: '💬',
    role: 'Customer Support Agent',
    name: 'Amit',
    quote: '"Missed messages and fragmented history cost us customers every single day."',
    insight: 'Handles daily inquiries. Needs a unified chat window, quick reply templates, status flags, and clear conversation assignment.',
  },
  {
    id: 'sneha',
    icon: '📈',
    role: 'Support Team Lead',
    name: 'Sneha',
    quote: '"I need visibility into SLA compliance and audit logs — not just a pretty dashboard."',
    insight: 'Oversees team performance. Values response time analytics, queue analytics, security compliance, and role-based access control.',
  },
]

const JOURNEY = [
  {
    num: '01',
    phase: 'Log In & Triage',
    badge: 'Inbox',
    desc: 'Agent opens the unified inbox. All channels — WhatsApp, Instagram, Email, SMS — surface in a single sorted list with unread counts, channel icons, and contact names at a glance.',
  },
  {
    num: '02',
    phase: 'Reply with Context',
    badge: 'Chat Window',
    desc: 'One click opens the full conversation thread with complete cross-channel history. Quick-reply templates surface contextually. The agent composes and sends — message routes via the correct channel API automatically.',
  },
  {
    num: '03',
    phase: 'Assign & Resolve',
    badge: 'Routing',
    desc: 'Agent marks the conversation resolved or routes to a specialist via assignment rules. Status updates propagate to the team view in real-time. Audit log captures every action.',
  },
]

const FEATURES = [
  { num: '01', title: 'Unified Inbox',             desc: 'All messages from WhatsApp, Instagram, Email, SMS, and live chat in one interface. Filter, search, assign, tag, and reply without switching apps. Templates and read receipts built in.' },
  { num: '02', title: 'Campaign Manager',           desc: 'Multi-channel broadcasts and drip campaigns with audience segmentation, rich content editor, and per-channel analytics. Multi-step wizard previews message format for each channel before send.' },
  { num: '03', title: 'Visual Bot Builder',         desc: 'Drag-and-drop canvas to build chatbots for FAQ handling and lead qualification. Node-based flowchart with intent triggers, reply nodes, and a live test emulator before activation.' },
  { num: '04', title: 'Contact Management (CRM)',   desc: 'Central directory of all customers with full cross-channel conversation history, custom tags, segmentation for targeted campaigns, and timeline view of every interaction.' },
  { num: '05', title: 'Analytics Dashboard',        desc: 'Real-time charts for conversation volume, response times, campaign engagement (open/click), and bot deflection rate. Filterable by date range and channel. Exportable as CSV/PDF.' },
  { num: '06', title: 'Team Inbox & Routing',       desc: 'Assign conversations to agents, set open/closed statuses, and configure routing by round-robin or skill-based rules. Full team collaboration with no overlap or missed escalations.' },
  { num: '07', title: 'Super Admin Panel',          desc: 'Multi-tenant admin controls: company branding, user management, role assignment, billing configuration, and immutable audit logs of all critical actions with search and export.' },
  { num: '08', title: 'Integration Hub',            desc: 'Pre-built connectors for WhatsApp Business API, Instagram (Meta), SMTP/IMAP, Twilio SMS, HubSpot, Salesforce, Stripe, and Zapier. Expandable via webhooks for custom workflows.' },
  { num: '09', title: 'Security & Compliance',      desc: 'TLS encryption in transit, AES-256 at rest, row-level multi-tenant data isolation, RBAC, 2FA, GDPR and SOC2 compliance, automated backups, and vulnerability scanning.' },
]

const INTEGRATIONS = [
  { name: 'WhatsApp Business API', type: 'Channel',    color: '#25D366' },
  { name: 'Instagram (Meta)',       type: 'Channel',    color: '#E1306C' },
  { name: 'Email (SMTP/IMAP)',      type: 'Channel',    color: '#38BDF8' },
  { name: 'SMS via Twilio',         type: 'Channel',    color: '#F22F46' },
  { name: 'Live Chat Widget',       type: 'Channel',    color: '#A855F7' },
  { name: 'HubSpot CRM',           type: 'CRM',        color: '#FF7A59' },
  { name: 'Salesforce',             type: 'CRM',        color: '#00A1E0' },
  { name: 'Zapier',                 type: 'Automation', color: '#FF4A00' },
  { name: 'Google Analytics',       type: 'Analytics',  color: '#E37400' },
  { name: 'Stripe Payments',        type: 'Billing',    color: '#635BFF' },
]

const PRICING = [
  { tier: 'Free Trial', price: '$0',     period: '14 days',    users: '3 users',   channels: '1 channel', note: 'WhatsApp · 100 messages', highlight: false },
  { tier: 'Basic',      price: '$89',    period: '/mo annual', users: '3 users',   channels: '1 channel', note: 'Core chat & bot features', highlight: false },
  { tier: 'Pro',        price: '$249',   period: '/mo annual', users: '10 users',  channels: '2 channels', note: 'Advanced analytics + campaigns', highlight: true },
  { tier: 'Enterprise', price: 'Custom', period: 'pricing',    users: 'Unlimited', channels: 'Unlimited', note: 'SLAs · dedicated support', highlight: false },
]

const TECH_STACK = [
  'React + TypeScript', 'Node.js + Express', 'PostgreSQL (multi-tenant)',
  'Redis (queue + cache)', 'WhatsApp Business API', 'Twilio SMS',
  'Socket.io (WebSockets)', 'Kubernetes', 'Stripe Billing',
]

const LESSONS = [
  { num: '01', title: 'Channel breadth alone isn\'t differentiation', body: 'Every competitor offers WhatsApp. The real moat is team coordination — routing, assignment, audit — layered on top of channel access. Users don\'t pay for channels; they pay for the system that makes channels manageable.' },
  { num: '02', title: 'Automation quality beats quantity', body: 'Our early bot builder had 40+ node types. Users only needed 6 core ones. Simplifying the canvas to intents, replies, and conditions cut onboarding time dramatically and more than doubled bot activation rates.' },
  { num: '03', title: 'Multi-tenancy is architecture, not a feature', body: 'Retrofitting row-level isolation after launch would have been catastrophic. Building tenant_id into every query from day one let us scale to enterprise clients without a single data isolation incident.' },
]

/* ─── Carousel & Placeholder Data ─────────────────────── */
const FLOW_SLIDES = [
  {
    title: 'Inbox Conversation Flow',
    desc: 'Login → inbox triage → open conversation → read full cross-channel history → compose reply with quick-reply templates → API delivers message via correct channel → mark resolved or reassign to a teammate.',
    img: '/userflow.png',
  },
  {
    title: 'Campaign Broadcast Flow',
    desc: 'Navigate to Campaigns → New Campaign wizard → select channels & audience segments → compose rich content → preview per-channel format → schedule send time → system validates & dispatches → analytics update with sent/opened/clicked metrics.',
    hint: 'Replace with: Figma UX flow diagram — Campaign Broadcast flow (multi-step wizard with validation states)',
    dims: '2400 × 900 · Figma Export',
  },
  {
    title: 'Visual Bot Builder Flow',
    desc: 'Open Bot Builder → blank canvas → drag intent trigger nodes and reply nodes → connect flow with edges → configure node properties → test live in the chat emulator → save and activate → incoming messages matching the flow are auto-answered.',
    hint: 'Replace with: Figma UX flow diagram — Bot Builder flow (canvas states, emulator panel, activation confirmation)',
    dims: '2400 × 900 · Figma Export',
  },
  {
    title: 'Analytics Review Flow',
    desc: 'Navigate to Analytics → charts load with default 7-day range → apply filters (date range, channel, agent) → hover tooltips reveal granular data points → click metric to drill down → export CSV/PDF report for presentations.',
    hint: 'Replace with: Figma UX flow diagram — Analytics Review flow (dashboard states, filter interactions, export modal)',
    dims: '2400 × 900 · Figma Export',
  },
  {
    title: 'Admin Setup & Onboarding Flow',
    desc: 'Login as admin → Settings → Integration Hub → connect WhatsApp via API credentials → test connection → invite team members by email → assign roles → configure plan & billing → review first-use checklist dashboard.',
    hint: 'Replace with: Figma UX flow diagram — Admin Setup flow (integration OAuth steps, role assignment, billing modal)',
    dims: '2400 × 900 · Figma Export',
  },
]

const FEATURE_SLIDES = [
  {
    title: 'Unified Inbox — Desktop View',
    desc: 'The main workspace: left sidebar with conversation list (channel icons, unread counts, contact names), main chat window with full message history, and composer with quick-reply template dropdown. Channel filter tabs at the top.',
    hint: 'Replace with: Unified Inbox desktop screenshot — sidebar + chat window + composer at 1920×1080',
    dims: '1920 × 1080 · App Screenshot',
  },
  {
    title: 'Campaign Manager — Multi-step Wizard',
    desc: 'Campaign creation wizard showing step 2 (audience segmentation): channel selection chips, contact segment dropdown, recipient count display, and the side-by-side per-channel message preview pane updating in real-time.',
    hint: 'Replace with: Campaign Manager wizard screenshot — channel select + audience + preview at 1920×1080',
    dims: '1920 × 1080 · App Screenshot',
  },
  {
    title: 'Visual Bot Builder — Canvas & Properties',
    desc: 'Drag-and-drop canvas showing a sample "Operating Hours" FAQ flow: intent trigger node → conditional branch node → two reply nodes → fallback node. Properties panel open on the right. Test emulator chat window active below.',
    hint: 'Replace with: Bot Builder canvas screenshot — full flow with properties panel open at 1920×1080',
    dims: '1920 × 1080 · App Screenshot',
  },
  {
    title: 'Analytics Dashboard — KPI Overview',
    desc: 'Analytics dashboard with four chart panels: conversation volume bar chart, response time line chart, bot deflection donut, and campaign open/click rate table. Date filter and channel filter controls in the top bar.',
    hint: 'Replace with: Analytics Dashboard screenshot — all KPI charts with filters active at 1920×1080',
    dims: '1920 × 1080 · App Screenshot',
  },
  {
    title: 'Mobile Inbox — Responsive View',
    desc: 'Mobile-optimized inbox on a 390px viewport: bottom tab navigation (Inbox, Campaigns, Contacts, Analytics), swipeable conversation list with channel badges, compact chat window with emoji and attachment controls in the composer.',
    hint: 'Replace with: Mobile inbox screenshot at 390×844 — optionally framed in an iPhone device mockup',
    dims: '390 × 844 · Mobile Screenshot',
  },
]

const DESIGN_SLIDES = [
  {
    title: 'Design System — Component Library',
    desc: 'Full Figma component library: color tokens (Navy, Sky Blue, Violet, Gold), typography scale (Display through Caption), button states, input variants, card components, badges, channel icon set, and the 8px spacing grid.',
    hint: 'Replace with: Figma design system overview frame — all component categories visible',
    dims: '1920 × 1080 · Figma Frame',
  },
  {
    title: 'Unified Inbox — Full Page Mockup',
    desc: 'Complete 1440px desktop layout: top navigation with workspace switcher, collapsible left sidebar with channel filters, conversation list panel, main chat window, and right-side contact info + CRM panel.',
    hint: 'Replace with: Full desktop Figma mockup of the Inbox page at 1440×900 — showing all 4 panels',
    dims: '1440 × 900 · Figma Mockup',
  },
  {
    title: 'Campaign Composer — Dual Preview',
    desc: 'Campaign step 3: rich text editor on the left with a simultaneous multi-channel preview panel on the right showing exactly how the message renders on WhatsApp (bubble), Instagram (DM), and Email (formatted template).',
    hint: 'Replace with: Campaign composer Figma mockup with dual preview panel at 1440×900',
    dims: '1440 × 900 · Figma Mockup',
  },
  {
    title: 'Mobile App — iOS & Android Side-by-Side',
    desc: 'Side-by-side device mockups: iOS (light chrome, rounded corners) and Android (material bottom sheet) showing the Greeto mobile inbox, bottom tab navigation, conversation thread, and the compact quick-reply composer.',
    hint: 'Replace with: iOS + Android device frame mockup export from Figma — side by side',
    dims: '2560 × 1440 · Device Mockup',
  },
]

/* ─── Sub-components ────────────────────────────────────── */
function ImgPlaceholder({ title, hint, ratio = '16/9', dims = '' }) {
  return (
    <div className="gr-img-placeholder" style={{ aspectRatio: ratio }}>
      <div className="gr-placeholder-grid" aria-hidden="true" />
      <div className="gr-placeholder-content">
        <svg
          className="gr-placeholder-icon"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden="true"
        >
          <rect x="4" y="10" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="14" cy="19" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 30 L14 22 L22 27 L31 19 L40 30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
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
        <button className="gr-carousel-btn" onClick={prev} aria-label="Previous slide">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="gr-carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`gr-carousel-dot${i === current ? ' gr-carousel-dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="gr-carousel-btn" onClick={next} aria-label="Next slide">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="gr-carousel-counter">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      <div className="gr-carousel-caption">
        <span className="gr-caption-num">{String(current + 1).padStart(2, '0')}</span>
        <div className="gr-caption-body">
          <span className="gr-caption-title">{slides[current].title}</span>
          <span className="gr-caption-desc">{slides[current].desc}</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────── */
export default function GreetoCaseStudy() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      /* Cover entrance */
      gsap.fromTo('.gr-cover-eyebrow', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15 })
      gsap.fromTo('.gr-cover-title',   { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.25 })
      gsap.fromTo('.gr-cover-tagline', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.55 })
      gsap.fromTo('.gr-cover-attrs',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.75 })
      gsap.fromTo('.gr-cover-hint',    { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.2 })
      gsap.fromTo('.gr-bubble',        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 0.4 })

      /* Scroll-triggered reveals */
      gsap.utils.toArray('.gr-reveal').forEach(el => {
        gsap.fromTo(el,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 78%' } }
        )
      })

      gsap.utils.toArray('.gr-reveal-stagger').forEach(parent => {
        gsap.fromTo(Array.from(parent.children),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: parent, start: 'top 75%' } }
        )
      })

      /* Impact counters */
      ;[
        { sel: '#gr-cnt-channels', to: 5,   suffix: '+',  fmt: v => Math.round(v) },
        { sel: '#gr-cnt-users',    to: 3.3, suffix: 'B+', fmt: v => v.toFixed(1) },
        { sel: '#gr-cnt-rate',     to: 98,  suffix: '%',  fmt: v => Math.round(v) },
        { sel: '#gr-cnt-resp',     to: 50,  suffix: '%',  fmt: v => Math.round(v) },
      ].forEach(({ sel, to, suffix, fmt }) => {
        const el = document.querySelector(sel)
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: to, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          onUpdate() { el.textContent = fmt(obj.val) + suffix },
        })
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.div
      ref={pageRef}
      className="gr-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ══ NAV ══ */}
      <nav className="gr-nav">
        <motion.button
          className="gr-nav-back"
          onClick={() => navigate('/')}
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Work
        </motion.button>
        <span className="gr-nav-title">Greeto — Case Study</span>
        <div className="gr-nav-tags">
          <span className="gr-nav-tag">B2B SaaS</span>
          <span className="gr-nav-tag">Omnichannel</span>
        </div>
      </nav>

      {/* ══ COVER ══ */}
      <section className="gr-cover">
        <div className="gr-cover-bg" />
        <div className="gr-cover-channels" aria-hidden="true">
          <div className="gr-bubble gr-bubble--wa">WA</div>
          <div className="gr-bubble gr-bubble--ig">IG</div>
          <div className="gr-bubble gr-bubble--mail">✉</div>
          <div className="gr-bubble gr-bubble--sms">SMS</div>
          <div className="gr-bubble gr-bubble--chat">💬</div>
        </div>
        <div className="gr-cover-inner">
          <div className="gr-cover-eyebrow">
            <span className="gr-eyebrow-dot" />
            <span>CASE STUDY</span>
            <span className="gr-eyebrow-sep">·</span>
            <span>2024</span>
            <span className="gr-eyebrow-sep">·</span>
            <span>B2B SaaS · Communication Platform</span>
          </div>
          <h1 className="gr-cover-title">Greeto.</h1>
          <p className="gr-cover-tagline">
            Unify WhatsApp, Instagram, Email, SMS &amp; Chat<br />
            into one AI-driven customer engagement hub.
          </p>
          <div className="gr-cover-attrs">
            <div className="gr-attr"><span className="gr-attr-label">Category</span><span className="gr-attr-val">B2B SaaS · Omnichannel CX</span></div>
            <div className="gr-attr"><span className="gr-attr-label">Channels</span><span className="gr-attr-val">WA · IG · Email · SMS · Chat</span></div>
            <div className="gr-attr"><span className="gr-attr-label">My Role</span><span className="gr-attr-val">Product Designer &amp; Builder</span></div>
            <div className="gr-attr"><span className="gr-attr-label">Stack</span><span className="gr-attr-val">React · Node.js · PostgreSQL · K8s</span></div>
          </div>
        </div>
        <div className="gr-cover-hint" aria-hidden="true">
          <div className="gr-hint-wheel" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* ══ PRODUCT OVERVIEW — Hero Screenshot ══ */}
      <div className="gr-overview-section">
        <div className="gr-section-inner">
          <p className="gr-sub-label">PRODUCT OVERVIEW</p>
          <ImgPlaceholder
            title="Greeto Dashboard — Unified Workspace"
            hint="Replace with: Full product screenshot — inbox sidebar (left), active chat window (center), contact & CRM info panel (right), top analytics strip"
            dims="2560 × 1440 · MacBook Pro Mockup"
          />
        </div>
      </div>

      {/* ══ 01 — PROBLEM ══ */}
      <section className="gr-section">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">01</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">THE PROBLEM</span>
          </div>
          <blockquote className="gr-blockquote gr-reveal">
            Businesses were managing 5 channels in 5 separate apps — missing messages, losing context, and burning out agents.
          </blockquote>
          <div className="gr-two-col">
            <div>
              <p className="gr-body gr-reveal">
                WhatsApp, Instagram, email, SMS, and live chat each lived in their own silo. Agents had to context-switch constantly. Customer history was fragmented across tools. SLAs were missed.
              </p>
              <p className="gr-body gr-reveal" style={{ marginTop: '1rem' }}>
                Existing tools like AiSensy offered single-channel messaging. No platform unified all channels with team routing, bot automation, and enterprise analytics in one workspace. We built Greeto to close that gap.
              </p>
            </div>
            <div className="gr-callouts gr-reveal-stagger">
              <div className="gr-callout">
                <span className="gr-callout-icon">📲</span>
                <div><strong>Fragmented channels</strong><p>5 apps open simultaneously per agent. Customer context lost on every switch.</p></div>
              </div>
              <div className="gr-callout">
                <span className="gr-callout-icon">⏱</span>
                <div><strong>Slow response times</strong><p>No unified queue meant messages fell through the cracks during peak hours.</p></div>
              </div>
              <div className="gr-callout">
                <span className="gr-callout-icon">🤖</span>
                <div><strong>Zero automation</strong><p>Repetitive FAQs consumed 40%+ of agent time. No bot or auto-reply layer in place.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 02 — MARKET CONTEXT ══ */}
      <section className="gr-section gr-section--alt">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">02</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">MARKET CONTEXT</span>
          </div>
          <h2 className="gr-headline gr-reveal">
            WhatsApp reaches 3.3B users at 98–99% open rates. The unified inbox market was underserved.
          </h2>
          <p className="gr-body gr-reveal">
            Messaging apps dominate customer engagement. Platforms like Kommo and WapCRM consolidated WhatsApp/Instagram, but lacked broad channel support or enterprise features. We saw the gap for a full omnichannel hub with automation, analytics, and scalability.
          </p>
          <div className="gr-stats-row gr-reveal-stagger">
            <div className="gr-stat-block">
              <span className="gr-stat-value" style={{ color: 'var(--gr-blue)' }}>3.3B+</span>
              <span className="gr-stat-label">WhatsApp monthly active users (2026)</span>
            </div>
            <div className="gr-stat-block">
              <span className="gr-stat-value gradient-text">98–99%</span>
              <span className="gr-stat-label">WhatsApp open rate vs ~20% for email campaigns</span>
            </div>
            <div className="gr-stat-block">
              <span className="gr-stat-value" style={{ color: 'var(--gr-purple)' }}>$19.6B</span>
              <span className="gr-stat-label">Omnichannel customer engagement market size</span>
            </div>
          </div>
          <p className="gr-insight-callout gr-reveal">
            <span className="gr-insight-label">INSIGHT →</span>
            Most unified inbox platforms consolidate WhatsApp + Instagram but stop there. Greeto goes further: Email, SMS, and live chat in the same workspace, with enterprise routing, bots, and compliance baked in from day one.
          </p>
        </div>
      </section>

      {/* ══ 03 — GOALS & METRICS ══ */}
      <section className="gr-section">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">03</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">GOALS & METRICS</span>
          </div>
          <h2 className="gr-headline gr-reveal">Six measurable outcomes defined at the start, not the end.</h2>
          <div className="gr-goals-list gr-reveal-stagger">
            {[
              { label: 'Channel consolidation', goal: 'Target 80% of inbound messages handled inside Greeto' },
              { label: 'Response time',          goal: 'Reduce average first reply by 50% — target under 1 hour' },
              { label: 'Campaign engagement',    goal: 'Track open/click rates of 20–50% per channel per campaign' },
              { label: 'Bot deflection',         goal: 'Automate 30–50% of common FAQ queries via chatbots' },
              { label: 'Team collaboration',     goal: 'Zero duplicate assignments — every conversation owned by one agent' },
              { label: 'Enterprise uptime',      goal: '≥99.9% system uptime with full security compliance' },
            ].map(({ label, goal }) => (
              <div className="gr-goal-row" key={label}>
                <span className="gr-goal-label">{label}</span>
                <span className="gr-goal-text">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 04 — RESEARCH & PERSONAS ══ */}
      <section className="gr-section gr-section--alt">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">04</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">RESEARCH & PERSONAS</span>
          </div>
          <h2 className="gr-headline gr-reveal">
            25 interviews. 100+ surveys. Three distinct users, one shared pain.
          </h2>
          <p className="gr-body gr-reveal">
            Qualitative interviews reached thematic saturation across SMB owners, support reps, and marketers in e-commerce, edtech, and services. A competitor feature audit covered Kommo, WapCRM, Gallabox, and AiSensy.
          </p>

          {/* Research insights */}
          <div className="gr-research-insights gr-reveal-stagger" style={{ marginTop: '1.5rem' }}>
            {[
              'Users need one pane of glass — all channel messages in one inbox',
              'Chat assignment and quick-reply templates save meaningful time per agent',
              'Automation can deflect repetitive queries, freeing agents for high-value work',
              'Businesses want branded chat, multi-language support, and flexible workflow rules',
            ].map((insight, i) => (
              <div className="gr-research-insight" key={i}>
                <span className="gr-research-dot" />
                <span>{insight}</span>
              </div>
            ))}
          </div>

          {/* Research board placeholder */}
          <div className="gr-sub-section gr-reveal">
            <p className="gr-sub-label">RESEARCH SYNTHESIS</p>
            <ImgPlaceholder
              title="Affinity Map & Key Theme Clusters"
              hint="Replace with: Photo or screenshot of the research synthesis board — interview insight clusters, key themes, competitive analysis matrix, and persona mapping canvas"
              ratio="3/2"
              dims="1920 × 1280 · Research Documentation · Miro / FigJam"
            />
          </div>

          {/* Personas */}
          <p className="gr-sub-label" style={{ marginTop: '3rem' }}>USER PERSONAS</p>
          <div className="gr-personas-grid gr-reveal-stagger">
            {PERSONAS.map(p => (
              <div className="gr-persona-card" key={p.id}>
                <span className="gr-persona-icon">{p.icon}</span>
                <span className="gr-persona-role">{p.role}</span>
                <span className="gr-persona-name">{p.name}</span>
                <blockquote className="gr-persona-quote">{p.quote}</blockquote>
                <p className="gr-persona-insight">{p.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 05 — USER JOURNEY ══ */}
      <section className="gr-section">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">05</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">USER JOURNEY</span>
          </div>
          <h2 className="gr-headline gr-reveal">
            The core Inbox flow — new message to resolution in three deliberate steps.
          </h2>
          <div className="gr-journey-flow">
            {JOURNEY.map((step, i) => (
              <div className="gr-journey-step gr-reveal" key={step.num}>
                <div className="gr-journey-left">
                  <div className="gr-journey-dot" />
                  {i < JOURNEY.length - 1 && <div className="gr-journey-line" />}
                </div>
                <div className="gr-journey-right">
                  <div className="gr-journey-header">
                    <span className="gr-journey-num">{step.num}</span>
                    <span className="gr-journey-phase">{step.phase}</span>
                    <span className="gr-journey-time">{step.badge}</span>
                  </div>
                  <p className="gr-journey-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow diagrams carousel */}
          <div className="gr-sub-section gr-reveal">
            <p className="gr-sub-label">USER FLOW DIAGRAMS — ALL 5 FLOWS</p>
            <Carousel slides={FLOW_SLIDES} />
          </div>
        </div>
      </section>

      {/* ══ 06 — FEATURES ══ */}
      <section className="gr-section gr-section--alt">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">06</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">FEATURES</span>
          </div>
          <h2 className="gr-headline gr-reveal">
            Nine modules. One workspace. Built around what agents actually need daily.
          </h2>
          <div className="gr-features-list">
            {FEATURES.map(f => (
              <div className="gr-feature-item gr-reveal" key={f.num}>
                <span className="gr-feature-num">{f.num}</span>
                <div className="gr-feature-body">
                  <h3 className="gr-feature-title">{f.title}</h3>
                  <p className="gr-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature screenshots carousel */}
          <div className="gr-sub-section gr-reveal">
            <p className="gr-sub-label">FEATURE SCREENSHOTS</p>
            <Carousel slides={FEATURE_SLIDES} />
          </div>
        </div>
      </section>

      {/* ══ 07 — ARCHITECTURE & STACK ══ */}
      <section className="gr-section">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">07</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">ARCHITECTURE & STACK</span>
          </div>
          <h2 className="gr-headline gr-reveal">Cloud-native microservices on Kubernetes. Multi-tenant by design from day one.</h2>
          <div className="gr-tech-split">
            <div>
              <p className="gr-body gr-reveal">
                React SPA communicates over HTTPS/WebSockets with a Node.js API gateway routing to dedicated microservices: Messaging (channel APIs), Bot Engine, Campaign Scheduler, and Analytics.
              </p>
              <p className="gr-body gr-reveal" style={{ marginTop: '1rem' }}>
                PostgreSQL with <code style={{ color: 'var(--gr-blue)', fontSize: '0.85em' }}>tenant_id</code> row-level isolation. Redis for queue and cache. Each channel integration is a secured API client with retry logic and dead-letter queues.
              </p>
              <div className="gr-arch-diagram gr-reveal">
                <div className="gr-arch-row">
                  <div className="gr-arch-node gr-arch-node--client">React UI</div>
                  <div className="gr-arch-arrow">→</div>
                  <div className="gr-arch-node gr-arch-node--gateway">API Gateway</div>
                </div>
                <div className="gr-arch-services">
                  <div className="gr-arch-service">Messaging API</div>
                  <div className="gr-arch-service">Bot Engine</div>
                  <div className="gr-arch-service">Campaign Scheduler</div>
                  <div className="gr-arch-service">Analytics Service</div>
                </div>
                <div className="gr-arch-row gr-arch-row--bottom">
                  <div className="gr-arch-node gr-arch-node--db">PostgreSQL</div>
                  <div className="gr-arch-node gr-arch-node--ws">WebSocket Hub</div>
                  <div className="gr-arch-node gr-arch-node--ext">Channel APIs</div>
                </div>
              </div>
            </div>
            <div>
              <p className="gr-stack-label gr-reveal">TECH STACK</p>
              <div className="gr-stack-pills gr-reveal-stagger">
                {TECH_STACK.map(t => (
                  <span className="gr-stack-pill" key={t}>{t}</span>
                ))}
              </div>
              <div className="gr-arch-note gr-reveal">
                <p className="gr-arch-note-label">DATA MODEL</p>
                <p className="gr-arch-note-text">
                  Core entities: Tenant → Users, Contacts, Campaigns, Bots. Contact → Conversations → Messages. Campaign → CampaignRecipients. Every table carries <code style={{ color: 'var(--gr-blue)', fontSize: '0.85em' }}>tenant_id</code> for row-level security.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture diagram images */}
          <div className="gr-sub-section gr-reveal">
            <p className="gr-sub-label">ARCHITECTURE DIAGRAMS</p>
            <div className="gr-arch-imgs">
              <ImgPlaceholder
                title="System Architecture — Service Map"
                hint="Replace with: Full architecture diagram — React UI → API Gateway → Messaging / Bot Engine / Campaign Scheduler / Analytics → PostgreSQL + Redis → Channel APIs (WA, IG, Twilio, SMTP) → WebSocket Hub"
                dims="2400 × 900 · Figma / draw.io Export"
              />
              <ImgPlaceholder
                title="Data Model — Entity Relationship Diagram"
                hint="Replace with: ER diagram — Tenant ↔ User / Contact / Campaign / Bot / EventLog; Contact ↔ Conversation ↔ Message; Campaign ↔ CampaignRecipient; User → Role"
                ratio="4/3"
                dims="1920 × 1440 · Figma / draw.io Export"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 08 — UI DESIGN ══ */}
      <section className="gr-section gr-section--alt">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">08</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">UI DESIGN</span>
          </div>
          <h2 className="gr-headline gr-reveal">Dark-first interface built for power users who spend 8 hours a day in the product.</h2>
          <p className="gr-body gr-reveal">
            The design system anchors on a deep navy base with sky blue channel accents and violet highlights. Every screen prioritizes information density without sacrificing readability — agents need to scan fast, act faster.
          </p>
          <div className="gr-design-swatches gr-reveal-stagger" style={{ margin: '1.5rem 0 2.5rem' }}>
            {[
              { hex: '#050816', name: 'Deep Navy',  label: 'Background' },
              { hex: '#38BDF8', name: 'Sky Blue',   label: 'Primary accent · CTAs' },
              { hex: '#A855F7', name: 'Violet',     label: 'Secondary · status badges' },
              { hex: '#DFB743', name: 'Amber Gold', label: 'Highlight · metrics' },
              { hex: '#F8FAFC', name: 'Off White',  label: 'Primary text' },
              { hex: '#64748B', name: 'Slate',      label: 'Secondary text' },
            ].map(({ hex, name, label }) => (
              <div className="gr-design-swatch" key={hex}>
                <span className="gr-design-swatch-color" style={{ background: hex }} />
                <span className="gr-design-swatch-name">{name}</span>
                <span className="gr-design-swatch-label">{label}</span>
              </div>
            ))}
          </div>
          <Carousel slides={DESIGN_SLIDES} />
        </div>
      </section>

      {/* ══ 09 — INTEGRATIONS ══ */}
      <section className="gr-section">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">09</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">INTEGRATIONS</span>
          </div>
          <h2 className="gr-headline gr-reveal">Ten pre-built connectors. Expandable via Zapier or custom webhooks.</h2>
          <div className="gr-integrations-grid gr-reveal-stagger">
            {INTEGRATIONS.map(int => (
              <div className="gr-integration-card" key={int.name}>
                <div className="gr-integration-dot" style={{ background: int.color, boxShadow: `0 0 8px ${int.color}55` }} />
                <div>
                  <span className="gr-integration-name">{int.name}</span>
                  <span className="gr-integration-type">{int.type}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Integration hub screenshot */}
          <div className="gr-sub-section gr-reveal">
            <p className="gr-sub-label">INTEGRATION HUB SCREENSHOT</p>
            <ImgPlaceholder
              title="Integration Hub — Connected Channels View"
              hint="Replace with: Settings → Integrations page screenshot showing all 10 integration cards with status indicators (Connected / Not connected), configure buttons, and test connection results"
              dims="1920 × 1080 · App Screenshot"
            />
          </div>
        </div>
      </section>

      {/* ══ 10 — IMPACT ══ */}
      <section className="gr-section gr-section--impact">
        <div className="gr-section-bg-glow" />
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">10</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">IMPACT</span>
          </div>
          <h2 className="gr-headline gr-reveal">Target metrics designed into the product from day one.</h2>
          <div className="gr-impact-grid gr-reveal-stagger">
            <div className="gr-impact-block">
              <span className="gr-impact-num" id="gr-cnt-channels">5+</span>
              <span className="gr-impact-label">Channels Unified</span>
              <span className="gr-impact-desc">WA, Instagram, Email, SMS, Chat — one inbox, zero context switching</span>
            </div>
            <div className="gr-impact-block">
              <span className="gr-impact-num" id="gr-cnt-users" style={{ color: 'var(--gr-blue)' }}>3.3B+</span>
              <span className="gr-impact-label">Addressable Users</span>
              <span className="gr-impact-desc">WhatsApp monthly active users reachable through the platform</span>
            </div>
            <div className="gr-impact-block">
              <span className="gr-impact-num" id="gr-cnt-rate" style={{ color: 'var(--gr-purple)' }}>98%</span>
              <span className="gr-impact-label">Open Rate</span>
              <span className="gr-impact-desc">WhatsApp message open rate vs ~20% for email campaigns</span>
            </div>
            <div className="gr-impact-block">
              <span className="gr-impact-num" id="gr-cnt-resp" style={{ color: 'var(--accent-gold)' }}>50%</span>
              <span className="gr-impact-label">Response Time Reduction</span>
              <span className="gr-impact-desc">Target: first reply under 1 hour across all customer channels</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 11 — PRICING ══ */}
      <section className="gr-section">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">11</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">PRICING MODEL</span>
          </div>
          <h2 className="gr-headline gr-reveal">Four tiers. Scales from startup evaluation to enterprise SLAs.</h2>
          <div className="gr-pricing-grid gr-reveal-stagger">
            {PRICING.map(p => (
              <div className={`gr-pricing-card${p.highlight ? ' gr-pricing-card--highlight' : ''}`} key={p.tier}>
                {p.highlight && <span className="gr-pricing-badge">POPULAR</span>}
                <span className="gr-pricing-tier">{p.tier}</span>
                <div className="gr-pricing-price">
                  <span className="gr-pricing-amount">{p.price}</span>
                  <span className="gr-pricing-period">{p.period}</span>
                </div>
                <div className="gr-pricing-details">
                  <span>{p.users}</span>
                  <span>{p.channels}</span>
                  <span className="gr-pricing-note">{p.note}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="gr-insight-callout gr-reveal" style={{ marginTop: '1.5rem' }}>
            <span className="gr-insight-label">ADD-ONS →</span>
            ~$20/mo per extra WhatsApp or Instagram number. Usage above plan limits billed at API conversation cost. Enterprise plans include dedicated SLAs and a customer success manager.
          </p>
        </div>
      </section>

      {/* ══ 12 — LESSONS ══ */}
      <section className="gr-section gr-section--alt">
        <div className="gr-section-inner">
          <div className="gr-eyebrow gr-reveal">
            <span className="gr-eyebrow-num">12</span>
            <span className="gr-eyebrow-slash">/</span>
            <span className="gr-eyebrow-text">LESSONS LEARNED</span>
          </div>
          <h2 className="gr-headline gr-reveal">
            What building Greeto taught me about B2B communication products.
          </h2>
          <div className="gr-lessons-list">
            {LESSONS.map(l => (
              <div className="gr-lesson gr-reveal" key={l.num}>
                <span className="gr-lesson-num">{l.num}</span>
                <div>
                  <h3 className="gr-lesson-title">{l.title}</h3>
                  <p className="gr-lesson-body">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="gr-cta">
        <div className="gr-cta-inner gr-reveal">
          <p className="gr-cta-eyebrow">WHAT'S NEXT</p>
          <h2 className="gr-cta-title">
            Building a platform that needs<br />this level of systems thinking?
          </h2>
          <div className="gr-cta-actions">
            <a href="mailto:contact@murthy.build" className="btn btn-primary btn-large">
              Let's Build Together →
            </a>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              See More Work
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
