import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './XoloxCaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const META = {
  product_type: 'B2B SaaS — Vertical CRM for EdTech / Coaching Institutes',
  positioning: 'Meritto + LeadSquared competitor, purpose-built for CPA, CMA, ACCA, EA coaching',
  segment: 'Coaching institutes with 5–200 seat counselling teams running high-ticket (₹50K–₹3L) pipelines',
  role: 'Product Owner · End-to-End UX Designer · IA Architect · PRD Author · RBAC Architect',
  team: ['1 PM (me)', '2 UI Designers', '1 UX Researcher', '6 Engineers', '1 QA'],
  scope: '3 portals · 165+ screens · Full RBAC architecture',
  timeline: 'Discovery: 5w → Architecture + PRD: 4w → Design: 10w → Build: 20w → Go-live',
  status: 'Live in production — operational backbone for NorthStar Academy',
}

const COVER_KPIS = [
  { id: 'xl-cnt-response', to: 22,  suffix: ' min', label: 'Avg first contact time (from 4.2 hours)' },
  { id: 'xl-cnt-followup', to: 81,  suffix: '%',   label: 'Follow-up task completion (from 34%)' },
  { id: 'xl-cnt-visible',  to: 100, suffix: '%',   label: 'Leads now trackable by stage (from 0%)' },
  { id: 'xl-cnt-onboard',  to: 1,   suffix: ' day', label: 'New counsellor to productive (from 2 weeks)' },
]

const RESEARCH_METHODS = [
  {
    num: '01', method: 'Embedded Observation (Contextual Inquiry)', n: 12, label: 'counsellors',
    duration: '3 weeks sitting with the live team',
    findings: [
      'Counsellors ran 3–5 parallel tools simultaneously: WhatsApp Web, Google Sheets, LeadSquared, notepad, Gmail',
      'The real CRM was a 400-row shared Google Sheet with personal colour-coding per counsellor. Editing conflicts daily.',
      'LeadSquared was used only to dump new leads — never updated. "New" stage had 200 leads from 6 months ago.',
      'Follow-up logic was entirely inside counsellors\' heads. Best memory = best conversion. No system support.',
      'Finding lead context before a callback took 2–4 minutes — while the lead was already on the phone.',
      'Managers had zero real-time view. Conversion rate appeared only at month-end. Lead-level coaching was impossible.',
      'Demo no-show rate was ~42% — scheduling and confirmation happened over WhatsApp with no automated reminder.',
    ],
  },
  {
    num: '02', method: 'In-Depth Interviews', n: 18, label: 'participants',
    breakdown: ['6 Junior Counsellors', '4 Senior Counsellors', '3 Sales Managers', '1 Sales Head', '2 Finance/Ops', '2 Converted Students'],
    findings: [
      '"Walk me through what happens from the moment a lead comes in until you first speak to them"',
      '"How do you decide which lead to call next when you have 40 open leads?"',
      '"When a lead goes cold, what do you do? Show me exactly."',
      '"What does your manager ask you about leads? What can you never answer?"',
      '"Have you ever lost a lead you think converted somewhere else? What happened?"',
    ],
  },
  {
    num: '03', method: 'Lead Journey Audit', n: 120, label: 'leads reconstructed',
    duration: '3 months of historical data from LeadSquared + Sheets + WhatsApp exports',
    findings: [
      'Avg time to first contact: 4.2 hours (range: 2 minutes to 3 days)',
      '18% of leads had zero counsellor contact on record — never called, never messaged',
      'Avg touchpoints before conversion: 6.3 across 14–21 days',
      'Estimated 31% of lost leads had no follow-up after initial contact',
      'Stage field in LeadSquared was accurate for only 23% of leads — rest were stale or never updated',
      '87% of counsellor-lead communication happened on WhatsApp — tracked in no system',
    ],
  },
  {
    num: '04', method: 'Competitive Teardown', n: 2, label: 'platforms benchmarked',
    findings: [
      'LeadSquared: Built for marketing teams — counsellors hate the UI, ignore it. WhatsApp is bolt-on. No capacity limits.',
      'LeadSquared: Stage pipeline is generic — no concept of the emotional stages of an education decision.',
      'LeadSquared: AI is marketing-focused (lead scoring by source) — zero counsellor co-pilot value.',
      'Meritto: Excellent for large universities, over-engineered for a 15-person coaching institute.',
      'Meritto: Per-application pricing model wrong for CPA coaching (high ticket, moderate volume).',
      'Both: No AI call assistance, no real-time talk tracks, no WhatsApp-native experience.',
    ],
  },
  {
    num: '05', method: 'Full Sales Day Shadowing', n: 3, label: 'counsellors · 2 days each',
    findings: [
      '8:47am: New lead arrives. Counsellor copies to WhatsApp, opens Sheets, opens LeadSquared. 3 tools in 90 seconds before first call.',
      '10:23am: Lead calls back. 3 minutes finding WhatsApp thread + Sheets row. Lead impatient before context is established.',
      '2:15pm: Manager asks pipeline update. Counsellor summarises verbally. Manager writes on paper. No system updated.',
      '4:30pm: End of day. Counsellor scrolls WhatsApp to "remember" who to follow up. Creates voice note reminder on personal phone.',
      'Next morning: 12 leads meant to follow up, no structured list. Who to call decided by gut + recency bias.',
    ],
  },
]

const AFFINITY_THEMES = [
  {
    icon: '🧠', theme: 'The Memory-Based CRM',
    desc: 'The real CRM was inside each counsellor\'s head and WhatsApp history. Best conversion = best memory + most discipline — not because the system helped, but despite it.',
    risk: 'When a strong counsellor leaves, every lead\'s context leaves with them.',
  },
  {
    icon: '🎲', theme: 'The Follow-Up Lottery',
    desc: 'Which leads got followed up was essentially random — dependent on who the counsellor remembered, how tired they were, and whether the lead had WhatsApp\'d recently. 31% were lost to silence.',
    risk: 'High-ticket decisions need 6+ touchpoints. A system that doesn\'t enforce cadence always leaks leads.',
  },
  {
    icon: '🦯', theme: 'Manager Blindness',
    desc: 'The Sales Head knew monthly conversion rates. She didn\'t know which counsellor had 60 stale leads, which lead was about to sign but hadn\'t been called in 5 days, or which counsellor was burning leads through bad pitch.',
    risk: 'Without visibility, coaching is impossible. Intervention always comes after the lead is lost.',
  },
  {
    icon: '📱', theme: 'Tool-Channel Mismatch',
    desc: '87% of lead touchpoints happened on WhatsApp. Activity was logged in a system with zero WhatsApp context. The communication and the CRM were completely disconnected.',
    risk: 'Any CRM that isn\'t WhatsApp-native will be ignored by Indian education counsellors.',
  },
  {
    icon: '🌫', theme: 'Stage Meaninglessness',
    desc: 'CRM stages had no shared definition. "Hot" to one counsellor was "Demo Done" to another. Pipeline reports were fiction. Forecasting was impossible.',
    risk: 'Pipeline management and forecasting require enforced, shared stage definitions — not labels.',
  },
]

const JTBDS = [
  {
    id: 'JTBD-01', actor: 'Counsellor', freq: 'Every workday', driver: 'Control + confidence',
    job: 'When I sit down to start my day, I want to immediately know exactly which leads need my attention today — in priority order — so I don\'t waste 30 minutes deciding who to call first.',
    workaround: 'Scrolls through 400-row Google Sheet and WhatsApp history. Decides by gut + recency bias.',
  },
  {
    id: 'JTBD-02', actor: 'Counsellor', freq: 'Multiple times / day', driver: 'Professionalism',
    job: 'When I pick up a call from a lead I haven\'t spoken to in 10 days, I want their full context visible in 3 seconds — what we discussed, their concern, what I promised — so I sound like I remember them.',
    workaround: 'Frantically scrolls WhatsApp thread while the phone rings. Sometimes asks the lead to remind them.',
  },
  {
    id: 'JTBD-03', actor: 'Counsellor', freq: 'After every qualified conversation', driver: 'Self-accountability',
    job: 'When I\'ve spoken to a lead and promised to follow up on Tuesday, I want the system to remind me and show me exactly what I said — so I never break a promise to a lead.',
    workaround: 'Personal calendar reminders or WhatsApp self-messages. ~66% of follow-up promises are broken.',
  },
  {
    id: 'JTBD-04', actor: 'Counsellor', freq: 'Multiple times / week', driver: 'Confidence in pitch',
    job: 'When a lead is objecting about cost or timing, I want to know what has worked with similar leads before — so I can handle the objection with confidence, not guesswork.',
    workaround: 'Asks senior counsellors between calls. Or improvises.',
  },
  {
    id: 'JTBD-05', actor: 'Sales Manager', freq: 'Daily', driver: 'Accountability + real-time coaching',
    job: 'When I\'m reviewing my team\'s pipeline, I want to see every counsellor\'s leads by stage and last activity — so I can intervene on stale leads before they\'re lost, not after.',
    workaround: 'Weekly Excel review. Finds out about lost leads 1–2 weeks after they\'ve gone cold.',
  },
  {
    id: 'JTBD-06', actor: 'Sales Manager', freq: 'Every new hire', driver: 'Team scalability',
    job: 'When a new counsellor joins, I want them to have structured workflow guidance from day one — without me shadowing them for 2 weeks.',
    workaround: 'Manager shadows new hire for 1–2 weeks. Productivity near zero for that period.',
  },
  {
    id: 'JTBD-07', actor: 'Sales Head', freq: 'Monthly with weekly check-ins', driver: 'Credibility + planning',
    job: 'When I\'m forecasting next month\'s enrollments, I want a data-grounded pipeline view — stages, conversion rates by counsellor, lead quality scores — so my forecast isn\'t just a guess.',
    workaround: 'Manually asks each counsellor for their "feel" of the pipeline. Aggregates in a spreadsheet.',
  },
  {
    id: 'JTBD-08', actor: 'Finance / Ops', freq: 'Every conversion', driver: 'Accuracy + handoff',
    job: 'When a student confirms enrollment, I want to trigger the fee workflow — invoice, payment link, installment schedule — without switching to a different system.',
    workaround: 'Manual invoice in Tally, WhatsApp payment link, Excel installment tracker. All disconnected.',
  },
]

const KEY_INSIGHTS = [
  {
    id: 'INS-01',
    insight: 'The CRM must be WhatsApp-native — not WhatsApp-integrated. There is a difference.',
    evidence: '87% of lead-counsellor communication happened on WhatsApp. When LeadSquared added a "WhatsApp integration", counsellors used it for 2 days then reverted. Send-from-CRM friction exceeded the value of logging.',
    principle: 'Every WhatsApp message sent from XOLOX must feel as fast as the native app. The system logs automatically — the counsellor never "logs" separately.',
  },
  {
    id: 'INS-02',
    insight: 'Counsellors don\'t think in "lead stages" — they think in "what\'s the next thing I need to do with this person".',
    evidence: 'When asked to describe their pipeline, every counsellor described actions, not stages. Stage-centric CRMs don\'t match the counsellor mental model.',
    principle: 'XOLOX shows counsellors a Task-first view by default. Stages exist for managers. The agent homepage is "what do I do today" — not a stage-sorted pipeline.',
  },
  {
    id: 'INS-03',
    insight: 'The highest-leverage intervention in the entire funnel is the first 30 minutes after a lead arrives.',
    evidence: 'Leads contacted within 30 minutes had 3.4x higher qualification rate than leads contacted after 4 hours. Students inquire with 3–5 institutes simultaneously.',
    principle: 'Lead assignment must be instant and automatic. New leads trigger immediate counsellor notification with SLA countdown. Manager notified on breach.',
  },
  {
    id: 'INS-04',
    insight: 'Stage definitions must be embedded in the workflow — not just labelled.',
    evidence: 'Free-text stage entry in LeadSquared yielded 23% stage accuracy. A pilot requiring checklist completion before stage advance reached 91% accuracy within 2 weeks.',
    principle: 'Stage advancement in XOLOX requires completing a defined checklist. You can\'t drag a lead to "Hot" without the system confirming qualifying conditions.',
  },
  {
    id: 'INS-05',
    insight: 'Manager coaching happens at month-end, in aggregate — it needs to happen in real time, at the lead level.',
    evidence: 'Managers could identify counsellors with good conversion rates. They could not identify which specific leads were being mishandled in real time. By the time a pattern emerged, 30–40 leads had already been lost.',
    principle: 'Manager view defaults to leads requiring attention (stale, SLA breach, no follow-up) — not a stage kanban. Intervention is the primary use case.',
  },
  {
    id: 'INS-06',
    insight: 'Role-based access isn\'t just a security requirement — it\'s a UX requirement.',
    evidence: 'When counsellors had access to all leads, they felt overwhelmed. When managers saw only their own leads, they felt blind. RBAC in XOLOX isn\'t just permissions — it\'s the right surface area per role.',
    principle: 'An Agent cannot even access the URL of a lead not assigned to them — HTTP 404, not 403. 403 reveals the lead exists. 404 does not.',
  },
]

const PERSONAS = [
  {
    id: 'P-01', name: 'Rahul Verma', archetype: 'The Juggler — Junior Counsellor',
    age: 24, role: 'CPA Admissions Counsellor (6 months)', leadLoad: '35–50 active leads',
    tools: ['Personal WhatsApp', 'Shared Google Sheet', 'LeadSquared (lead entry only)', 'Personal notepad'],
    quote: 'I have 45 leads but I only really "know" about 15 of them. The other 30 are just names in a spreadsheet I haven\'t called in a while.',
    goals: ['Never miss a follow-up — leads should not slip because he forgot', 'Sound knowledgeable and prepared on every call', 'Hit his monthly enrollment target (3–4 enrollments)'],
    frustrations: ['Forgets what he discussed with leads after 3–4 days', 'No way to prioritize — calls whoever he remembers or whoever WhatsApp\'d last', 'Manager asks for updates and he has to manually recall — stressful', 'Sees leads converting elsewhere that he "was working on"'],
    pain_points: ['Morning: 30 mins deciding who to call (should be 0 mins)', 'During calls: 2–4 mins finding context before conversation starts (should be 5 seconds)', 'End of day: mental gymnastics to remember tomorrow\'s follow-ups (should be automatic)'],
    success: 'I open XOLOX, see exactly who I need to call today and why, have their full context before I dial, log the call in 20 seconds, and my next follow-up is automatically set.',
    state: 'Eager but anxious. Knows he\'s losing leads but doesn\'t know which ones or why.',
    color: '#6366F1',
  },
  {
    id: 'P-02', name: 'Divya Krishnan', archetype: 'The Invisible Manager',
    age: 33, role: 'Sales Manager — CPA Team', leadLoad: 'Manages 8 counsellors',
    tools: ['Excel (consolidated from 8 counsellors manually)', 'WhatsApp for team coordination', 'LeadSquared (rarely)'],
    quote: 'I know my team\'s monthly conversion rate. I have no idea what\'s happening in any individual lead right now. I\'m managing the number, not the pipeline.',
    goals: ['Catch at-risk leads before they\'re lost — not after', 'Coach counsellors on specific conversation quality, not just rate', 'Run a weekly pipeline review without 3 hours of Excel prep', 'Onboard new counsellors to full productivity within 1 week'],
    frustrations: ['Can\'t see what counsellors are doing in real time — relies on verbal updates', 'Doesn\'t know which counsellors have stale leads until she manually asks', 'Pipeline reviews require consolidating Excel from 8 people — 3+ hours'],
    pain_points: ['Which leads have been in "Demo Scheduled" for >7 days without the demo happening', 'Which counsellors have >20 leads with no activity in 5+ days', 'Which objections cause the most drop-offs — and which counsellors handle them best'],
    success: 'I open XOLOX, see which counsellors have leads that need attention, drill into any lead and see the full history, reassign or flag for coaching — all before my 10am team call.',
    state: 'Competent and driven but operating with a blindfold.',
    color: '#10B981',
  },
  {
    id: 'P-03', name: 'Sunita Agarwal', archetype: 'The Numbers-First Sales Head',
    age: 41, role: 'Head of Sales — NorthStar Academy', leadLoad: '3 Managers · 12 Counsellors',
    tools: ['Excel (aggregated pipeline)', 'PowerPoint (leadership reports)', 'WhatsApp for team comms'],
    quote: 'I told leadership we\'d enroll 42 students this month. I made that number up. I had absolutely no data to support it. I was right, but only by luck.',
    goals: ['Data-grounded enrollment forecast she can defend in leadership meetings', 'Source quality tracking — which lead sources produce the highest-quality pipeline', 'Counsellor performance benchmarking — who is underperforming and exactly where', 'Revenue pipeline view — not just leads, but fee potential in each stage'],
    frustrations: ['Forecast accuracy is guesswork — based on vibes, not data', 'Can\'t compare counsellor quality — only has conversion rates, not pipeline quality', 'Fee collection tracking is a separate manual process in Finance'],
    pain_points: ['No confidence-interval on enrollment forecasts', 'No source-to-revenue attribution', 'No view of which stage is the biggest conversion bottleneck'],
    success: 'Every Monday I open XOLOX, see projected enrollments for the month with confidence intervals, drill down by program and counsellor, flag risks, and send a one-click pipeline report to the Director.',
    state: 'High-accountability, data-hungry, frustrated by the gap between the intelligence she needs and what current tools give her.',
    color: '#F59E0B',
  },
  {
    id: 'P-04', name: 'Pooja Mehta', archetype: 'The Fee-Ops Coordinator',
    age: 28, role: 'Finance and Operations', leadLoad: 'Handles all enrolled students',
    tools: ['Tally (invoices)', 'Razorpay (payment links)', 'Excel (installment tracker)', 'WhatsApp (coordination)'],
    quote: 'When a student confirms, Sales WhatsApps me. I create an invoice in Tally, send a Razorpay link over WhatsApp, and track installments in my own Excel. If I miss an installment reminder, no one knows.',
    goals: ['Trigger fee workflow directly from the CRM — no manual handoff', 'Track installment schedules with automatic payment reminders', 'Give the Sales Head a real revenue (not enrollment) number at month end'],
    frustrations: ['Manual invoice creation for every enrollment — 20–30 mins each', 'Installment tracking in Excel — prone to error, no automation', 'No connection between the enrollment record and the fee record'],
    pain_points: ['Every enrollment requires 5 manual steps across 4 tools', 'Missed installment reminders are invisible until the student is late', 'Revenue recognition is always delayed because fee data is separate from CRM data'],
    success: 'When counsellor marks lead "Enrolled", a fee workflow triggers automatically. Invoice generated, Razorpay link sent, installment schedule set up, reminders automated.',
    state: 'Precise and procedural. Frustrated that a highly manual process sits between a tech-savvy sales team and their revenue recognition.',
    color: '#EC4899',
  },
]

const HMW = [
  { hmw: 'How might we give counsellors a prioritized, context-rich view of their day — so they spend zero time deciding who to call next?', persona: 'P-01 Rahul' },
  { hmw: 'How might we make WhatsApp communication with leads as fast from XOLOX as from the native app — so counsellors never switch to their phone?', persona: 'P-01 Rahul' },
  { hmw: 'How might we give managers real-time, lead-level visibility so they can intervene on at-risk leads before they\'re lost?', persona: 'P-02 Divya' },
  { hmw: 'How might we make stage advancement data-validated — so pipeline stages are facts, not opinions?', persona: 'P-02 Divya + P-03 Sunita' },
  { hmw: 'How might we connect enrollment confirmation to fee workflow automatically — so Pooja never manually creates an invoice?', persona: 'P-04 Pooja' },
  { hmw: 'How might we give new counsellors structured guidance embedded in the workflow — so they\'re productive within 1 day, not 2 weeks?', persona: 'P-01 Rahul + P-02 Divya' },
]

const DESIGN_PRINCIPLES = [
  { p: 'Task-first for counsellors, pipeline-first for managers', r: 'Counsellors think in "what do I do next". Managers think in "where is the pipeline". Same data, different default views. XOLOX serves both mental models without compromise.' },
  { p: 'WhatsApp is the primary channel — not an integration', r: 'In Indian education sales, WhatsApp is the channel. The CRM must be built around this reality, not treat it as an add-on.' },
  { p: 'Stages are milestones, not labels', r: 'A stage change must represent a real event in the counselling relationship — not a drag-and-drop decision. Stage integrity is the foundation of pipeline accuracy.' },
  { p: 'Role-based access as a UX decision, not just a security decision', r: 'Each role should feel like XOLOX was built specifically for them. An agent shouldn\'t see what\'s irrelevant; a manager shouldn\'t miss what\'s necessary.' },
  { p: 'The system carries the cognitive load of follow-up — not the counsellor', r: 'High-ticket education sales requires 6+ touchpoints. The CRM must be the memory the counsellor doesn\'t have to maintain.' },
]

const PORTALS = [
  {
    id: 'PORTAL-01', name: 'Super Admin Portal', url: 'admin.xolox.io',
    users: 'Platform owner · IT Admin',
    purpose: 'Multi-tenant config, tenant management, system health, billing',
    access: 'Unrestricted — cross-tenant visibility',
    usage: 'Low (configuration, not operations)',
    color: '#F59E0B',
    nav: [
      { id: 'SA-01', label: 'Dashboard', subs: ['Platform Overview', 'Tenant Health', 'Active Users', 'System Alerts'] },
      { id: 'SA-02', label: 'Tenants', subs: ['Tenant List', 'Tenant Detail', 'Create Tenant', 'Tenant Config', 'Tenant Plan'] },
      { id: 'SA-03', label: 'Users', subs: ['All Users (cross-tenant)', 'User Detail', 'Role Assignment', 'Audit Log'] },
      { id: 'SA-04', label: 'Plans & Billing', subs: ['Plan List', 'Plan Builder', 'Billing History', 'Invoice Generator'] },
      { id: 'SA-05', label: 'Integrations', subs: ['WhatsApp WABA Config', 'SMS DLT Config', 'Razorpay Config', 'Email SMTP', 'IVR Config', 'API Keys'] },
      { id: 'SA-06', label: 'Support Tickets', subs: ['Ticket Queue', 'Ticket Detail', 'Knowledge Base', 'SLA Config'] },
      { id: 'SA-07', label: 'Settings', subs: ['Platform Config', 'Security Settings', 'Audit Logs', 'Backup & Recovery'] },
    ],
  },
  {
    id: 'PORTAL-02', name: 'Manager / Admin Portal', url: 'app.xolox.io (Manager scope)',
    users: 'Sales Manager · Sales Head · Ops Admin',
    purpose: 'Pipeline management, counsellor oversight, lead assignment, analytics, configuration',
    access: 'Tenant-scoped + team-scoped',
    usage: 'High — primary operational home for managers',
    color: '#6366F1',
    nav: [
      { id: 'MA-01', label: 'Dashboard', note: 'Default: At-risk leads, SLA breaches, today\'s scheduled activities', subs: ['Team Overview', 'My Pipeline', 'At-Risk Leads', 'Today\'s Schedule', 'Conversion Funnel', 'Source Performance'] },
      { id: 'MA-02', label: 'Leads', subs: ['All Leads (team scope)', 'Lead Detail', 'Lead Import (CSV / Meta / Google)', 'Assignment Rules', 'Duplicate Detection', 'Unassigned Queue'] },
      { id: 'MA-03', label: 'Pipeline', subs: ['Stage Kanban (team)', 'List View (filterable)', 'Forecast View', 'Stage Transition History', 'Stale Leads Flag'] },
      { id: 'MA-04', label: 'Counsellors', subs: ['Team List', 'Counsellor Profile', 'Lead Load View', 'Call Activity Log', 'Target vs Actual', 'Onboarding Status'] },
      { id: 'MA-05', label: 'Campaigns', subs: ['WhatsApp Campaigns', 'SMS Campaigns', 'Email Campaigns', 'Drip Sequences', 'Template Library', 'Campaign Analytics'] },
      { id: 'MA-06', label: 'Workflows', subs: ['Automation Rules', 'Lead Routing Rules', 'Follow-up Sequences', 'Stage Advancement Rules', 'SLA Config', 'Notification Rules'] },
      { id: 'MA-07', label: 'Reports', subs: ['Enrollment Forecast', 'Source Quality', 'Counsellor Performance', 'Stage Conversion Funnel', 'Revenue Pipeline', 'Call Activity', 'WhatsApp Engagement', 'Custom Reports'] },
      { id: 'MA-08', label: 'Fee & Payments', subs: ['Fee Dashboard', 'Invoices', 'Payment Plans', 'Installment Tracker', 'Overdue Alerts', 'Razorpay Reconciliation'] },
      { id: 'MA-09', label: 'Settings', subs: ['Pipeline Stages + Rules', 'Custom Fields', 'Lead Sources', 'Programs (CPA/CMA/ACCA/EA)', 'WhatsApp Templates (WABA)', 'SMS Templates (DLT)', 'Roles & Permissions', 'Team Members', 'Integrations'] },
    ],
  },
  {
    id: 'PORTAL-03', name: 'Agent Portal', url: 'app.xolox.io (Agent scope — same URL, scope-isolated)',
    users: 'Junior and Senior Counsellors',
    purpose: 'Work assigned leads, log calls, send WhatsApp, complete tasks, advance stages',
    access: 'Strictly scoped to assigned leads only. Out-of-scope lead URL → HTTP 404 (not 403 — deliberate)',
    usage: 'Very high — counsellors\' primary work surface all day',
    color: '#10B981',
    nav: [
      { id: 'AG-01', label: 'My Day', note: 'Default home — prioritized task list, not a pipeline', subs: ['Today\'s Tasks (prioritized)', 'Overdue Actions', 'Scheduled Demos Today', 'New Leads (immediate action)', 'Follow-Ups Due'] },
      { id: 'AG-02', label: 'My Leads', subs: ['Lead List (assigned to me)', 'Lead Detail Page', 'Stage View (my pipeline)', 'Search & Filter'] },
      { id: 'AG-03', label: 'Calls', subs: ['Call Log (my history)', 'IVR Call Modal (active call)', 'Call Notes', 'Call Recordings'] },
      { id: 'AG-04', label: 'WhatsApp', subs: ['WhatsApp Inbox (lead conversations)', 'Template Sender', 'Broadcast (if permitted)'] },
      { id: 'AG-05', label: 'Notifications', subs: ['All Notifications', 'Lead Assignment Alerts', 'Follow-Up Reminders', 'Manager Comments on My Leads'] },
    ],
  },
]

const RBAC_LAYERS = [
  { layer: 1, name: 'Platform Level', desc: 'Super Admin defines what capabilities exist. A tenant cannot enable a feature not provisioned to their plan.' },
  { layer: 2, name: 'Role Definition', desc: 'Tenant Admin defines roles (Sales Head, Manager, Senior/Junior Counsellor, Finance, Ops). Each role has a permission ceiling.' },
  { layer: 3, name: 'User Override', desc: 'Individual users can be granted permissions within their role ceiling — never above it. Escalation is architecturally impossible.' },
  { layer: 4, name: 'Dynamic Scope Filter', desc: 'Even with permission, access is always scoped. A Manager sees only their team\'s leads. A Counsellor sees only their own. Out-of-scope URL → HTTP 404.' },
]

const ROLES = [
  { role: 'Super Admin', scope: 'Cross-tenant. Full platform control.', portal: 'admin.xolox.io only', perms: ['All platform capabilities'] },
  { role: 'Tenant Admin', scope: 'Single tenant. Full tenant control.', portal: 'Manager scope', perms: ['Full tenant configuration'] },
  { role: 'Sales Head', scope: 'All teams within tenant', portal: 'Manager scope (elevated)', perms: ['Enrollment forecasting', 'Cross-team reports', 'Delete leads', 'Configure programs'] },
  { role: 'Sales Manager', scope: 'Assigned team only', portal: 'Manager scope (team-scoped)', perms: ['View team pipeline', 'Reassign leads', 'Set counsellor targets', 'Approve stage advances'] },
  { role: 'Senior Counsellor', scope: 'Assigned leads only', portal: 'Agent scope', perms: ['Send WhatsApp campaigns (if granted)', 'Create tasks for others (if granted)', 'Own performance reports'] },
  { role: 'Junior Counsellor', scope: 'Assigned leads only', portal: 'Agent scope (restricted)', perms: ['Log calls and notes', 'Send individual WhatsApp', 'Complete tasks'] },
  { role: 'Finance / Ops', scope: 'Enrolled leads only', portal: 'Fee & Payments module only', perms: ['Generate invoices', 'Track installments', 'Send payment links', 'Fee reports'] },
]

const UX_FLOWS = [
  {
    id: 'UXF-01', name: 'New Lead Arrives — Assignment to First Contact',
    actor: 'System → Manager (assignment) → Counsellor (first contact)',
    trigger: 'Lead submits inquiry form or arrives via Meta Ads / Google Ads / IndiaMart',
    goal: 'Lead assigned to right counsellor and contacted within 30 minutes of inquiry',
    criticality: 'Highest-impact flow — leads contacted within 30 min have 3.4× higher qualification rate',
    steps: [
      { n: 1, actor: 'System', screen: 'Background Processing', action: 'Lead arrives via form webhook, Meta Ads API, or CSV. Duplicate detection runs.', decision: 'If duplicate → merge with existing record, flag counsellor. If new → proceed to auto-assignment.' },
      { n: 2, actor: 'System', screen: 'Background Processing', action: 'Auto-assignment rules evaluate: program of interest, lead source, geography, counsellor capacity, round-robin queue.', decision: 'Lead assigned to lowest-load counsellor in the relevant program queue.' },
      { n: 3, actor: 'Counsellor', screen: 'My Day — New Lead Card', action: 'Rahul receives push notification: "New Lead — CPA Interest — Maharashtra — Respond within 30 min". New lead card appears at top of My Day with red NEW badge and countdown timer.', decision: 'SLA timer is visible to both counsellor AND manager. If counsellor doesn\'t act, manager sees a breach alert — not after the fact.' },
      { n: 4, actor: 'Counsellor', screen: 'Lead Brief — Quick Glance', action: 'Rahul taps the lead card before calling. Sees lead brief: name, phone, program interest, source, AI lead score, any prior interaction history. Scans in <5 seconds.', decision: null },
      { n: 5, actor: 'Counsellor', screen: 'IVR Call Modal', action: 'Rahul taps Call. IVR modal opens. Call initiated via integrated IVR. Recording starts automatically for QA.', decision: 'AI Talk Track suggestion panel shown: "Lead is interested in CPA USA — suggest starting with ROI of certification."' },
      { n: 6, actor: 'Counsellor', screen: 'Post-Call Panel (mandatory gate)', action: 'Call ends. Post-call panel appears. Mandatory completion before moving to next lead.', decision: 'Mandatory fields: Call Outcome, Call Notes, Stage Advance?, Next Follow-up (date + time + mode). Designed to complete in 60 seconds — prototyped and timed against 12 counsellors (median: 48 sec).' },
      { n: 7, actor: 'System', screen: 'Lead Card — Updated', action: 'Post-call data saved. Follow-up task created for the date Rahul specified. Manager sees lead updated in team pipeline. SLA timer cleared.', decision: null },
    ],
    edge_cases: [
      'Duplicate lead: System shows "Existing lead found — last contacted 3 days ago by Rahul." Options: Merge / Keep Separate / Reassign',
      'SLA timer expires: Manager push notification → "SLA Breach — Arjun Mehta — Assigned to Rahul — 30min without contact"',
      'No answer on call: Post-call panel still appears with "No Answer" pre-selected. Next callback auto-scheduled +3 hours.',
    ],
    metrics: ['Time to first contact (SLA)', 'SLA breach rate', 'First-call connection rate', 'Post-call panel completion rate'],
  },
  {
    id: 'UXF-02', name: 'Counsellor Works Their Pipeline — My Day Task Flow',
    actor: 'Counsellor (Rahul)',
    trigger: 'Rahul logs into XOLOX at the start of his day',
    goal: 'Rahul works through his entire day without deciding what to do next — the system decides. He only executes.',
    criticality: 'Highest-frequency flow — every counsellor, every day',
    steps: [
      { n: 1, actor: 'Rahul', screen: 'Agent Portal — My Day', action: 'Rahul logs in. Lands on My Day — his prioritized task list.', decision: 'Task cards sorted by priority: 1. New leads (red) → 2. Overdue follow-ups (amber) → 3. Today\'s follow-ups (white) → 4. Demos today (blue) → 5. Low-priority (grey). Total: "You have 14 actions today." Zero decisions required — Rahul works top-to-bottom.' },
      { n: 2, actor: 'Rahul', screen: 'Task Card — Expanded Inline', action: 'Rahul clicks top task: "Call Priya Nair — Follow-up 3 — She asked about installments." Task expands inline with: lead name, why this task (his own note from last call), AI suggestion on what to discuss, one-tap actions: Call / WhatsApp / Reschedule / Mark No Answer.', decision: null },
      { n: 3, actor: 'Rahul', screen: 'Lead Detail Page', action: 'Rahul taps "View Full Lead." Lead Detail shows 16 data zones: name, phone, program, stage, AI Strength (Strong/Moderate/Weak). Full timeline: every call, WhatsApp, note, stage change. Right panel: AI Next Action recommendation.', decision: null },
      { n: 4, actor: 'Rahul', screen: 'IVR Modal → Post-Call Panel', action: 'Rahul calls Priya. She wants to discuss with spouse. Post-call: Outcome "Callback - Partner Decision", note, stage "Negotiation". Next follow-up auto-suggested: Thursday 10am. WhatsApp template pre-populated with installment plan — Rahul approves, sent automatically.', decision: 'WhatsApp templates are pre-populated from conversation context. Rahul reviews and sends — doesn\'t compose from scratch.' },
      { n: 5, actor: 'System', screen: 'My Day — Refreshed', action: 'Task marked complete, greyed out, moved to Done. Next priority card at top. Progress bar: "3/14 actions done."', decision: 'My Day is the agent\'s default homepage — not a pipeline kanban. Kanban exists under My Leads but is never the primary surface.' },
    ],
    edge_cases: [
      'All tasks completed before end of day: My Day shows "Great work — all actions done. 2 proactive calls suggested." — AI surfaces leads worth reaching out to even without a scheduled task',
      'Rahul tries to skip a task without completing it: Soft confirmation: "Mark this as skipped? It will move to Overdue tomorrow." — forces a conscious decision',
    ],
    metrics: ['Tasks completed per day per counsellor', 'Overdue task rate', 'WhatsApp template usage rate', 'Time in My Day vs other sections'],
  },
  {
    id: 'UXF-03', name: 'Lead Stage Advancement — Data-Validated',
    actor: 'Counsellor advancing lead from "Contacted" to "Demo Scheduled"',
    trigger: 'Counsellor believes lead is ready for the next stage',
    goal: 'Stage change is recorded with verified criteria — no free-form stage manipulation',
    criticality: 'Foundation of pipeline accuracy — this flow is why stage data is trustworthy',
    steps: [
      { n: 1, actor: 'Rahul', screen: 'Lead Detail — Stage Section', action: 'Rahul clicks "Advance Stage" on the lead card.', decision: 'Stage advance modal opens. Current: "Contacted". Proposed next: "Demo Scheduled". Checklist appears — configured by the Manager in Settings → Pipeline Stages.' },
      { n: 2, actor: 'Rahul', screen: 'Stage Advance Modal — Checklist', action: 'Rahul reviews required conditions for "Demo Scheduled": Lead contacted at least once / Lead confirmed interest / Demo date and time agreed / Demo platform confirmed. Cannot advance until all items checked.', decision: 'This checklist transforms "Demo Scheduled" from a label to a fact. The system has verified 4 conditions are true. This single change moved stage accuracy from 23% to 91% in 2 weeks of piloting.' },
      { n: 3, actor: 'Rahul', screen: 'Stage Advance Modal — Demo Details', action: 'Rahul enters demo date and time. Calendar invite option. WhatsApp confirmation to lead auto-populated.', decision: null },
      { n: 4, actor: 'System', screen: 'Lead Detail — Updated', action: 'Stage advances. WhatsApp sent to lead: "Your demo for CPA USA is confirmed for Thursday 2pm. [NSA Meets link]". Reminders auto-scheduled: 24hr + 1hr. Manager notified of pipeline movement. Stage change logged in timeline.', decision: null },
    ],
    edge_cases: [
      'Counsellor tries to advance without checklist complete: "Complete Advance" button disabled. Tooltip shows pending items.',
      'Manager configured "Approval Required" for this stage transition: Advance request queued for Manager. Lead shows "Stage Advance Pending Approval".',
      'Demo is missed (no-show): System detects demo time passed without stage advancement. Flags lead "Demo Missed — Requires Follow-Up". Task created automatically.',
    ],
    metrics: ['Stage accuracy rate', 'Avg time in each stage', 'Checklist completion rate', 'Demo no-show rate'],
  },
  {
    id: 'UXF-04', name: 'Manager Reviews Pipeline — At-Risk Lead Intervention',
    actor: 'Divya (Sales Manager)',
    trigger: 'Divya opens XOLOX at 9:30am before her 10am team call',
    goal: 'Identify at-risk leads, intervene before they\'re lost, coach counsellors in context',
    criticality: 'Manager flow — directly maps to INS-05 and the shift from month-end to real-time coaching',
    steps: [
      { n: 1, actor: 'Divya', screen: 'Manager Dashboard', action: 'Divya lands on Manager Dashboard. Hero row: Active Leads (87), At-Risk Leads (12 — red, clickable), Demos Today (5), SLA Breaches (2 — red), New Leads Today (8). Below: Counsellor Performance Table — each counsellor, open leads, last activity, conversion this month, SLA breach count.', decision: 'Dashboard defaults to problems requiring attention — not a summary of good news. At-Risk and SLA Breach numbers are prominently red and immediately clickable. This is the design principle: surface the fire, not the painting.' },
      { n: 2, actor: 'Divya', screen: 'At-Risk Leads View', action: 'Divya clicks "At-Risk Leads (12)". List of 12 leads with risk reason per lead: "No activity in 7 days" / "Demo no-show — uncalled since" / "Promised callback missed ×3". Assigned counsellor shown. Quick actions: Reassign / Flag for Coaching / Add Manager Note.', decision: null },
      { n: 3, actor: 'Divya', screen: 'Lead Detail — Full Context', action: 'Divya clicks into lead "Karan Joshi" — risk: "Demo no-show 3 days ago, no follow-up." Full lead timeline visible: calls, WhatsApp, notes, stage changes. She can see exactly that Rahul hasn\'t called since the missed demo.', decision: 'Manager has read access to the full conversation timeline of any lead in their team — including call recordings if enabled. This is the coaching surface.' },
      { n: 4, actor: 'Divya', screen: 'Lead Detail — Manager Actions', action: 'Divya leaves a coaching note: "@Rahul — Call Karan today before 2pm. Missed demo leads convert if re-engaged within 72hrs." She clicks "Flag as High Priority" — the lead jumps to top of Rahul\'s My Day.', decision: 'Manager notes are visible to the assigned counsellor — not to the lead. This creates a coaching layer inside the active workflow without creating a separate communication channel.' },
      { n: 5, actor: 'Divya', screen: 'Counsellor Performance Table', action: 'Divya returns to dashboard. Reviews counsellor load table. Notices one counsellor has 48 open leads (others have 20–25). Uses "Rebalance Load" to reassign 15 leads from overloaded counsellor to one with spare capacity.', decision: 'Load rebalancing is a 1-click action from the counsellor table — not a multi-step process through the lead list.' },
    ],
    edge_cases: [
      'Divya tries to reassign a lead that\'s in active call: System shows "Counsellor is currently on a call with this lead — reassign after call ends?" with option to set deferred reassignment.',
      'Counsellor already has 50+ leads (max capacity): System warns "Rahul is at capacity — reassigning may hurt his performance. Confirm?"',
    ],
    metrics: ['At-risk lead rescue rate (re-engaged within 48hrs after manager intervention)', 'Manager coaching note response rate', 'Team SLA breach rate', 'Lead load balance index'],
  },
  {
    id: 'UXF-05', name: 'Enrollment Confirmed — Fee Workflow Trigger (Pooja)',
    actor: 'Counsellor (marks enrolled) → System (triggers fee workflow) → Finance/Ops (Pooja)',
    trigger: 'Counsellor marks a lead as "Enrolled" after verbal confirmation',
    goal: 'Fee collection workflow begins automatically — invoice generated, payment link sent, installments scheduled, all without a manual handoff',
    criticality: 'Closes the loop between sales and finance — eliminates 5-step manual process per enrollment',
    steps: [
      { n: 1, actor: 'Counsellor', screen: 'Lead Detail — Stage Advance', action: 'Counsellor completes checklist for "Enrolled" stage: Verbal confirmation received / Program and batch confirmed / Fee amount agreed. Checks all items, clicks "Confirm Enrollment".', decision: null },
      { n: 2, actor: 'System', screen: 'Background Processing', action: 'Enrollment confirmed. Fee workflow auto-triggered. Enrollment record created with: student name, program, batch, agreed fee, payment plan (full / installments), enrollment date.', decision: 'The fee workflow trigger is automatic and immediate — no WhatsApp to Pooja, no manual handoff. This was the key design requirement from JTBD-08.' },
      { n: 3, actor: 'Pooja', screen: 'Fee Dashboard — New Enrollment Alert', action: 'Pooja sees notification: "New Enrollment — Karan Joshi — CPA USA — Batch Jan 2025 — Fee ₹1,85,000 — 3 installments". Opens enrollment record — all details pre-populated from the CRM. Fee plan pre-configured per program defaults.', decision: null },
      { n: 4, actor: 'Pooja', screen: 'Invoice Generator', action: 'Pooja reviews auto-generated invoice (pulled from enrollment record). Edits if needed (e.g., scholarship adjustment). Clicks "Send Invoice + Payment Link". Razorpay link generated. Invoice + link sent to student via WhatsApp and email — from XOLOX.', decision: 'Invoice is auto-generated from enrollment data — Pooja reviews, not creates. Average time reduced from 25 mins to 3 mins.' },
      { n: 5, actor: 'System', screen: 'Installment Tracker — Active', action: 'Installment schedule created based on plan (Installment 1: ₹75,000 due now, Installment 2: ₹55,000 due in 30 days, Installment 3: ₹55,000 due in 60 days). Payment reminders auto-scheduled 3 days before each due date. Dashboard shows real-time payment status.', decision: 'Reminders are automatically sent without Pooja needing to remember. If a payment is late, Pooja is alerted, and the student gets a polite follow-up via WhatsApp.' },
    ],
    edge_cases: [
      'Student requests fee revision after counsellor marks enrolled: Finance edit permission allows Pooja to update fee and regenerate invoice without CRM stage change.',
      'Razorpay payment fails: System flags failed payment in installment tracker. Pooja notified. WhatsApp retry message sent to student with updated payment link.',
      'Installment overdue by >7 days: Escalation alert to Sales Manager — counsellor may need to re-engage with student.',
    ],
    metrics: ['Time from enrollment confirmation to invoice sent', 'Payment link click rate', 'Installment on-time rate', 'Pooja manual intervention rate per enrollment'],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FlowViewer({ flows }) {
  const [active, setActive] = useState(0)
  const flow = flows[active]
  return (
    <div className="xl-flow-viewer">
      <div className="xl-flow-tabs">
        {flows.map((f, i) => (
          <button key={f.id} className={`xl-flow-tab${i === active ? ' active' : ''}`} onClick={() => setActive(i)}>
            <span className="xl-flow-tab-id">{f.id}</span>
            <span className="xl-flow-tab-name">{f.name}</span>
          </button>
        ))}
      </div>
      <div className="xl-flow-meta-bar">
        <div className="xl-fmeta"><span className="xl-fmeta-k">Actor</span><span className="xl-fmeta-v">{flow.actor}</span></div>
        <div className="xl-fmeta"><span className="xl-fmeta-k">Trigger</span><span className="xl-fmeta-v">{flow.trigger}</span></div>
        <div className="xl-fmeta xl-fmeta--goal"><span className="xl-fmeta-k">Goal</span><span className="xl-fmeta-v">{flow.goal}</span></div>
      </div>
      {flow.criticality && (
        <div className="xl-flow-criticality">
          <span className="xl-crit-icon">⚡</span> {flow.criticality}
        </div>
      )}
      <div className="xl-flow-steps">
        {flow.steps.map((s, i) => (
          <div className="xl-flow-step" key={s.n}>
            <div className="xl-step-spine">
              <div className="xl-step-circle">{s.n}</div>
              {i < flow.steps.length - 1 && <div className="xl-step-line" />}
            </div>
            <div className="xl-step-body">
              <div className="xl-step-header">
                <span className="xl-step-screen">{s.screen}</span>
                {s.actor && <span className="xl-step-actor">{s.actor}</span>}
              </div>
              <p className="xl-step-action">{s.action}</p>
              {s.decision && (
                <div className="xl-step-decision">
                  <span className="xl-decision-pill">Design Decision</span>
                  {s.decision}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="xl-flow-edge">
        <div className="xl-flow-sub-label">Edge Cases</div>
        {flow.edge_cases.map((e, i) => (
          <div className="xl-edge-case" key={i}><span className="xl-edge-icon">⚠</span><span>{e}</span></div>
        ))}
      </div>
      <div className="xl-flow-metrics-row">
        <div className="xl-flow-sub-label">Metrics Tracked</div>
        <div className="xl-metrics-tags">
          {flow.metrics.map(m => <span className="xl-metric-tag" key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function XoloxCaseStudy() {
  const navigate = useNavigate()
  const pageRef = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.xl-reveal').forEach(el => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
      gsap.utils.toArray('.xl-reveal-stagger').forEach(parent => {
        gsap.fromTo(Array.from(parent.children), { y: 32, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: parent, start: 'top 90%' },
        })
      })
      COVER_KPIS.forEach(({ id, to, suffix }) => {
        const el = document.querySelector('#' + id)
        if (!el) return
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: to, duration: 2.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate() { el.textContent = Math.round(proxy.val) + suffix },
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <motion.div ref={pageRef} className="xl-page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

      <button className="xl-back-btn" onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Back
      </button>

      {/* ══ COVER ═══════════════════════════════════════════════════════════ */}
      <header className="xl-cover">
        <div className="xl-cover-bg" aria-hidden="true" />
        <div className="xl-cover-grid-lines" aria-hidden="true" />

        <div className="xl-cover-inner container">
          <div className="xl-cover-meta">
            <span className="xl-eyebrow">Case Study</span>
            <span className="xl-cover-type">{META.product_type}</span>
          </div>

          <h1 className="xl-cover-title">
            XOLOX <span className="xl-cover-crm">CRM</span>
          </h1>

          <p className="xl-cover-subtitle">
            Education Sales CRM built for high-ticket counselling teams — replacing spreadsheets,
            WhatsApp chaos, and LeadSquared workarounds with a role-native system that mirrors
            how CPA, CMA & ACCA enrollment actually works.
          </p>

          <div className="xl-cover-pills">
            {[META.positioning, META.role].map(t => (
              <span key={t} className="xl-cover-pill">{t}</span>
            ))}
          </div>

          <div className="xl-cover-kpis">
            {COVER_KPIS.map(k => (
              <div className="xl-cover-kpi" key={k.id}>
                <span id={k.id} className="xl-kpi-value">{k.to}{k.suffix}</span>
                <span className="xl-kpi-label">{k.label}</span>
              </div>
            ))}
          </div>

          <div className="xl-cover-scope">
            <div className="xl-scope-item"><span className="xl-scope-k">Scope</span><span>{META.scope}</span></div>
            <div className="xl-scope-item"><span className="xl-scope-k">Timeline</span><span>{META.timeline}</span></div>
            <div className="xl-scope-item"><span className="xl-scope-k">Status</span><span className="xl-status-pill">{META.status}</span></div>
          </div>
        </div>

        <div className="xl-scroll-hint">
          <div className="xl-scroll-mouse"><div className="xl-scroll-wheel" /></div>
          <span>Scroll</span>
        </div>
      </header>

      <div className="container xl-content">

        {/* ══ CH01 — EXECUTIVE SUMMARY ════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">01</span>
            <span className="xl-eyebrow">Executive Summary</span>
          </div>

          <div className="xl-exec-grid xl-reveal-stagger">
            <div className="xl-exec-card xl-exec-card--problem">
              <span className="xl-exec-tag">Problem</span>
              <p>Education counselling teams were managing high-ticket leads (₹50K–₹3L decisions) on WhatsApp, Excel, and generic CRMs that had no concept of counselling stages, follow-up cadences, or the emotional sales journey of a student deciding to invest in a professional certification.</p>
            </div>
            <div className="xl-exec-card xl-exec-card--solution">
              <span className="xl-exec-tag">Solution</span>
              <p>XOLOX is a counsellor-native CRM that mirrors the education sales funnel — from first inquiry to fee payment — with AI-assisted follow-ups, WhatsApp-first communication, multi-granular role access, and real-time counsellor performance tracking.</p>
            </div>
          </div>

          <div className="xl-design-challenge xl-reveal">
            <span className="xl-dc-label">Design Challenge</span>
            <p className="xl-dc-text">How do you build a CRM that's deep enough for a Sales Head monitoring 15 counsellors and simple enough for a first-week counsellor handling their first 30 leads — without building two products?</p>
          </div>

          <div className="xl-outcomes xl-reveal-stagger">
            {[
              { stat: '22 min', label: 'First counsellor contact', sub: 'Down from avg 4.2 hours' },
              { stat: '81%', label: 'Follow-up task completion', sub: 'Up from 34%' },
              { stat: '100%', label: 'Leads trackable by stage', sub: 'vs 0% before (all in personal WhatsApp)' },
              { stat: '1 day', label: 'New counsellor to productive', sub: 'vs 1–2 weeks on LeadSquared' },
              { stat: '8%', label: 'Forecast accuracy margin', sub: 'Sales Head now forecasts within 8% (vs guesswork)' },
            ].map(o => (
              <div className="xl-outcome" key={o.stat}>
                <span className="xl-outcome-num">{o.stat}</span>
                <span className="xl-outcome-label">{o.label}</span>
                <span className="xl-outcome-sub">{o.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH02 — DISCOVERY ════════════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">02</span>
            <span className="xl-eyebrow">Discovery Phase</span>
          </div>

          <h2 className="xl-section-title xl-reveal">
            3 weeks embedded in the team. <span className="xl-indigo">120 leads audited.</span>{' '}
            One brutal root cause.
          </h2>

          <div className="xl-context-box xl-reveal">
            <span className="xl-context-label">Context</span>
            <p>XOLOX was built at NorthStar Academy — an AICPA Gold Partner CPA coaching institute in Hyderabad and Bangalore. Before XOLOX, the 12-person counselling team was running entirely on WhatsApp Business app (personal phones), a Google Sheets pipeline, and a poorly-configured LeadSquared account that no one used correctly.</p>
          </div>

          <div className="xl-research-grid xl-reveal-stagger">
            {RESEARCH_METHODS.map(r => (
              <div className="xl-research-card" key={r.num}>
                <div className="xl-research-header">
                  <span className="xl-research-num">{r.num}</span>
                  <div className="xl-research-n">
                    <span className="xl-n-val">{r.n}</span>
                    <span className="xl-n-label">{r.label}</span>
                  </div>
                </div>
                <h3 className="xl-research-method">{r.method}</h3>
                {r.duration && <p className="xl-research-duration">{r.duration}</p>}
                {r.breakdown && (
                  <div className="xl-research-breakdown">
                    {r.breakdown.map(b => <span key={b} className="xl-breakdown-pill">{b}</span>)}
                  </div>
                )}
                <ul className="xl-research-findings">
                  {r.findings.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH03 — SYNTHESIS ════════════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">03</span>
            <span className="xl-eyebrow">Synthesis & Insights</span>
          </div>

          <h2 className="xl-section-title xl-reveal">
            5 failure patterns. 8 jobs to be done. 6 insights that{' '}
            <span className="xl-indigo">governed every product decision</span>.
          </h2>

          {/* Affinity themes */}
          <h3 className="xl-sub-heading xl-reveal">Affinity Map — Why the System Was Failing</h3>
          <div className="xl-affinity-grid xl-reveal-stagger">
            {AFFINITY_THEMES.map(a => (
              <div className="xl-affinity-card" key={a.theme}>
                <span className="xl-affinity-icon">{a.icon}</span>
                <h4 className="xl-affinity-theme">{a.theme}</h4>
                <p className="xl-affinity-desc">{a.desc}</p>
                <div className="xl-affinity-risk"><span className="xl-risk-label">Risk →</span> {a.risk}</div>
              </div>
            ))}
          </div>

          {/* JTBDs */}
          <h3 className="xl-sub-heading xl-reveal" style={{ marginTop: '3.5rem' }}>Jobs To Be Done</h3>
          <div className="xl-jtbd-list xl-reveal-stagger">
            {JTBDS.map(j => (
              <div className="xl-jtbd" key={j.id}>
                <div className="xl-jtbd-header">
                  <span className="xl-jtbd-id">{j.id}</span>
                  <span className="xl-jtbd-actor">{j.actor}</span>
                  <span className="xl-jtbd-freq">{j.freq}</span>
                  <span className="xl-jtbd-driver">{j.driver}</span>
                </div>
                <p className="xl-jtbd-job">"{j.job}"</p>
                <div className="xl-jtbd-workaround"><span className="xl-wa-label">Current workaround →</span> {j.workaround}</div>
              </div>
            ))}
          </div>

          {/* Key Insights */}
          <h3 className="xl-sub-heading xl-reveal" style={{ marginTop: '3.5rem' }}>Key Insights</h3>
          <div className="xl-insights xl-reveal-stagger">
            {KEY_INSIGHTS.map(ins => (
              <div className="xl-insight" key={ins.id}>
                <span className="xl-insight-id">{ins.id}</span>
                <div>
                  <h4 className="xl-insight-title">{ins.insight}</h4>
                  <p className="xl-insight-evidence"><em>Evidence:</em> {ins.evidence}</p>
                  <p className="xl-insight-principle"><em>Design principle:</em> {ins.principle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH04 — PERSONAS ══════════════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">04</span>
            <span className="xl-eyebrow">Personas</span>
          </div>

          <h2 className="xl-section-title xl-reveal">
            Four roles. Four completely different{' '}
            <span className="xl-indigo">relationships with the same pipeline data</span>.
          </h2>

          <div className="xl-personas xl-reveal-stagger">
            {PERSONAS.map(p => (
              <div className="xl-persona" key={p.id} style={{ '--p-color': p.color }}>
                <div className="xl-persona-top">
                  <span className="xl-persona-id">{p.id}</span>
                  <h3 className="xl-persona-name" style={{ color: p.color }}>{p.name}</h3>
                  <span className="xl-persona-arch">"{p.archetype}"</span>
                </div>

                <blockquote className="xl-persona-quote">"{p.quote}"</blockquote>

                <div className="xl-persona-meta">
                  {[['Age', p.age], ['Role', p.role], ['Load', p.leadLoad]].map(([k, v]) => (
                    <div className="xl-pmeta" key={k}>
                      <span className="xl-pmeta-k">{k}</span>
                      <span className="xl-pmeta-v">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="xl-persona-tools">
                  <div className="xl-ps-label">Tools currently used</div>
                  <div className="xl-tools-row">
                    {p.tools.map(t => <span key={t} className="xl-tool-pill">{t}</span>)}
                  </div>
                </div>

                <div className="xl-persona-cols">
                  <div>
                    <div className="xl-ps-label xl-ps-label--goal">Goals</div>
                    <ul className="xl-ps-list">{p.goals.map(g => <li key={g}>{g}</li>)}</ul>
                  </div>
                  <div>
                    <div className="xl-ps-label xl-ps-label--pain">Frustrations</div>
                    <ul className="xl-ps-list xl-ps-list--pain">{p.frustrations.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                </div>

                <div className="xl-persona-pain-row">
                  <div className="xl-ps-label xl-ps-label--pain">Daily Pain Points</div>
                  <ul className="xl-ps-list xl-ps-list--pain">{p.pain_points.map(pp => <li key={pp}>{pp}</li>)}</ul>
                </div>

                <div className="xl-persona-success">
                  <span className="xl-success-label">Success looks like →</span> {p.success}
                </div>
                <div className="xl-persona-state">{p.state}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH05 — PROBLEM FRAMING ══════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">05</span>
            <span className="xl-eyebrow">Problem Framing</span>
          </div>

          <h2 className="xl-section-title xl-reveal">
            One problem statement. Six How Might We questions.{' '}
            <span className="xl-indigo">Five principles that held through every design decision</span>.
          </h2>

          <div className="xl-problem-statement xl-reveal">
            <span className="xl-ps-eyebrow">Core Problem Statement</span>
            <p>Education counselling teams at coaching institutes are running high-ticket sales pipelines (₹50K–₹3L decisions requiring 6–10 touchpoints over 2–4 weeks) on tools designed for neither — resulting in lead leakage at every stage, invisible pipeline health, counsellors operating from memory, and managers who can't coach because they can't see.</p>
          </div>

          <h3 className="xl-sub-heading xl-reveal" style={{ marginTop: '2.5rem' }}>How Might We</h3>
          <div className="xl-hmw-list xl-reveal-stagger">
            {HMW.map((h, i) => (
              <div className="xl-hmw" key={i}>
                <span className="xl-hmw-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="xl-hmw-text">{h.hmw}</p>
                  <span className="xl-hmw-persona">Target: {h.persona}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="xl-sub-heading xl-reveal" style={{ marginTop: '3.5rem' }}>Design Principles</h3>
          <div className="xl-principles xl-reveal-stagger">
            {DESIGN_PRINCIPLES.map(dp => (
              <div className="xl-principle" key={dp.p}>
                <h4 className="xl-principle-title">{dp.p}</h4>
                <p className="xl-principle-r">{dp.r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH06 — IA & RBAC ════════════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">06</span>
            <span className="xl-eyebrow">Information Architecture & RBAC</span>
          </div>

          <h2 className="xl-section-title xl-reveal">
            3 portals. 165+ screens. A 4-layer RBAC system{' '}
            <span className="xl-indigo">where permission escalation is architecturally impossible</span>.
          </h2>

          <div className="xl-ia-note xl-reveal">
            <span className="xl-ia-icon">🏗</span>
            <p>XOLOX is built on a three-portal architecture. Each portal is a scoped view of the same data model — but the IA, navigation, and default views are fundamentally different because the job-to-be-done is fundamentally different. Single-app-all-roles was rejected: the information needs of a counsellor and a Sales Head are completely different. One UI would require so much conditional rendering that both roles would see a cluttered, confusing surface.</p>
          </div>

          {/* Portals */}
          <div className="xl-portals xl-reveal-stagger">
            {PORTALS.map(portal => (
              <div className="xl-portal" key={portal.id} style={{ '--portal-color': portal.color }}>
                <div className="xl-portal-header">
                  <div className="xl-portal-id-row">
                    <span className="xl-portal-id">{portal.id}</span>
                    <span className="xl-portal-url">{portal.url}</span>
                  </div>
                  <h3 className="xl-portal-name" style={{ color: portal.color }}>{portal.name}</h3>
                  <p className="xl-portal-users">{portal.users}</p>
                </div>
                <p className="xl-portal-purpose">{portal.purpose}</p>
                <div className="xl-portal-meta">
                  <div><span className="xl-pmeta-k">Access</span><span className="xl-portal-access">{portal.access}</span></div>
                  <div><span className="xl-pmeta-k">Usage</span><span>{portal.usage}</span></div>
                </div>
                <div className="xl-portal-nav">
                  <div className="xl-pnav-label">Navigation</div>
                  {portal.nav.map(n => (
                    <div className="xl-pnav-item" key={n.id}>
                      <div className="xl-pnav-header">
                        <span className="xl-pnav-id">{n.id}</span>
                        <span className="xl-pnav-label-text">{n.label}</span>
                        {n.note && <span className="xl-pnav-note">{n.note}</span>}
                      </div>
                      <div className="xl-pnav-subs">
                        {n.subs.map(s => <span key={s} className="xl-pnav-sub">{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RBAC */}
          <h3 className="xl-sub-heading xl-reveal" style={{ marginTop: '4rem' }}>RBAC Architecture — 4 Enforcement Layers</h3>
          <p className="xl-body xl-reveal">Assigned user permissions can NEVER exceed role-defined permissions. Permission escalation is architecturally impossible, not just policy-blocked.</p>

          <div className="xl-rbac-layers xl-reveal-stagger">
            {RBAC_LAYERS.map(l => (
              <div className="xl-rbac-layer" key={l.layer}>
                <div className="xl-rbac-layer-num">L{l.layer}</div>
                <div>
                  <div className="xl-rbac-layer-name">{l.name}</div>
                  <p className="xl-rbac-layer-desc">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="xl-sub-heading xl-reveal" style={{ marginTop: '3rem' }}>Role Definitions</h3>
          <div className="xl-roles xl-reveal-stagger">
            {ROLES.map(r => (
              <div className="xl-role" key={r.role}>
                <div className="xl-role-header">
                  <span className="xl-role-name">{r.role}</span>
                  <span className="xl-role-portal">{r.portal}</span>
                </div>
                <div className="xl-role-scope">{r.scope}</div>
                <div className="xl-role-perms">
                  {r.perms.map(p => <span key={p} className="xl-perm-pill">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH07 — UX FLOWS ══════════════════════════════════════════════ */}
        <section className="xl-section">
          <div className="xl-section-label xl-reveal">
            <span className="xl-ch-num">07</span>
            <span className="xl-eyebrow">UX Flows</span>
          </div>

          <h2 className="xl-section-title xl-reveal">
            Five critical flows — from new lead to fee collection —{' '}
            <span className="xl-indigo">every step mapped with design rationale</span>.
          </h2>

          <div className="xl-reveal" style={{ marginTop: '2rem' }}>
            <FlowViewer flows={UX_FLOWS} />
          </div>
        </section>

        {/* ══ CTA ══════════════════════════════════════════════════════════ */}
        <section className="xl-cta-section xl-reveal">
          <div className="xl-cta-glow" aria-hidden="true" />
          <span className="xl-eyebrow">Next</span>
          <h2 className="xl-cta-title">Want to go deeper on the RBAC architecture, any specific flow, or how we designed for 165+ screens across 3 portals?</h2>
          <div className="xl-cta-actions">
            <a href="mailto:hashtaginflu@gmail.com" className="xl-btn xl-btn--primary">Get in Touch</a>
            <button className="xl-btn xl-btn--ghost" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
