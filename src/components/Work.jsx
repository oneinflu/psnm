import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CaseStudy from './CaseStudy'
import './Work.css'

gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════
//  CASE STUDY DATA  (used by CaseStudy overlay)
// ═══════════════════════════════════════════════════════════
export const PRODUCTS = [

  // 1. Greeto.io ─────────────────────────────────────────────
  {
    id: 'greeto',
    name: 'Greeto.io',
    tagline: 'Omni-channel business communication — WhatsApp, Instagram, Email, SMS and Live Chat in one workspace.',
    meta: { role: 'Head of Product & Growth', timeline: '2024–Present', platform: 'Web SaaS' },
    tags: ['SaaS', 'WhatsApp API', 'CRM', 'Omni-Channel', 'Automation'],
    caseStudy: {
      problem: {
        headline: 'Businesses were running customer communication from four different apps and still missing messages.',
        body: 'Support teams at SMBs were juggling WhatsApp Web on one device, Instagram DMs on another, email on a third, and a spreadsheet for tracking. Every handoff between team members broke because context wasn\'t preserved. Campaign results were invisible — teams "felt" they worked but couldn\'t prove it. And when a lead fell through the cracks, no one knew until the customer was gone.',
      },
      marketContext: {
        body: 'The WhatsApp Business API market in India was growing fast, with players like Gallabox, AiSensy, and Interakt serving enterprise customers. But none had built a true omni-channel platform — they were WhatsApp-first with weak support for other channels. SMBs were underserved: too complex for no-code tools, too expensive for enterprise solutions.',
        stats: [
          { value: '4+', label: 'avg. tools an SMB uses for customer comms' },
          { value: '90%', label: 'WhatsApp message open rate vs 20% email' },
          { value: '60%', label: 'of Instagram DMs go unresponded in 24h' },
        ],
      },
      research: {
        methods: ['SMB Owner Interviews', 'Support Team Shadowing', 'Competitor Teardowns', 'Channel Usage Audits'],
        body: 'Interviewed 20+ SMB owners across e-commerce, education, and services. Discovered the average business uses 4+ separate apps for customer communication, spending over 3 hours per day context-switching. The highest-pain moment: a customer who messaged on WhatsApp, then Instagram, then email — and got three different answers because no one had the full picture.',
      },
      insights: [
        { num: '01', headline: 'Businesses run WhatsApp and Instagram from completely separate devices with no shared context.', body: 'This meant the "unified inbox" wasn\'t just a UX feature — it required rebuilding how teams thought about customer identity across channels.' },
        { num: '02', headline: 'Campaign ROI measurement is non-existent. Teams "feel" campaigns worked but can\'t prove it to anyone.', body: 'This insight drove the analytics module design — not just open and click rates, but revenue attributed per campaign per channel.' },
        { num: '03', headline: 'Support handoff between team members breaks because context is held in the agent\'s memory, not the system.', body: 'This shaped the conversation history and internal note design — every handoff needed full context without asking the customer to repeat themselves.' },
      ],
      hypothesis: {
        statement: 'We believe that if we unify 5 channels into one workspace with smart routing and campaign analytics, businesses will reduce response time by 3x and gain measurable campaign ROI visibility for the first time.',
        body: 'The bet was that channel unification alone wasn\'t enough — businesses needed to see attribution and performance clearly before they\'d trust a new platform with their entire communication stack. That\'s why analytics was in v1, not v2.',
      },
      userJourney: [
        { phase: 'Trigger', description: 'A lost sale because a customer\'s WhatsApp message was missed while the team was on Instagram. Or a campaign that "seemed" to work but had no data to back it up.' },
        { phase: 'Discovery', description: 'Peer recommendation from another business owner, or discovery through a search for "WhatsApp Business CRM India".' },
        { phase: 'Activation', description: 'First unified inbox active — all channels in one view, first campaign launched and tracked, first handoff between team members without context loss.' },
        { phase: 'Core Loop', description: 'Receive inquiry → assign to agent → reply from unified inbox → log in CRM → launch follow-up campaign → measure in analytics.' },
        { phase: 'Outcome', description: '65% faster response time, 3x campaign open rates, 10+ hours saved per team per week.' },
      ],
      solution: {
        headline: 'One workspace for every customer conversation — with automation that keeps the team ahead of demand, not behind it.',
        body: 'Built as a multi-tenant SaaS platform with a unified inbox, campaign manager, visual bot builder, CRM, and broadcast engine. The design principle was: every feature needed to work for a 3-person team and a 30-person team without reconfiguration. Template-first automation proved 8x more adopted than the custom bot builder — users wanted speed, not flexibility.',
        decisions: [
          '"Conversation Owner" system so every message has one assigned agent visible to the whole team — eliminates duplicate replies and missed messages.',
          'Campaign analytics with per-channel attribution before launch — so teams could see which channel drove revenue, not just opens.',
          'Template library with 50+ pre-built bot flows — 8x adoption vs. custom builder because businesses wanted to launch in minutes, not hours.',
        ],
      },
      impact: [
        { metric: '65%', label: 'Faster first response time', description: 'Across all channels combined in the unified inbox.' },
        { metric: '3×', label: 'Campaign open rate improvement', description: 'WhatsApp campaigns vs. previous email-only campaigns.' },
        { metric: '10h+', label: 'Hours saved per team per week', description: 'Eliminated from manual context-switching between tools.' },
      ],
      lessons: [
        { num: '01', title: 'Multi-tenant architecture decisions made at launch are expensive to reverse.', body: 'Plan for data isolation, role-based access, and billing at the tenant level before you ship — retrofitting these is 3x the engineering cost.' },
        { num: '02', title: 'Template adoption will always beat custom-build adoption.', body: 'Users want outcomes, not power. The most powerful feature is one they actually use in the first session.' },
      ],
    },
  },

  // 2. MyExamly ─────────────────────────────────────────────
  {
    id: 'examly-lms',
    name: 'MyExamly',
    tagline: 'AI-powered certification exam prep platform — CPA, CMA & EA with adaptive scheduling and 94% first-attempt pass rate.',
    meta: { role: 'Head of Product & Growth', timeline: '2021–2023', platform: 'Web + Mobile' },
    tags: ['EdTech', 'LMS', 'AI', 'Certification', 'Assessment'],
    caseStudy: {
      problem: {
        headline: 'Professional certification students were studying hard but failing at predictable rates — and no one could see it coming.',
        body: 'CPA, CMA, and ACCA students were self-studying with no adaptive guidance. Study plans were generic PDFs. Assessment feedback came weeks after exams. Students who were going to fail had no early warning system. Coaching institutes couldn\'t identify at-risk students until it was too late. The product existed — but it wasn\'t working for the people who needed it most.',
      },
      marketContext: {
        body: 'India\'s professional education market was growing but served primarily by static online courseware (Coursera-style video + MCQ). No platform had built adaptive assessment + performance prediction for professional certification prep. The gap: high-stakes learners needed more than content delivery — they needed to know if they were ready to pass.',
        stats: [
          { value: '500K+', label: 'CPA/CMA candidates in India annually' },
          { value: '45%', label: 'Average first-attempt pass rate for CPA' },
          { value: '₹2L+', label: 'Average investment per certification attempt' },
        ],
      },
      research: {
        methods: ['Student Diary Studies', 'Educator Interviews', 'Assessment Analytics', 'Failure Mode Analysis'],
        body: 'Ran diary studies with 30 active certification candidates over 8 weeks. Tracked daily study behavior, self-assessment, and anxiety levels. Discovered: students overstudied their strong areas and systematically avoided weak ones. Educators couldn\'t identify struggling students until exam results arrived. The biggest insight came from analyzing the study patterns of students who failed vs. those who passed — they looked identical until week 6.',
      },
      insights: [
        { num: '01', headline: 'Students systematically avoid studying their weakest topics because it feels bad — not because they don\'t know they\'re weak.', body: 'This drove the AI Study Planner design: force-allocate time to weak areas based on performance data, not self-reported comfort.' },
        { num: '02', headline: '"Silent Achievers" — students with the highest engagement but the highest drop rate — were invisible to educators.', body: 'They never asked for help but had the lowest retention. This drove the proactive intervention system — triggered by behavioral signals, not raised hands.' },
        { num: '03', headline: 'Students trust the platform\'s performance prediction more than their own gut feeling about exam readiness.', body: 'This validated the Performance Prediction feature as a retention driver — students who saw their readiness score stayed 40% longer than those who didn\'t.' },
      ],
      hypothesis: {
        statement: 'We believe that if we make weak-topic practice unavoidable and surface real-time readiness scores, students will reach exam-ready state 30% faster than self-directed study.',
        body: 'The core bet was that most learning platform failures aren\'t motivation failures — they\'re information failures. If students know exactly where they stand and what to study next, they\'ll study more effectively. The AI planner was the mechanism; the readiness score was the motivator.',
      },
      userJourney: [
        { phase: 'Trigger', description: 'A failed exam attempt after months of self-study, or a counselor recommending a structured platform before the next attempt.' },
        { phase: 'Discovery', description: 'Institution recommendation, peer word-of-mouth from a student who passed, or search for "CPA exam prep India".' },
        { phase: 'Activation', description: 'First diagnostic assessment completed, first AI study plan generated, first performance prediction seen — the moment the platform replaces gut instinct with data.' },
        { phase: 'Core Loop', description: 'Study from AI plan → complete adaptive assessment → receive performance prediction update → educator reviews at-risk alerts → repeat.' },
        { phase: 'Outcome', description: 'Higher pass rates, earlier identification of at-risk students, measurable readiness tracking that replaces guesswork.' },
      ],
      solution: {
        headline: 'Adaptive assessments, AI-personalized study plans, and predictive readiness scores — all connected in one loop that gets smarter as the student studies.',
        body: 'Built adaptive assessment engine that adjusted difficulty based on real-time performance. AI Study Planner auto-allocated daily study time across subjects based on exam date and weakness map. Performance Prediction model gave students and educators a readiness percentage updated after every session.',
        decisions: [
          'Forced weak-topic rotation in the AI Study Planner — students couldn\'t skip their lowest-scoring areas for more than 2 consecutive days.',
          'Proactive educator intervention triggered by behavioral signals (session length drop + assessment score decline) not self-reported struggle.',
          'Readiness score visible on the dashboard every session — made progress tangible and kept students returning to improve the number.',
        ],
      },
      impact: [
        { metric: '22%', label: 'Retention improvement', description: 'Via proactive educator intervention triggered by behavioral signals.' },
        { metric: '38%', label: 'Higher completion rates', description: 'For students using the AI Study Planner vs. self-directed study.' },
        { metric: '500+', label: 'Students on platform', description: 'Across CPA, CMA, ACCA, CFA, and CIA programs.' },
      ],
      lessons: [
        { num: '01', title: 'Behavioral data is more honest than self-reported data.', body: 'What students do (session lengths, skip rates, topic avoidance) is more predictive of outcomes than what they say in surveys. Build for behavior, not stated preferences.' },
        { num: '02', title: 'Educator dashboards are retention features, not admin features.', body: 'When educators could see at-risk students in real time, they intervened — and students stayed. The student-facing product was only half the system.' },
      ],
    },
  },

  // 3. XOLOX CRM ─────────────────────────────────────────────
  {
    id: 'xolox-crm',
    name: 'XOLOX CRM',
    tagline: 'Sales CRM purpose-built for high-ticket education sales — lead to enrollment, automated.',
    meta: { role: 'Head of Product & Growth', timeline: '2022–2024', platform: 'Web App' },
    tags: ['CRM', 'EdTech Sales', 'Lead Management', 'WhatsApp Automation'],
    caseStudy: {
      problem: {
        headline: 'Education counselors were managing ₹2L+ deals in WhatsApp groups and spreadsheets — and losing them.',
        body: 'High-ticket education businesses had counselors handling 80-150 leads simultaneously in WhatsApp groups and shared Excel sheets. Follow-ups were manual. Stage tracking was inconsistent. Managers had zero visibility into pipeline health. A counselor leaving took their entire lead history with them. Revenue leakage was estimated at 20-30% from follow-up failures alone.',
      },
      marketContext: {
        body: 'Education CRM was served by generic tools (LeadSquared, Freshsales) that didn\'t understand the education sales cycle — multi-touch, high-empathy, long-consideration. No CRM had built specifically for the counselor workflow: WhatsApp-first communication, batch follow-up, and fee negotiation workflows.',
        stats: [
          { value: '₹2L+', label: 'Average deal size for professional programs' },
          { value: '45+', label: 'Days average sales cycle for CPA/CMA enrollment' },
          { value: '30%', label: 'Revenue lost to follow-up failures in status quo' },
        ],
      },
      research: {
        methods: ['Counselor Shadowing', 'Pipeline Audits', 'WhatsApp Log Analysis', 'Manager Interviews'],
        body: 'Shadowed 12 counselors across 3 coaching institutes for 2 weeks. Recorded how leads moved from inquiry to enrollment — or didn\'t. Found that counselors were copying CRM data into WhatsApp messages to share with leads (a shadow system), forgetting to log calls, and spending 40% of their time on admin tasks instead of selling. The pipeline visible to managers was fiction.',
      },
      insights: [
        { num: '01', headline: 'Counselors built a shadow CRM in WhatsApp because the real CRM couldn\'t send messages.', body: 'This drove the WhatsApp-native integration decision — every lead card needed a one-tap message action to eliminate the switch between apps.' },
        { num: '02', headline: 'The biggest pipeline killer wasn\'t bad leads — it was forgotten follow-ups on good leads.', body: 'This drove the automated follow-up sequence design — every stage change triggered the next follow-up automatically so nothing relied on counselor memory.' },
        { num: '03', headline: 'Managers were making resourcing decisions with pipeline data that was 2-4 weeks stale.', body: 'This drove the real-time pipeline dashboard — managers needed today\'s view, not last week\'s.' },
      ],
      hypothesis: {
        statement: 'We believe that if we bring WhatsApp communication into the CRM and automate follow-up sequences, counselor pipeline visibility will improve enough to recover 20% of currently-lost revenue.',
        body: 'The bet: the follow-up problem was a tool problem, not a motivation problem. Counselors knew they should follow up — they just forgot because the system didn\'t remind them with the right context at the right time.',
      },
      userJourney: [
        { phase: 'Trigger', description: 'A counselor loses a hot lead to a competitor because follow-up was missed. Or manager runs a pipeline meeting and realizes no one knows how many warm leads exist.' },
        { phase: 'Discovery', description: 'Institute management evaluates XOLOX during a growth push or after a revenue miss.' },
        { phase: 'Activation', description: 'First WhatsApp message sent from lead card, first automated follow-up sequence active, first pipeline view populated — the moment the manager stops asking for spreadsheet updates.' },
        { phase: 'Core Loop', description: 'Lead assigned → counselor messages via WhatsApp from CRM → stage updated → system triggers next follow-up → manager views real-time pipeline.' },
        { phase: 'Outcome', description: '60% faster TAT, higher enrollment rates, no lead falling through cracks.' },
      ],
      solution: {
        headline: 'The first CRM counselors actually use — because it speaks WhatsApp, automates follow-ups, and makes the pipeline transparent without extra effort.',
        body: 'Built WhatsApp-native messaging directly into lead cards. Designed automated follow-up sequences triggered by stage changes. Built a real-time pipeline board for managers. Designed 165+ screens covering counselor, manager, admin, and super-admin roles with full RBAC.',
        decisions: [
          'WhatsApp one-tap from lead card — eliminated context-switching to WhatsApp Web and removed the shadow CRM behavior.',
          'Automated follow-up sequences on stage change — counselors set the sequence once, the CRM sent the follow-ups.',
          'Real-time pipeline board vs. static reports — managers could see live stage distribution without waiting for counselors to update spreadsheets.',
        ],
      },
      impact: [
        { metric: '60%', label: 'TAT Reduction', description: 'From inquiry to enrollment decision across all counselors.' },
        { metric: '165+', label: 'Screens designed', description: 'Across 4 role-based portals: counselor, manager, admin, super-admin.' },
        { metric: '70%', label: 'Less manual re-entry', description: 'Per counselor per week after WhatsApp integration launched.' },
      ],
      lessons: [
        { num: '01', title: 'The best CRM adoption strategy is to meet users in the tool they already use.', body: 'We didn\'t get counselors to abandon WhatsApp — we brought the CRM into WhatsApp. The tool changed; the behavior didn\'t have to.' },
        { num: '02', title: 'RBAC architecture at launch saves 6 months of refactoring later.', body: 'Multi-role access wasn\'t a feature we added — it was the product. Building it in from schema design was the right call.' },
      ],
    },
  },

  // 4. SOPFlow ─────────────────────────────────────────────
  {
    id: 'sopflow',
    name: 'SOPFlow',
    tagline: 'Autonomous AI marketing operating system — executes campaigns, content, and SEO without human intervention.',
    meta: { role: 'Creator & Product Owner', timeline: '2024–Present', platform: 'Web SaaS + API' },
    tags: ['AI', 'Marketing Automation', 'SEO', 'Claude', 'OpenAI'],
    caseStudy: {
      problem: {
        headline: 'Marketing teams were spending more time managing AI tools than benefiting from them.',
        body: 'Businesses were subscribing to 5-8 AI marketing tools that all required human orchestration. ChatGPT for copy, another tool for SEO, another for scheduling, a separate one for analytics. The promise of AI-powered marketing was real; the execution was still a human job. The market needed a system that completed marketing tasks, not just assisted with them.',
      },
      marketContext: {
        body: 'The marketing automation market was crowded but fragmented. Existing AI tools were point solutions requiring heavy human coordination. No platform had connected AI generation, SEO execution, content publishing, and performance monitoring into one autonomous loop. SOPFlow was built to be the layer that replaced the human coordinator in the marketing stack.',
        stats: [
          { value: '8+', label: 'Avg. AI tools a marketing team juggles' },
          { value: '40%', label: 'Of marketing budget spent on tool subscriptions' },
          { value: '$6B+', label: 'AI marketing automation market by 2026' },
        ],
      },
      research: {
        methods: ['Marketing Manager Interviews', 'Tool Usage Audits', 'Workflow Mapping', 'Survey Analysis'],
        body: 'Surveyed 80+ marketing managers. Found that 83% rated "finding the right version of an SOP or brief" as their #1 daily friction — not creating content. Teams were rebuilding the same campaign briefs from scratch every quarter. AI tools existed but required a full-time operator. The insight: the problem wasn\'t AI capability — it was AI coordination.',
      },
      insights: [
        { num: '01', headline: '83% of marketing managers spend 2+ hours per week finding or recreating content briefs that already existed.', body: 'SOPFlow\'s SOP discovery and versioning became a core feature — not just AI generation.' },
        { num: '02', headline: 'Marketing AI tools are only as good as the human who orchestrates them.', body: 'This validated the autonomous execution model — the platform needed to connect the tools and run the workflows, not just provide them.' },
        { num: '03', headline: 'Teams abandoned powerful tools because setup complexity exceeded perceived value.', body: 'Drove the "zero configuration" design principle — every workflow had a working default. Customization was optional, not required.' },
      ],
      hypothesis: {
        statement: 'We believe that if we connect AI generation, SEO execution, publishing, and monitoring into one autonomous loop, marketing teams can reduce their operational overhead by 60% while improving output quality.',
        body: 'The bet: AI coordination is more valuable than AI generation. The tools exist. What\'s missing is the system that connects them into a workflow that runs without human babysitting.',
      },
      userJourney: [
        { phase: 'Trigger', description: 'Marketing team is drowning in tool subscriptions that individually work but collectively create more work. Or a startup with no marketing hire that needs consistent output.' },
        { phase: 'Discovery', description: 'Search for "AI marketing automation" or referral from another operator who reduced their marketing overhead.' },
        { phase: 'Activation', description: 'First autonomous campaign published — content written, SEO-optimized, published to site, and submitted to Search Console without any human involvement.' },
        { phase: 'Core Loop', description: 'Define campaign objective → SOPFlow generates → SEO-optimizes → publishes → monitors performance → adjusts and repeats.' },
        { phase: 'Outcome', description: 'Consistent content output without headcount, measurable SEO growth, and marketing operational overhead reduced by 60%.' },
      ],
      solution: {
        headline: 'SOPFlow doesn\'t help you do marketing tasks. It does them.',
        body: 'Connected Claude (content generation), OpenAI (embeddings + semantic search), GitHub (versioning), DigitalOcean (infrastructure), Google Search Console (indexing), and SERP APIs (competitive intelligence) into one autonomous execution loop. The system generates, optimizes, publishes, monitors, and iterates — the team sets the objective.',
        decisions: [
          'Autonomous execution over AI assistance — SOPFlow completes tasks, not just drafts them. Human approval is optional, not required.',
          'GitHub-backed versioning for all content — every SOP and piece of content tracked as code, with full diff history and rollback.',
          'SERP API → Claude pipeline for template suggestions — when a user opens a new campaign, they get "companies like yours typically run these 5 campaigns" as a starting point.',
        ],
      },
      impact: [
        { metric: '60%', label: 'Marketing overhead reduction', description: 'For teams using SOPFlow vs. manual AI tool coordination.' },
        { metric: '90s', label: 'Content → published pipeline', description: 'From generation to live website publish including SEO optimization.' },
        { metric: '$1M', label: 'Operational savings projection', description: 'Across first 10 enterprise clients over 18 months.' },
      ],
      lessons: [
        { num: '01', title: 'Autonomous systems need exceptional error handling — humans can\'t rescue a failed autonomous task at 3am.', body: 'Built retry logic, failure notifications, and human escalation triggers before we shipped the autonomous mode.' },
        { num: '02', title: 'The biggest adoption barrier for AI automation is trust, not capability.', body: 'Added a "review mode" where every autonomous action is visible and reversible before it executes. Adoption improved 3x after this shipped.' },
      ],
    },
  },

  // 5. Agri Khatha ─────────────────────────────────────────────
  {
    id: 'agri-khatha',
    name: 'Agri Khatha',
    tagline: 'Mobile-first financial management for Farmer Producer Organizations — built for low-digital-literacy users.',
    meta: { role: 'Senior Product Designer – UX Research & Strategy', timeline: '2023–2024', platform: 'Mobile + Web' },
    tags: ['AgriTech', 'FinTech', 'Rural India', 'FPO', 'Financial Inclusion'],
    caseStudy: {
      problem: {
        headline: 'Farmer Producer Organizations were running ₹crore-level businesses in physical notebooks — and losing credit eligibility because of it.',
        body: 'FPOs across Andhra Pradesh, Telangana, Karnataka, and Maharashtra were managing member accounts, dividends, input purchases, and output sales entirely in manual registers. Their financial data was invisible to lenders. Banks couldn\'t assess creditworthiness. Government subsidies were miscalculated or missed. The result: well-run FPOs couldn\'t access the capital they needed to grow because they had no verifiable financial history.',
      },
      marketContext: {
        body: 'India has 10,000+ registered FPOs representing 1.5 crore farmers. Most operate with no digital financial records. The government\'s FPO promotion scheme mandated improved financial management but provided no digital tooling. NBFCs willing to lend to agri collectives had no data to underwrite. The market gap: a financial management platform simple enough for a 65-year-old farmer president to use.',
        stats: [
          { value: '10K+', label: 'Registered FPOs in India' },
          { value: '1.5Cr', label: 'Farmers represented by FPOs' },
          { value: '₹0', label: 'Digital financial records for most FPOs' },
        ],
      },
      research: {
        methods: ['Village Field Visits', 'Farmer Interviews', 'FPO Secretary Sessions', 'NBFC Partner Research'],
        body: 'Conducted 30+ field interviews across 4 states. Visited mandis, FPO offices, and farmer homes. Interviewed FPO secretaries, members, and lenders. The biggest discovery: farmers weren\'t rejecting digital tools — they were handing the phone to their children to fill out forms. The actual user wasn\'t who we designed for. The target user was often a 20-year-old family member, not the 55-year-old farmer.',
      },
      insights: [
        { num: '01', headline: 'Farmers hand phones to family members for digital tasks — the real user is often younger and more digitally fluent.', body: 'This drove the "guided by family member" design pattern — onboarding assumed a helper, not a solo first-time user.' },
        { num: '02', headline: 'FPO secretaries are the power users — everything flows through them, and they\'re chronically overloaded.', body: 'The secretary\'s workflow became the core product surface. Members self-serve as an aspiration, not a launch requirement.' },
        { num: '03', headline: 'Farmers trust paper more than pixels — digital records feel impermanent to people who\'ve never had a banking relationship.', body: 'Added printable summary sheets for every transaction, so the digital record could become physical proof when needed.' },
      ],
      hypothesis: {
        statement: 'We believe that if we make FPO bookkeeping as simple as one entry per transaction with automatic report generation, secretaries will replace paper registers within 90 days.',
        body: 'The bet: the barrier to adoption wasn\'t motivation (secretaries desperately wanted a better system) — it was complexity. One entry, one button, done. Reports generated automatically. If it required training, it would fail.',
      },
      userJourney: [
        { phase: 'Trigger', description: 'FPO secretary manually compiles annual financial statements for an auditor — takes 3 weeks from notebooks. Or lender rejects loan application because financial history isn\'t verifiable.' },
        { phase: 'Discovery', description: 'State agriculture department promotes the platform, or another FPO in the district has used it successfully.' },
        { phase: 'Activation', description: 'First member account created, first transaction logged — the moment the secretary realizes the balance sheet generates automatically.' },
        { phase: 'Core Loop', description: 'Log sale/purchase → member account updated automatically → dividend calculated → report generated → shared with lender or government.' },
        { phase: 'Outcome', description: 'Verifiable 12-month financial record, faster loan approvals, accurate dividend distribution, government compliance reports auto-generated.' },
      ],
      solution: {
        headline: 'The first financial platform built for how FPOs actually work — not how we wished they would.',
        body: 'Designed for single-entry bookkeeping with automatic double-entry under the hood. Member accounts, input purchases, output sales, dividend distribution, and financial reporting all connected. Offline-first for low-connectivity field conditions. Telugu and Kannada UI for non-English users.',
        decisions: [
          '"Guided by family member" onboarding — designed for a helper to set up, not a solo first-time user.',
          'Printable summary sheets for every transaction — bridged the trust gap between digital records and paper proof.',
          'Auto-generated annual report formatted to NABARD/government requirements — the report the secretary used to spend 3 weeks compiling.',
        ],
      },
      impact: [
        { metric: '38%', label: 'Activation rate increase', description: 'After redesigning onboarding for the "guided by family member" usage pattern.' },
        { metric: '30+', label: 'Field interviews conducted', description: 'Across 4 states before writing a single line of product spec.' },
        { metric: '4', label: 'States covered', description: 'Andhra Pradesh, Telangana, Karnataka, Maharashtra.' },
      ],
      lessons: [
        { num: '01', title: 'Design for the actual user, not the stated user.', body: 'The FPO secretary was the stated primary user. The farmer\'s son or daughter doing data entry on the secretary\'s behalf was the actual primary user. These require completely different designs.' },
        { num: '02', title: 'Digital products in rural markets live or die on the first 5 minutes.', body: 'If the secretary couldn\'t do the first transaction without help during our training session, the product was going to fail. We iterated until it cleared that bar.' },
      ],
    },
  },

  // 6. MyGold Blockchain ─────────────────────────────────────────────
  {
    id: 'mygold-blockchain',
    name: 'MyGold Blockchain',
    tagline: 'End-to-end blockchain supply chain for gold — from mine to ownership, fully traceable.',
    meta: { role: 'Product Manager', timeline: '2023–2024', platform: 'Web + Mobile + API' },
    tags: ['Blockchain', 'FinTech', 'Gold Supply Chain', 'B2B', 'Verification'],
    caseStudy: {
      problem: {
        headline: 'The gold supply chain had five participants who didn\'t trust each other — and no system to fix that.',
        body: 'Gold moves from collectors to refineries to assayers to vaults to owners through a chain of paper certificates and phone calls. Each handoff was a trust event with no verification. Counterfeit gold entered the chain at multiple points. Banks couldn\'t underwrite gold loan portfolios confidently because provenance was impossible to verify. The $900B Indian gold market was running on handshakes.',
      },
      marketContext: {
        body: 'India holds an estimated ₹130 lakh crore in household gold. The gold loan market was growing at 15% YoY but hindered by verification overhead. Blockchain-backed gold platforms existed internationally (Paxos, Perth Mint) but none had solved the Indian supply chain — specifically the collector-to-refinery and assayer-to-vault trust problem.',
        stats: [
          { value: '₹130Lcr', label: 'Estimated household gold holdings in India' },
          { value: '15%', label: 'Gold loan market annual growth rate' },
          { value: '5', label: 'Supply chain participants with no shared trust layer' },
        ],
      },
      research: {
        methods: ['Supply Chain Mapping', 'Refinery Interviews', 'Bank Partner Research', 'Regulatory Analysis'],
        body: 'Mapped the full gold supply chain from collector to owner. Interviewed 15+ industry participants across the chain. Discovered that "trust verification" at the branch level was the highest importance, lowest satisfaction problem across all participants. Banks couldn\'t verify gold provenance during loan origination. Refineries couldn\'t prove their output quality to downstream buyers without paper certificates that could be forged.',
      },
      insights: [
        { num: '01', headline: 'Trust verification at the branch level was the highest-importance, lowest-satisfaction problem for every participant.', body: 'No one in the chain trusted the paper certificate. Building a blockchain verification tool for branch-level staff became the product differentiator.' },
        { num: '02', headline: 'Banks were the key unlock — solve their verification problem and the rest of the chain had incentive to participate.', body: 'This drove the GTM decision: launch with bank partners first, not consumers. The bank mandate pulled the supply chain onto the platform.' },
        { num: '03', headline: 'Gold industry participants were tech-skeptical but problem-aware — they knew verification was broken but didn\'t believe digital could fix it.', body: 'This drove the "Gold Verifier" product design — a simple, single-purpose QR scan that produced a blockchain-backed certificate in 3 seconds. No blockchain knowledge required.' },
      ],
      hypothesis: {
        statement: 'We believe that if we make blockchain provenance verification as simple as scanning a QR code, banks will mandate it for gold loan origination and pull the entire supply chain onto the platform.',
        body: 'The bet: the supply chain wouldn\'t adopt blockchain because of the technology — they would adopt it because their bank partner required it for loan processing. The consumer application of blockchain was a secondary outcome of solving the B2B verification problem first.',
      },
      userJourney: [
        { phase: 'Trigger', description: 'Bank processes a gold loan and can\'t verify provenance. Or a refinery loses a buyer contract because their quality certificates aren\'t trusted.' },
        { phase: 'Discovery', description: 'Bank partnership mandate pulls supply chain participants onto the platform. Or industry conference referral.' },
        { phase: 'Activation', description: 'First gold batch registered on-chain, first QR verification scan by a bank branch, first loan approved using blockchain-backed provenance — the moment the bank stops asking for paper certificates.' },
        { phase: 'Core Loop', description: 'Collector registers batch → refinery verifies and transforms → assayer certifies quality → vault stores → bank verifies via QR → owner transacts with confidence.' },
        { phase: 'Outcome', description: '45% faster loan origination, verified provenance at every supply chain step, counterfeit gold identified at point of entry.' },
      ],
      solution: {
        headline: 'Five separate products, one connected supply chain — each participant sees their layer, every layer is connected.',
        body: 'Built 5 products for 5 participants: Collector App, Refinery Portal, Hub Dashboard, Assayer Verification Tool, and Gold Verifier Application. Each product was purpose-built for its user — the refinery UI was desktop-first and data-dense; the gold verifier was mobile-first and single-tap. One blockchain back-end, five different interfaces.',
        decisions: [
          '"Gold Verifier" as a standalone QR app for bank branches — isolated the verification use case so banks could adopt without onboarding the full platform.',
          'Batch-level tracking (not unit-level) for the refinery and assayer stages — matched how the industry actually worked, not an idealized blockchain model.',
          '$1M annual savings from eliminating manual verification overhead and counterfeit-related write-offs across the first enterprise clients.',
        ],
      },
      impact: [
        { metric: '45%', label: 'Faster loan origination', description: 'Gold loans processed using blockchain verification vs. paper certificate process.' },
        { metric: '$1M', label: 'Annual operational savings', description: 'Across first 3 enterprise bank partners — eliminated manual verification staff.' },
        { metric: '5', label: 'Products built', description: 'Collector App, Refinery Portal, Hub Dashboard, Assayer Tool, Gold Verifier.' },
      ],
      lessons: [
        { num: '01', title: 'Blockchain is infrastructure, not a product.', body: 'Users don\'t care about blockchain — they care about trust. Design for the trust problem, use blockchain as the implementation.' },
        { num: '02', title: 'One back-end, multiple front-ends is the right architecture for multi-participant supply chains.', body: 'Building 5 products from one API kept the data consistent and the integration cost low. Separate databases would have created the trust problem all over again.' },
      ],
    },
  },

]

// ═══════════════════════════════════════════════════════════
//  FEATURED DISPLAY DATA
// ═══════════════════════════════════════════════════════════
const FEATURED = [
  {
    num: '01',
    productId: 'greeto',
    name: 'Greeto.io',
    tagline: 'Omni-Channel Customer Communication Platform',
    category: 'SaaS Platform',
    desc: 'A SaaS platform designed to unify WhatsApp, Instagram, Email, SMS, and Live Chat into a single business communication hub. Built as a modern alternative to Gallabox and AiSensy, Greeto enables businesses to manage conversations, automate engagement, launch campaigns, and track customer interactions across channels from one workspace.',
    contributions: ['Product Strategy', 'Market Research', 'Complete PRD Authoring', 'UX Architecture', 'Multi-Tenant SaaS Design', 'Pricing & GTM Strategy'],
    modules: { label: 'Modules Designed', items: ['Inbox', 'Campaign Manager', 'CRM', 'Broadcast Engine', 'Analytics', 'Team Inbox', 'Visual Bot Builder', 'Super Admin'] },
    role: 'Head of Product & Growth',
    accent: '#dfb743',
  },
  {
    num: '02',
    productId: 'examly-lms',
    name: 'MyExamly',
    tagline: 'AI-Powered Certification Exam Prep',
    category: 'EdTech · AI',
    desc: 'An AI-native Learning Management System built for professional certification programs including CPA, CMA, ACCA, CFA, and CIA. The platform combines adaptive assessments, personalized study plans, performance prediction, and AI-powered learning assistance to improve student outcomes and engagement.',
    contributions: ['Product Discovery', 'User Research', 'AI Feature Design', 'Learning Experience Strategy', 'MVP Planning', 'Product Roadmapping'],
    modules: { label: 'AI Features', items: ['Adaptive Learning', 'AI Study Planner', 'Performance Prediction', 'AI Q&A Assistant'] },
    role: 'Head of Product & Growth',
    accent: '#818cf8',
  },
  {
    num: '03',
    productId: 'xolox-crm',
    name: 'XOLOX CRM',
    tagline: 'Sales CRM Built For Education Businesses',
    category: 'CRM · EdTech',
    desc: 'A complete lead management and counseling platform designed specifically for high-ticket education sales teams. The system manages leads from inquiry to enrollment while automating follow-ups, communication workflows, and counselor productivity.',
    contributions: ['Product Ownership', 'End-to-End UX Design', 'Information Architecture', 'PRD Creation', 'Role-Based Access Architecture'],
    modules: { label: 'Highlights', items: ['165+ Screens Designed', 'Multiple User Portals', 'AI-Powered Lead Nurturing', 'WhatsApp Automation'] },
    role: 'Head of Product & Growth',
    accent: '#34d399',
  },
  {
    num: '04',
    productId: 'sopflow',
    name: 'SOPFlow',
    tagline: 'Autonomous AI Marketing Operating System',
    category: 'AI · Automation',
    desc: 'A fully autonomous AI platform capable of executing marketing operations with minimal human intervention. The system connects OpenAI, Claude, GitHub, Google Search Console, SERP APIs, and DigitalOcean into one automated growth engine. Instead of helping marketers create tasks, SOPFlow completes the tasks.',
    contributions: ['Product Vision', 'AI Workflow Design', 'System Architecture', 'Automation Strategy', 'Product Ownership'],
    modules: { label: 'Capabilities', items: ['SEO Automation', 'Content Operations', 'Website Publishing', 'Performance Monitoring', 'Growth Execution'] },
    role: 'Creator & Product Owner',
    accent: '#fb923c',
  },
  {
    num: '05',
    productId: 'agri-khatha',
    name: 'Agri Khatha',
    tagline: 'Financial Management Platform For Farmer Producer Organizations',
    category: 'AgriTech · FinTech',
    desc: 'A mobile-first accounting and financial management system designed for Farmer Producer Organizations across rural India. The platform digitizes bookkeeping, member accounting, dividend management, and financial reporting while supporting low-digital-literacy users.',
    contributions: ['Field Research', 'User Interviews', 'Journey Mapping', 'Product Strategy', 'UX Design'],
    modules: { label: 'Research Conducted', items: ['30+ Field Interviews', 'Multiple States', 'Rural User Studies'] },
    role: 'Senior Product Designer – UX Research & Strategy',
    accent: '#86efac',
  },
  {
    num: '06',
    productId: 'mygold-blockchain',
    name: 'MyGold Blockchain Ecosystem',
    tagline: 'Blockchain-Based Gold Supply Chain Platform',
    category: 'Blockchain · FinTech',
    desc: 'A complete product ecosystem designed to bring transparency and traceability to the gold supply chain. The platform tracks gold from origin through refining, assaying, vaulting, and final ownership using blockchain-backed verification. $1M annual operational savings delivered.',
    contributions: ['Product Discovery', 'Supply Chain Research', 'Blockchain Product Design', 'PRD Authoring', 'Team Building'],
    modules: { label: 'Products Built', items: ['Collector App', 'Refinery Portal', 'Hub Dashboard', 'Assayer Verification Tool', 'Gold Verifier Application'] },
    role: 'Product Manager',
    accent: '#fbbf24',
  },
]

// ═══════════════════════════════════════════════════════════
//  SECONDARY PRODUCTS
// ═══════════════════════════════════════════════════════════
const SECONDARY = [
  {
    id: 'nsa-meets',
    name: 'NSA Meets',
    category: 'EdTech · AI Video',
    desc: 'AI-powered video collaboration platform with attendance tracking, recordings, transcripts, and session management — built for NorthStar Academy\'s 5,000+ student base.',
    tags: ['AI', 'Video', 'EdTech', 'Attendance'],
  },
  {
    id: 'input-marketplace',
    name: 'Input Marketplace',
    category: 'AgriTech · Procurement',
    desc: 'Procurement platform enabling FPOs to purchase seeds, fertilizers, and agricultural inputs with supplier comparison and credit workflows — reducing input costs for 10,000+ farmers.',
    tags: ['AgriTech', 'B2B', 'Procurement', 'FPO'],
  },
  {
    id: 'output-marketplace',
    name: 'Output Marketplace',
    category: 'AgriTech · Trade',
    desc: 'Agricultural trade platform connecting buyers and sellers while managing logistics, contracts, grading, and payment reconciliation across the supply chain.',
    tags: ['Marketplace', 'AgriTech', 'B2B', 'Trade'],
  },
  {
    id: 'credit-marketplace',
    name: 'Credit Marketplace',
    category: 'AgriTech · FinTech',
    desc: 'Digital lending ecosystem for FPOs and agri-enterprises that reduced loan origination turnaround times and unlocked formal credit access for underserved agricultural businesses.',
    tags: ['FinTech', 'Lending', 'FPO', 'AgriTech'],
  },
]

// ═══════════════════════════════════════════════════════════
//  FEATURED CARD COMPONENT
// ═══════════════════════════════════════════════════════════
function FeaturedCard({ item, onOpenCaseStudy }) {
  const product = PRODUCTS.find(p => p.id === item.productId)
  return (
    <article className="fp-card" style={{ '--fp-accent': item.accent }}>
      {/* Decorative number bg */}
      <span className="fp-card-num-bg" aria-hidden="true">{item.num}</span>

      {/* Card header */}
      <div className="fp-card-header">
        <div className="fp-card-header-left">
          <span className="fp-num-label">{item.num}</span>
          <span className="fp-category">{item.category}</span>
        </div>
        <span className="fp-role-badge">{item.role}</span>
      </div>

      {/* Title + tagline */}
      <div className="fp-title-block">
        <h3 className="fp-name" style={{ color: item.accent }}>{item.name}</h3>
        <p className="fp-tagline">{item.tagline}</p>
      </div>

      {/* Content grid: desc + contributions */}
      <div className="fp-content-grid">
        <p className="fp-desc">{item.desc}</p>

        <div className="fp-right">
          <div className="fp-block">
            <span className="fp-block-label">Key Contributions</span>
            <ul className="fp-contributions">
              {item.contributions.map(c => (
                <li key={c} className="fp-contribution">
                  <span className="fp-contrib-dot" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modules / features row */}
      <div className="fp-modules">
        <span className="fp-modules-label">{item.modules.label}</span>
        <div className="fp-module-tags">
          {item.modules.items.map(m => (
            <span key={m} className="fp-module-tag">{m}</span>
          ))}
        </div>
      </div>

      {/* Footer: CTA */}
      {product && (
        <div className="fp-footer">
          <button
            className="fp-cta"
            onClick={() => onOpenCaseStudy(item.productId)}
            style={{ '--fp-accent': item.accent }}
          >
            Read Case Study
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </article>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECONDARY CARD COMPONENT
// ═══════════════════════════════════════════════════════════
function SecondaryCard({ item }) {
  return (
    <div className="sp-card">
      <div className="sp-card-header">
        <h4 className="sp-name">{item.name}</h4>
        <span className="sp-category">{item.category}</span>
      </div>
      <p className="sp-desc">{item.desc}</p>
      <div className="sp-tags">
        {item.tags.map(t => <span key={t} className="sp-tag">{t}</span>)}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  WORK SECTION
// ═══════════════════════════════════════════════════════════
// Products with dedicated page routes instead of overlay
const ROUTED_CASE_STUDIES = { greeto: '/work/greeto', 'examly-lms': '/work/myexamly' }

export default function Work() {
  const navigate    = useNavigate()
  const [openId, setOpenId] = useState(null)
  const openProduct = PRODUCTS.find(p => p.id === openId)

  const handleOpenCaseStudy = (productId) => {
    if (ROUTED_CASE_STUDIES[productId]) {
      navigate(ROUTED_CASE_STUDIES[productId])
    } else {
      setOpenId(productId)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.work-hero-eyebrow',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '#work', start: 'top 80%' } }
      )
      gsap.fromTo('.work-hero-title',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.1,
          scrollTrigger: { trigger: '#work', start: 'top 80%' } }
      )
      gsap.fromTo('.work-hero-desc',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3,
          scrollTrigger: { trigger: '#work', start: 'top 80%' } }
      )
      gsap.fromTo('.fp-card',
        { y: 64, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: '.fp-grid', start: 'top 82%' } }
      )
      gsap.fromTo('.sp-card',
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.sp-grid', start: 'top 85%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section id="work" className="work-section">
        <div className="container">

          {/* ── Section header ── */}
          <div className="work-hero">
            <span className="work-hero-eyebrow">WORK</span>
            <h2 className="work-hero-title">Products I've Built</h2>
            <p className="work-hero-desc">
              From AI SaaS platforms and CRM systems to AgriTech ecosystems and blockchain-powered supply chains,
              I have led products from research and strategy to launch and growth.
            </p>
          </div>

          {/* ── Featured products ── */}
          <div className="fp-grid">
            {FEATURED.map(item => (
              <FeaturedCard key={item.productId} item={item} onOpenCaseStudy={handleOpenCaseStudy} />
            ))}
          </div>

          {/* ── Secondary products ── */}
          <div className="sp-section">
            <div className="sp-header">
              <span className="work-hero-eyebrow" style={{ marginBottom: '0.5rem' }}>OTHER WORK</span>
              <h3 className="sp-title">Other Products &amp; Platforms</h3>
            </div>
            <div className="sp-grid">
              {SECONDARY.map(item => <SecondaryCard key={item.id} item={item} />)}
            </div>
          </div>

        </div>
      </section>

      {openId && createPortal(
        <CaseStudy
          product={openProduct}
          allProducts={PRODUCTS}
          onClose={() => setOpenId(null)}
          onNavigate={id => setOpenId(id)}
        />,
        document.body
      )}
    </>
  )
}
