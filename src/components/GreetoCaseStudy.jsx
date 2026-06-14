import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './GreetoCaseStudy.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const META = {
  type: 'B2B SaaS — Omnichannel Messaging & Automation',
  role: 'Product Manager & Lead UX Designer',
  team: ['1 PM', '2 UX Designers', '1 UX Researcher', '4 Engineers', '1 QA'],
  timeline: 'Discovery: 6w → Design: 8w → Build: 16w → Beta: 4w',
  segments: ['SMBs (5–100 person teams)', 'Mid-market (100–500 person teams)', 'EdTech & E-commerce verticals'],
  status: 'Beta launched · Enterprise pipeline active',
}

const OUTCOMES = [
  { id: 'gr-cnt-response', to: 52,  suffix: '%',  label: 'Avg first-response time reduction across beta cohort' },
  { id: 'gr-cnt-deflect',  to: 34,  suffix: '%',  label: 'Incoming queries handled fully by bots — no human needed' },
  { id: 'gr-cnt-open',     to: 61,  suffix: '%',  label: 'WhatsApp campaign open rate (vs 19% for email, same segment)' },
  { id: 'gr-cnt-nps',      to: 67,  suffix: '',   label: 'NPS from beta cohort — 28 businesses, 6 weeks post-launch' },
]

const RESEARCH_METHODS = [
  {
    num: '01', method: 'In-Depth User Interviews', n: 25, label: 'participants',
    format: '50–70 min · Semi-structured · Remote (Google Meet) · Transcribed with Otter.ai, coded in FigJam',
    breakdown: ['8 Marketing Managers', '9 Customer Support Agents', '5 Support Team Leads', '3 Business Owners / Solo Operators'],
    sectors: ['E-commerce', 'EdTech', 'Financial Services', 'Healthcare Clinics', 'Real Estate'],
    findings: [
      '"Walk me through your last 3 hours of customer communication — every app you opened"',
      '"When was the last time a message got missed or delayed? What happened?"',
      '"If you could wave a magic wand and fix one thing about how your team handles messages?"',
      '"What does your current tool do well that you\'d be terrified to lose?"',
      '"How do you know if your WhatsApp campaigns are actually working?"',
    ],
  },
  {
    num: '02', method: 'Observational / Contextual Inquiry', n: 9, label: 'sessions',
    format: '90-min shadowing blocks during actual work hours · Live screen observation, not described workflows',
    findings: [
      'Average of 6.2 browser tabs or apps open simultaneously during a support shift',
      'Support reps copy-paste customer details between WhatsApp Web, CRM, and email — manually — multiple times per conversation',
      'Notification fatigue was visible: most had WhatsApp, Instagram, and email notifications muted to avoid overwhelm',
      'When a customer replied on a different channel, reps treated it as a new contact — no way to connect the threads',
      'Team leads had zero visibility into agent activity in real time — relied on end-of-day verbal updates',
    ],
  },
  {
    num: '03', method: 'Survey', n: 134, label: 'respondents',
    format: 'LinkedIn communities, WhatsApp BSP partner networks, EdTech Telegram groups · Quantitative + open text',
    findings: [
      '82% of respondents handle customer conversations across 3+ channels simultaneously',
      '71% report at least one missed or significantly delayed customer message per week',
      '68% manually copy customer context between tools at least once per shift',
      '79% have no reliable way to measure their team\'s response performance',
      '63% would pay for a unified tool that replaced their current stack if it covered all their channels',
    ],
  },
  {
    num: '04', method: 'Competitive Teardown', n: 8, label: 'platforms',
    format: 'Gallabox · AiSensy · Wati · Kommo · WapCRM · Intercom · Freshdesk · Tidio · 7 evaluation dimensions',
    findings: [
      'Most tools do WhatsApp well but treat email as an afterthought — no competitor unified all 5 channels with equal depth',
      'Bot builders in Gallabox and AiSensy assume technical knowledge — non-technical users consistently failed in testing',
      'Analytics exist but are backward-looking — none give actionable "do this next" guidance',
      'No tool has intelligent auto-routing or load-balancing across agents',
      'Per-channel pricing ($20/channel/month) creates a barrier that grows as businesses expand to 3+ numbers',
    ],
  },
  {
    num: '05', method: 'Diary Study', n: 11, label: 'participants',
    format: '2 weeks · Daily WhatsApp voice notes (!) — 2-min recordings each morning about previous day\'s pain points',
    findings: [
      'Monday mornings & post-holiday periods created backlogs that took 3–4 hours to clear — no prioritization tool existed',
      'Marketing managers felt "invisible" — they sent campaigns but had no idea what happened after the broadcast',
      'Support agents feared going to lunch because they\'d miss messages — no handoff or coverage mechanism existed',
      'Solo business owners felt "chained to their phone" — no way to set expectations with customers during off-hours',
      'Team leads described managing by "walking around and asking" — no dashboard existed to give visibility without interrupting agents',
    ],
  },
]

const AFFINITY_THEMES = [
  {
    icon: '🧵', theme: 'The Invisible Thread Problem', count: '19 of 25 interviewees',
    desc: 'When a customer contacts you on WhatsApp, then emails, then replies to your Instagram post — these are treated as 3 separate strangers by every tool in market. Teams lose the thread completely.',
  },
  {
    icon: '🕳', theme: 'The Ownership Vacuum', count: '17 of 25 interviewees',
    desc: 'No one knows who owns which conversation. Teams develop workarounds — color-coded WhatsApp labels, Notion tracking sheets, verbal handoffs — all fragile and invisible to leadership.',
  },
  {
    icon: '🤖', theme: 'Automation Aspiration, Execution Failure', count: '14 of 25 attempted & abandoned',
    desc: 'Every team wants bots. Almost every team that tried building one gave up. The builder UX — in every existing tool — assumes technical knowledge that support agents don\'t have.',
  },
  {
    icon: '🌑', theme: 'Campaign Blindness', count: 'All 8 marketing managers',
    desc: 'Marketing managers send bulk WhatsApp messages and genuinely don\'t know what happened. Delivered? Opened? Replied to? Converted? All black boxes.',
  },
  {
    icon: '📡', theme: 'Leadership Visibility Gap', count: 'All 5 team leads',
    desc: 'Team leads manage by walking around. They have no real-time view of queue length, agent load, or SLA status. They find out about problems after customers complain.',
  },
]

const JTBDS = [
  {
    id: 'JTBD-01', actor: 'Support Agent', freq: 'Every shift (daily)', driver: 'Relief / Control',
    job: 'When I start my shift, I want to immediately know which conversations need my attention and in what order — so I can start working without spending 20 minutes figuring out where I left off.',
    workaround: 'Scrolling through WhatsApp manually, checking Instagram DMs, opening email inbox — in sequence, with no priority signal.',
  },
  {
    id: 'JTBD-02', actor: 'Support Agent', freq: 'Every conversation', driver: 'Confidence / Professionalism',
    job: 'When a customer messages me, I want to see their entire history — every channel, every conversation — in one place before I reply, so I don\'t make them repeat themselves.',
    workaround: 'Manually searching the customer\'s phone number across WhatsApp, email, and CRM — if they even use the same identifier.',
  },
  {
    id: 'JTBD-03', actor: 'Marketing Manager', freq: 'Every campaign (2–4× per month)', driver: 'Accountability / ROI proof',
    job: 'When I send a WhatsApp campaign, I want to know within hours whether it\'s working — opens, replies, conversions — so I can decide whether to follow up or change the message.',
    workaround: 'Counting manual replies. Literally counting.',
  },
  {
    id: 'JTBD-04', actor: 'Support Team Lead', freq: 'Throughout the workday', driver: 'Control / Accountability',
    job: 'When I\'m in a meeting or away from my desk, I want to see in real time whether my team is keeping up with the queue — so I can step in or reassign before SLAs break.',
    workaround: 'WhatsApp group messages to agents asking for status updates.',
  },
  {
    id: 'JTBD-05', actor: 'Business Owner / Solo Operator', freq: 'Always-on background need', driver: 'Freedom / Peace of mind',
    job: 'When I\'m busy or away, I want routine customer questions to be handled automatically — so I don\'t lose leads or reputation during off-hours.',
    workaround: 'WhatsApp auto-reply with static "We\'ll get back to you" — no resolution, no qualification.',
  },
  {
    id: 'JTBD-06', actor: 'Support Agent', freq: 'Multiple times per week', driver: 'Team cohesion / CX',
    job: 'When I need to hand off a conversation to a teammate, I want them to have full context without me having to explain — so the customer experience doesn\'t degrade during transitions.',
    workaround: 'Forwarding WhatsApp messages and typing a long explanation in a separate chat.',
  },
]

const KEY_INSIGHTS = [
  {
    id: 'INS-01',
    insight: 'The real problem isn\'t too many channels — it\'s the absence of a customer identity layer that connects them.',
    evidence: 'When a customer sends a WhatsApp and then emails, they appear as 2 strangers. Teams don\'t miss messages because they aren\'t checking — they miss them because they don\'t recognize the same customer across channels.',
    principle: 'Build a unified contact profile that merges all channel interactions under one identity, not a tabbed inbox.',
  },
  {
    id: 'INS-02',
    insight: 'Bot builders fail because they\'re designed by engineers for engineers — support agents need a conversational, not technical, metaphor.',
    evidence: '14 of 25 interviewees tried building a bot in an existing tool and gave up. When shown a decision-tree framing ("If customer says X → say Y"), all 14 said "that I could do myself".',
    principle: 'Design the bot builder around conversation scenarios, not logic gates. Use plain language, not technical node labels.',
  },
  {
    id: 'INS-03',
    insight: 'Campaign analytics aren\'t used because they require too much effort to access — the insight needs to come to the user, not the other way around.',
    evidence: '78% of marketing respondents rarely check their analytics platform. When asked "what if it showed you campaign results in the same place you sent it?" — 94% said they\'d use that.',
    principle: 'Surface analytics in context, immediately after the action. Don\'t build a separate analytics page as the primary destination.',
  },
  {
    id: 'INS-04',
    insight: 'Team leads don\'t need more reports — they need a live operational view they can glance at in 10 seconds.',
    evidence: 'Team leads described their ideal as "something like an air traffic control view — who\'s handling what, what\'s queued, what\'s about to breach". Every tool they\'d used gave them historical charts — useless for real-time intervention.',
    principle: 'Build a live team dashboard as a first-class view — not a sub-page of analytics. It\'s an operational tool, not a reporting tool.',
  },
  {
    id: 'INS-05',
    insight: 'Message templates are the most undervalued time-saver — but they\'re buried, inconsistent, and not shareable across teams in any existing tool.',
    evidence: 'Agents keep personal templates in WhatsApp Saved Messages, Apple Notes, or shared Google Docs. Teams with shared template libraries reported 3× faster response times.',
    principle: 'Make templates a team-first, centrally managed resource — not a personal shortcut. Include version control and usage analytics.',
  },
]

const PERSONAS = [
  {
    id: 'P-01', name: 'Amit Sharma', archetype: 'The Overwhelmed Agent',
    age: 26, role: 'Customer Support Agent', company: 'D2C E-commerce brand, 35 employees', location: 'Pune, India',
    tools: ['WhatsApp Business App', 'Gmail', 'Instagram App', 'Google Sheets for tracking'],
    quote: 'By the time I see a message on Instagram, the customer has already complained on WhatsApp. I never know which app to check first.',
    goals: ['Handle every customer inquiry within 1 hour', 'Never let a message fall through the cracks', 'Look professional and responsive even during busy periods'],
    frustrations: ['6+ tabs/apps open at all times — physically tiring', 'Teammates don\'t know what he\'s handling — double-replies happen', 'No way to see customer history — asks "Can you remind me of your order number?" every time', 'Template messages stored in his own notes — not shared with the team'],
    behaviors: ['Checks WhatsApp first (highest volume), then Gmail, then Instagram — in a manual rotation', 'Marks WhatsApp chats as Unread to "remember" to follow up — inbox perpetually shows 23 unread', 'Texts teammates on a separate WhatsApp group to coordinate'],
    success: 'One screen. Every message. Clear ownership. Customer history visible before I even reply.',
    state: 'Anxious · Reactive · Genuinely wants to do a good job but the tools work against him',
    color: '#38BDF8',
  },
  {
    id: 'P-02', name: 'Priya Nair', archetype: 'The Campaign-Blind Marketer',
    age: 31, role: 'Marketing Manager', company: 'Online EdTech platform, 60 employees', location: 'Bangalore, India',
    tools: ['AiSensy for WhatsApp broadcasts', 'Mailchimp for email', 'Meta Business Suite for Instagram', 'Excel for tracking'],
    quote: 'I send 5,000 WhatsApp messages and then wait for replies to trickle in. I have no idea if it worked until the sales team tells me at the end of the month.',
    goals: ['Run coordinated campaigns across WhatsApp and Instagram', 'See real-time results before the response window closes', 'Segment audience and retarget non-responders without doing it manually'],
    frustrations: ['AiSensy only shows "delivered" — not opened, not replied, not converted', 'Running a campaign on WhatsApp and Instagram means logging into 2 different tools with different UIs', 'Re-engagement sequences are fully manual — exports a list and sends again', 'Can\'t A/B test messages — sends one version and hopes'],
    behaviors: ['Plans campaigns in a shared Google Sheet, then manually executes across tools', 'Refreshes broadcast status multiple times per hour on launch day — has no real-time signal', 'Builds audience segments in Excel by filtering contacts — then imports into each tool separately'],
    success: 'One wizard where I pick my channels, write my message, set my audience, and watch the results come in — on the same screen.',
    state: 'Competent but flying blind · Knows she could do better if the tools matched her ambition',
    color: '#A855F7',
  },
  {
    id: 'P-03', name: 'Sneha Reddy', archetype: 'The Visibility-Starved Team Lead',
    age: 38, role: 'Head of Customer Experience', company: 'SaaS company, 120 employees, 8-person support team', location: 'Hyderabad, India',
    tools: ['Freshdesk (email tickets only)', 'WhatsApp Business on shared phone', 'Excel for SLA tracking', 'WhatsApp group for team coordination'],
    quote: 'I manage 8 agents and I genuinely don\'t know at 2pm whether we\'re on track for the day or about to miss 15 SLAs. I find out when customers escalate.',
    goals: ['Real-time visibility into team queue and agent load — without interrupting agents', 'SLA tracking that flags issues before they become complaints', 'Consistent quality across the team — every agent using the same templates and tone', 'Data to report upward: response times, resolution rates, CSAT'],
    frustrations: ['Freshdesk handles email only — WhatsApp is a free-for-all on a shared phone', 'No way to see who\'s handling what across channels in real time', 'CSAT measurement is manual — a WhatsApp message asking "How was your experience?" sent individually', 'New agents take 3 weeks to reach speed because there\'s no structured guidance or shared resources'],
    behaviors: ['Walks around the office asking agents for status updates — or sends WhatsApp messages to her own team', 'Pulls an Excel report every Friday to understand the week — always too late to fix anything', 'Sets up a "morning sync" call purely to coordinate coverage — takes 30 mins every day'],
    success: 'A live dashboard I can open on my laptop and immediately know: queue depth, agent load, SLA status, no surprises.',
    state: 'Accountable for outcomes she can\'t see · Competent leader working with 2010-era tools',
    color: '#34D399',
  },
]

const HMW = [
  { hmw: 'How might we give support agents a single place to see and respond to all messages — without requiring them to mentally switch contexts between channels?', persona: 'P-01 Amit' },
  { hmw: 'How might we show marketing managers their campaign results in real-time, in the same place they created the campaign?', persona: 'P-02 Priya' },
  { hmw: 'How might we give team leads a live operational view — not a report — of their team\'s queue and performance?', persona: 'P-03 Sneha' },
  { hmw: 'How might we make building a chatbot as intuitive as writing a script — so a non-technical support agent can do it without training?', persona: 'P-01 + P-03' },
  { hmw: 'How might we unify a customer\'s identity across all channels so agents never ask "remind me of your order number" again?', persona: 'P-01 Amit' },
  { hmw: 'How might we make team message templates a shared, managed resource — not a personal workaround stored in someone\'s notes?', persona: 'P-01 + P-03' },
]

const DESIGN_PRINCIPLES = [
  { principle: 'One identity, all channels', rationale: 'A customer is one person regardless of which channel they use. Every feature should treat the contact as the center, not the channel.' },
  { principle: 'Operational visibility over historical reporting', rationale: 'Team leads need to act now, not understand last month. Design for real-time intervention, not retrospective analysis.' },
  { principle: 'Automation in plain language', rationale: 'Bot and automation features must be comprehensible to a support agent with no technical background. If it needs a manual, it\'s too complex.' },
  { principle: 'Bring the insight to the action', rationale: 'Analytics belong where decisions are made — inside the campaign view, inside the conversation — not in a separate dashboard requiring navigation.' },
  { principle: 'Shared over personal', rationale: 'Everything that exists as a personal workaround today (templates, tags, tracking sheets) should become a team resource in Greeto. Individual efficiency is a ceiling; team systems are a multiplier.' },
  { principle: 'Progressive disclosure of complexity', rationale: 'A new agent on day one and a power user with 50 bots are using the same product. Surface the simple path by default; reveal advanced capabilities on demand.' },
]

const NAV_ITEMS = [
  {
    id: 'NAV-01', label: 'Inbox', icon: '💬',
    desc: 'Unified conversation view across all channels',
    user: 'Support Agents (daily primary home)',
    badge: 'Unread count (live)',
    subs: ['All Conversations', 'Mine', 'Unassigned', 'WhatsApp', 'Instagram', 'Email', 'SMS', 'Live Chat', 'Resolved', 'Archived'],
  },
  {
    id: 'NAV-02', label: 'Campaigns', icon: '📢',
    desc: 'Broadcast and drip campaign management',
    user: 'Marketing Managers',
    badge: 'None (visited intentionally)',
    subs: ['All Campaigns', 'Broadcasts', 'Drip Sequences', 'Templates Library', 'Scheduled', 'Drafts'],
  },
  {
    id: 'NAV-03', label: 'Bots', icon: '🤖',
    desc: 'Visual chatbot and automation flow builder',
    user: 'Team Leads / Ops',
    badge: 'None',
    subs: ['Active Bots', 'Draft Bots', 'Flow Templates', 'Bot Analytics'],
  },
  {
    id: 'NAV-04', label: 'Contacts', icon: '👥',
    desc: 'Unified CRM — all customer profiles with cross-channel history',
    user: 'Support Agents + Marketing Managers',
    badge: 'None',
    subs: ['All Contacts', 'Segments', 'Tags', 'Import / Export'],
  },
  {
    id: 'NAV-05', label: 'Analytics', icon: '📊',
    desc: 'Team performance, conversation metrics, campaign analytics, bot performance',
    user: 'Team Leads (daily)',
    badge: 'SLA breach alert badge if active',
    subs: ['Live Team View', 'Conversation Reports', 'Campaign Reports', 'Agent Performance', 'Bot Performance', 'Custom Reports'],
  },
  {
    id: 'NAV-06', label: 'Settings', icon: '⚙️',
    desc: 'Channel integrations, team management, roles, billing — configuration only',
    user: 'Admin / Owner',
    badge: 'None (destination, not daily home)',
    subs: ['Integrations', 'Team Members', 'Roles & Permissions', 'Templates (company-level)', 'Notifications', 'Billing & Plan', 'Security', 'Audit Log'],
  },
]

const IA_LEVELS = {
  L1: 'Greeto Workspace (tenant)',
  L2: ['Inbox', 'Campaigns', 'Bots', 'Contacts', 'Analytics', 'Settings'],
  L3: {
    Inbox: ['All', 'Mine', 'Unassigned', 'By Channel', 'Resolved'],
    Campaigns: ['List View', 'Campaign Detail', 'New Campaign Wizard', 'Template Library'],
    Bots: ['Bot List', 'Bot Canvas (Editor)', 'Bot Analytics', 'Template Gallery'],
    Contacts: ['Contact List', 'Contact Profile', 'Segment Builder'],
    Analytics: ['Live Dashboard', 'Report Views', 'Export'],
    Settings: ['Integration Setup', 'User Management', 'Role Editor', 'Billing'],
  },
  L4: {
    Inbox: ['Conversation Thread', 'Contact Side Panel', 'Assign Modal', 'Template Picker'],
    Campaigns: ['Step 1: Channels', 'Step 2: Audience', 'Step 3: Content', 'Step 4: Schedule', 'Step 5: Review'],
    Bots: ['Node Properties Panel', 'Test Emulator', 'Deploy Modal'],
    Contacts: ['Contact Detail Drawer', 'Conversation History Timeline', 'Tag Manager'],
  },
}

const IA_NOTE = 'Research revealed users think in 3 modes — reactive (handling incoming), proactive (reaching out), and systemic (automating + measuring). The IA maps directly to these modes. We deliberately avoided organizing by channel (a common mistake in competitors) because users don\'t think "now I\'ll check my WhatsApp module" — they think "I need to handle my queue".'

const UX_FLOWS = [
  {
    flow_id: 'UXF-01', flow_name: 'Agent Starts Shift — Unified Inbox',
    actor: 'Amit — Support Agent',
    trigger: 'Agent logs in at start of shift',
    goal: 'Understand current message queue, claim ownership of conversations, start responding',
    steps: [
      { step: 1, screen: 'Login Screen', action: 'Agent enters credentials, clicks Sign In. Auth verified, workspace loads.', decision: null },
      { step: 2, screen: 'Inbox — All Conversations', action: 'Agent lands on Inbox. Conversation list sorted by urgency (unread + oldest first). Left panel: conversation list with channel icon, contact name, last message snippet, time, unread badge.', decision: 'Default sort is urgency, not chronological — validated as the highest-value change vs existing tools. Longest-waiting unread conversations surface first.' },
      { step: 3, screen: 'Inbox — Conversation Selected', action: 'Agent clicks a conversation. Full thread loads in center panel. Contact profile panel appears on far right: name, tags, channel history summary, last order / key CRM info.', decision: 'Contact panel is always visible when a conversation is open — agents should never have to navigate away to see customer context.' },
      { step: 4, screen: 'Inbox — Compose Reply', action: 'Agent reads messages, clicks Reply. Composer activates. Template suggestions appear based on conversation topic (AI-assisted). "Sending via WhatsApp" channel indicator visible.', decision: null },
      { step: 5, screen: 'Inbox — Send Message', action: 'Agent selects a template, personalizes it, hits Send. Message sent via appropriate channel API. Delivery status updates in real time.', decision: 'Optimistic UI: new message bubble appears immediately. Status: Sending → Sent → Delivered (with tick icons).' },
      { step: 6, screen: 'Inbox — Assign & Tag', action: 'Agent assigns conversation to themselves (Claim) and adds a tag ("Returns"). Conversation now visible under "Mine" filter.', decision: null },
      { step: 7, screen: 'Inbox — Resolve', action: 'After resolution, agent clicks Resolve. Conversation moves to Resolved. CSAT prompt sent to customer automatically (if configured).', decision: null },
    ],
    edge_cases: [
      'Network drops mid-send: message marked "Failed", retry button appears inline',
      'Another agent is already typing: "Sneha is typing..." indicator shown to prevent simultaneous replies',
      'WhatsApp 24-hour window expired: composer shows warning + alternative (send WhatsApp template vs switch to SMS/email)',
    ],
    metrics: ['Time to first reply', 'Conversations resolved per session', 'Template usage rate', 'Escalation rate'],
  },
  {
    flow_id: 'UXF-02', flow_name: 'Marketing Manager Creates & Sends Campaign',
    actor: 'Priya — Marketing Manager',
    trigger: 'Priya wants to send a promotional campaign to enrolled students on WhatsApp + Instagram',
    goal: 'Set up, launch, and monitor a multi-channel campaign without leaving the platform',
    steps: [
      { step: 1, screen: 'Campaigns — List View', action: 'Priya navigates to Campaigns, clicks "New Campaign". Campaign wizard modal opens with 5-step indicator.', decision: null },
      { step: 2, screen: 'Wizard — Step 1: Channels', action: 'Priya selects WhatsApp and Instagram checkboxes. System checks connected channels, confirms both active. Channel cards with status indicators.', decision: 'WhatsApp note inline: "Template approval required for new message formats — use a pre-approved template or allow 24hr review." Surfaced at channel selection, not at launch.' },
      { step: 3, screen: 'Wizard — Step 2: Audience', action: 'Priya selects "All Enrolled — June 2025" segment from dropdown. Contact count loads dynamically: "1,847 contacts will receive this campaign". Option to "Create new segment" inline. Exclusion list option ("Exclude: Paid students").', decision: 'Live contact count updates on segment selection — immediate quantification prevents over-messaging.' },
      { step: 4, screen: 'Wizard — Step 3: Content', action: 'Priya writes message content, adds image, adds CTA button. Split view: Editor (left) + Live Preview (right). Preview toggles between channel previews — WhatsApp green bubble vs Instagram DM style.', decision: 'Per-channel live preview was the highest-tested feature in prototype sessions. Priya could see exactly what Amit would receive on WhatsApp.' },
      { step: 5, screen: 'Wizard — Step 4: Schedule', action: 'Priya sets send time: "Tomorrow at 10:00 AM IST". Smart suggestion: "Best open rate window for your audience: 10am–12pm IST (based on past campaign data)."', decision: null },
      { step: 6, screen: 'Wizard — Step 5: Review & Confirm', action: 'Priya reviews summary: channels, audience count, send time, message preview, estimated cost. Clicks "Schedule Campaign". Campaign saved in queue.', decision: null },
      { step: 7, screen: 'Campaign Detail — Live Tracking', action: 'Priya returns on send day. Live progress bar: "1,200 / 1,847 sent". Stats: Delivered %, Opened %, Replied %, Link Clicked %. Option to Pause mid-send.', decision: null },
      { step: 8, screen: 'Campaign Detail — Post-Send Analytics', action: 'Priya reviews final performance: Reach, Open Rate, Reply Rate, CTA Click Rate, Unsubscribes. "Retarget non-openers" CTA visible. Export button.', decision: 'Analytics live on the same Campaign Detail page — no navigation required. The result is where the send happened.' },
    ],
    edge_cases: [
      'WhatsApp template rejected: System flags it pre-launch with specific rejection reason from Meta + suggestions to fix',
      'Audience size exceeds plan limit: Warning shown at Step 2 with upgrade prompt — before any content is written',
      'Duplicate send prevention: If same audience + same template sent within 24hrs, system warns "You may be double-messaging these contacts"',
    ],
    metrics: ['Campaign delivery rate', 'Open rate', 'Reply rate', 'CTA click rate', 'Conversion rate', 'Unsubscribe rate'],
  },
  {
    flow_id: 'UXF-03', flow_name: 'Support Agent Builds First Chatbot',
    actor: 'Amit — Support Agent (or Sneha — Team Lead)',
    trigger: 'Team wants to automate responses to "What are your hours?" and "How do I return an item?"',
    goal: 'Build and deploy a working FAQ bot on WhatsApp without any coding',
    steps: [
      { step: 1, screen: 'Bots — List View', action: 'User clicks "Create New Bot". "Use a template?" prompt shown first. Template gallery: FAQ Bot, Lead Qualification, Appointment Booking, Order Status.', decision: 'Template-first approach dramatically reduces abandonment. 92% of beta users who started from a template completed deployment vs 31% who started from scratch.' },
      { step: 2, screen: 'Bot Canvas — Template Loaded', action: 'User selects "FAQ Bot" template. Canvas opens with pre-built structure: Welcome Message → Customer selects topic → Branch: Hours / Returns / Other → Respective replies.', decision: null },
      { step: 3, screen: 'Bot Canvas — Edit Node', action: 'User clicks the "What are your hours?" reply node. Properties panel expands on right with editable fields. Plain language framing: "When customer asks about hours, Greeto will say:" [text box]', decision: 'All node labels use plain language ("When customer says X, we reply Y") — not technical language ("trigger → response node → conditional branch"). This single framing change was the key to bot builder adoption.' },
      { step: 4, screen: 'Bot Canvas — Test Emulator', action: 'User clicks "Test Bot". Chat emulator panel slides in showing a phone mockup. User types in emulator. Bot responds per flow. Nodes highlight on canvas as they\'re triggered — visual trace of execution.', decision: null },
      { step: 5, screen: 'Bot Canvas — Deploy', action: 'User clicks "Activate Bot". Deployment modal: channel checkboxes (WhatsApp, Instagram), hours toggle (24/7 vs after-hours only). Bot appears in list with green "Active" pill.', decision: null },
    ],
    edge_cases: [
      'User creates a loop (bot path leads back to itself): Visual warning on canvas "This path creates a loop — add an exit step"',
      'Bot node has no reply configured: Canvas shows red border on node + blocks activation until resolved',
      'WhatsApp bot activation requires pre-approved message templates: System flags this and surfaces template selector inline',
    ],
    metrics: ['Bot completion rate', 'Handoff-to-agent rate', 'Bot deflection rate', 'Fallback trigger rate (when bot can\'t understand)'],
  },
  {
    flow_id: 'UXF-04', flow_name: 'Team Lead Reviews Live Team Performance',
    actor: 'Sneha — Head of Customer Experience',
    trigger: 'Sneha opens her laptop at 2pm to check team status',
    goal: 'Understand in under 30 seconds whether team is on track, who\'s overloaded, what might breach SLA',
    steps: [
      { step: 1, screen: 'Analytics — Live Team View', action: 'Sneha clicks Analytics → Live Team View. Hero metrics row: Open Conversations (total), Avg Wait Time (live), SLA Breaches Today, Resolved Today. Below: Agent Cards — avatar, name, # open conversations, status (online/away), last activity timestamp.', decision: 'This is the only view that auto-refreshes every 30 seconds without user action. Sneha should be able to glance at this like a flight board — designed for 10-second comprehension, not analysis.' },
      { step: 2, screen: 'Analytics — Agent Card Drill-down', action: 'Sneha notices one agent has 12 open conversations (others have 3–5). Clicks their card. Agent detail panel slides in showing full current queue. Each conversation: channel icon, customer name, wait time, topic tag. Sneha can reassign any conversation from here with 1 click.', decision: null },
      { step: 3, screen: 'Analytics — SLA Alert', action: 'SLA breach counter shows 2 conversations >2hr without response. Alert bar at top (red). Conversation cards in alert list with "Reassign" button on each. Sneha reassigns one to herself, one to an available agent.', decision: null },
      { step: 4, screen: 'Analytics — Conversation Reports', action: 'Sneha clicks to see today\'s full report. Charts: conversations by channel, first response time trend, resolution time trend, busiest hour heatmap. Filters: date range, channel, agent. Export to CSV.', decision: null },
    ],
    edge_cases: [
      'All agents offline: Dashboard shows alert banner "No agents currently active. X conversations waiting."',
      'High volume spike: System triggers a notification to Sneha if queue exceeds threshold she configures (e.g. >20 open conversations)',
    ],
    metrics: ['Queue depth at time of check', 'SLA breach rate', 'Agent load balance', 'Time to intervention on alerts'],
  },
  {
    flow_id: 'UXF-05', flow_name: 'Admin Connects WhatsApp & Invites Team',
    actor: 'IT Admin / Business Owner',
    trigger: 'Company just subscribed to Greeto Pro — needs to set up the workspace',
    goal: 'Connect WhatsApp Business API, invite 5 team members, go live in <1 hour',
    steps: [
      { step: 1, screen: 'Onboarding Checklist (post-signup)', action: 'Admin lands on onboarding checklist after first login. 5 setup steps with completion indicators. Progress bar: 0/5. Each card has a CTA button.', decision: 'Checklist is dismissible but persistent in sidebar as a progress ring until 5/5 complete. Leaving it visible increases setup completion rate vs hiding after first login.' },
      { step: 2, screen: 'Settings — Integrations — WhatsApp Setup', action: 'Admin clicks "Connect WhatsApp". 3 options: Meta Official (self-serve), Twilio, 360dialog. Recommended card: Meta Official. Admin selects → redirected to Meta\'s embedded signup flow.', decision: null },
      { step: 3, screen: 'Meta Embedded Signup → returned to Greeto', action: 'Admin completes Meta\'s WhatsApp Business verification. Webhook registered. WhatsApp number connected. Integration card shows green "Connected" pill. Test message button: "Send a test message to yourself."', decision: null },
      { step: 4, screen: 'Settings — Team Members', action: 'Admin clicks "Invite Team", enters 5 email addresses (comma-separated), assigns roles (Admin / Manager / Agent). Invites sent. Team members receive email with magic link. Pending invites list shows status (Pending / Accepted).', decision: null },
      { step: 5, screen: 'Onboarding Checklist — Updated', action: 'Admin returns to checklist, sees 2/5 complete. "Nice work! You\'re 40% set up. Next: Create your first message template." Remaining steps in suggested order.', decision: null },
    ],
    edge_cases: [
      'Meta signup fails (business not verified): Greeto shows specific error from Meta + link to Meta\'s verification guide',
      'Invited email already exists in system: User notified, existing role shown with option to update permissions',
      'WhatsApp number already connected to another BSP: System detects conflict and guides admin through migration steps',
    ],
    metrics: ['Setup completion rate', 'Time to first channel connection', 'Team invite acceptance rate', 'Time to first message sent'],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FlowViewer({ flows }) {
  const [active, setActive] = useState(0)
  const flow = flows[active]

  return (
    <div className="gr-flow-viewer">
      <div className="gr-flow-tabs">
        {flows.map((f, i) => (
          <button
            key={f.flow_id}
            className={`gr-flow-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="gr-flow-tab-id">{f.flow_id}</span>
            <span className="gr-flow-tab-name">{f.flow_name}</span>
          </button>
        ))}
      </div>

      <div className="gr-flow-meta-bar">
        <div className="gr-fmeta"><span className="gr-fmeta-k">Actor</span><span className="gr-fmeta-v">{flow.actor}</span></div>
        <div className="gr-fmeta"><span className="gr-fmeta-k">Trigger</span><span className="gr-fmeta-v">{flow.trigger}</span></div>
        <div className="gr-fmeta gr-fmeta--goal"><span className="gr-fmeta-k">Goal</span><span className="gr-fmeta-v">{flow.goal}</span></div>
      </div>

      <div className="gr-flow-steps">
        {flow.steps.map((s, i) => (
          <div className="gr-flow-step" key={s.step}>
            <div className="gr-step-spine">
              <div className="gr-step-circle">{s.step}</div>
              {i < flow.steps.length - 1 && <div className="gr-step-line" />}
            </div>
            <div className="gr-step-body">
              <div className="gr-step-screen">{s.screen}</div>
              <p className="gr-step-action">{s.action}</p>
              {s.decision && (
                <div className="gr-step-decision">
                  <span className="gr-decision-pill">Design Decision</span>
                  {s.decision}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="gr-flow-edge">
        <div className="gr-flow-sub-label">Edge Cases</div>
        <div className="gr-edge-list">
          {flow.edge_cases.map((e, i) => (
            <div className="gr-edge-case" key={i}>
              <span className="gr-edge-icon">⚠</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gr-flow-metrics-row">
        <div className="gr-flow-sub-label">Metrics Tracked</div>
        <div className="gr-metrics-tags">
          {flow.metrics.map(m => <span key={m} className="gr-metric-tag">{m}</span>)}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GreetoCaseStudy() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gr-reveal').forEach(el => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' } }
        )
      })
      gsap.utils.toArray('.gr-reveal-stagger').forEach(parent => {
        gsap.fromTo(Array.from(parent.children),
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: parent, start: 'top 90%' } }
        )
      })

      OUTCOMES.forEach(({ id, to, suffix }) => {
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
    <motion.div
      ref={pageRef}
      className="gr-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <button className="gr-back-btn" onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Back
      </button>

      {/* ══ COVER ═══════════════════════════════════════════════════════════ */}
      <header className="gr-cover">
        <div className="gr-cover-bg" aria-hidden="true" />

        {/* Floating channel bubbles */}
        <div className="gr-cover-bubbles" aria-hidden="true">
          <div className="gr-bubble gr-bubble--wa">
            <span className="gr-bubble-icon">W</span>
            <span>Hey I ordered the wrong size...</span>
          </div>
          <div className="gr-bubble gr-bubble--ig">
            <span className="gr-bubble-icon">@</span>
            <span>Quick Q about delivery dates?</span>
          </div>
          <div className="gr-bubble gr-bubble--email">
            <span className="gr-bubble-icon">✉</span>
            <span>Following up on my support ticket</span>
          </div>
          <div className="gr-bubble gr-bubble--sms">
            <span className="gr-bubble-icon">💬</span>
            <span>My order #4821 hasn't arrived</span>
          </div>
        </div>

        <div className="gr-cover-inner container">
          <div className="gr-cover-meta">
            <span className="gr-eyebrow">Case Study</span>
            <span className="gr-cover-type">{META.type}</span>
          </div>

          <h1 className="gr-cover-title">
            Greeto<span className="gr-cover-dot">.</span>
          </h1>

          <p className="gr-cover-subtitle">
            How we unified WhatsApp, Instagram, Email, SMS & Live Chat into one AI-powered workspace
            — and redesigned how SMB teams handle customer conversations.
          </p>

          <div className="gr-cover-team-row">
            <div className="gr-team-item">
              <span className="gr-team-k">Role</span>
              <span>{META.role}</span>
            </div>
            <div className="gr-team-item">
              <span className="gr-team-k">Timeline</span>
              <span>{META.timeline}</span>
            </div>
            <div className="gr-team-item">
              <span className="gr-team-k">Status</span>
              <span className="gr-status-pill">{META.status}</span>
            </div>
          </div>

          <div className="gr-cover-kpis">
            {OUTCOMES.map(o => (
              <div className="gr-cover-kpi" key={o.id}>
                <span id={o.id} className="gr-kpi-value">{o.to}{o.suffix}</span>
                <span className="gr-kpi-label">{o.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gr-scroll-hint">
          <div className="gr-scroll-mouse"><div className="gr-scroll-wheel" /></div>
          <span>Scroll</span>
        </div>
      </header>

      <div className="container gr-content">

        {/* ══ CH01 — EXECUTIVE SUMMARY ════════════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">01</span>
            <span className="gr-eyebrow">Executive Summary</span>
          </div>

          <div className="gr-exec-grid gr-reveal-stagger">
            <div className="gr-exec-card gr-exec-card--problem">
              <span className="gr-exec-tag">Problem</span>
              <p className="gr-exec-body">Business teams were drowning in 5–7 separate messaging apps with no shared context, no automation, and no way to measure what was actually working.</p>
            </div>
            <div className="gr-exec-card gr-exec-card--solution">
              <span className="gr-exec-tag">Solution</span>
              <p className="gr-exec-body">Greeto collapses every customer conversation channel into one AI-powered workspace — with team routing, visual bot builder, campaign engine, and real-time analytics.</p>
            </div>
          </div>

          <div className="gr-design-challenge gr-reveal">
            <span className="gr-dc-label">Design Challenge</span>
            <p className="gr-dc-text">
              How do you build a platform powerful enough for a Head of Customer Service and simple enough for a first-day support rep — without creating two different products?
            </p>
          </div>

          <div className="gr-outcome-grid gr-reveal-stagger">
            {[
              { stat: '52%', label: 'First-response time reduction', sub: 'Across beta cohort' },
              { stat: '34%', label: 'Bot deflection rate', sub: 'No human needed' },
              { stat: '61%', label: 'WhatsApp campaign open rate', sub: 'vs 19% for email' },
              { stat: '2.3×', label: 'Agent efficiency', sub: 'More conversations/day vs baseline' },
              { stat: '67', label: 'NPS — beta cohort', sub: '28 businesses · 6 weeks post-launch' },
            ].map(o => (
              <div className="gr-outcome-card" key={o.stat}>
                <span className="gr-outcome-num">{o.stat}</span>
                <span className="gr-outcome-label">{o.label}</span>
                <span className="gr-outcome-sub">{o.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH02 — DISCOVERY ════════════════════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">02</span>
            <span className="gr-eyebrow">Discovery Phase</span>
          </div>

          <h2 className="gr-section-title gr-reveal">
            Five research methods. <span className="gr-blue">Across 4 sectors.</span>{' '}
            One consistent failure pattern.
          </h2>

          <p className="gr-body gr-reveal">
            We ran a 6-week discovery sprint — not just interviews, but live shadowing of support
            shifts, diary studies via WhatsApp voice notes, a 134-person survey, and a systematic
            teardown of 8 competitor tools. The goal: understand the real workflow, not the described one.
          </p>

          <div className="gr-research-grid gr-reveal-stagger">
            {RESEARCH_METHODS.map(r => (
              <div className="gr-research-card" key={r.num}>
                <div className="gr-research-header">
                  <span className="gr-research-num">{r.num}</span>
                  <div className="gr-research-n">
                    <span className="gr-n-val">{r.n}</span>
                    <span className="gr-n-label">{r.label}</span>
                  </div>
                </div>
                <h3 className="gr-research-method">{r.method}</h3>
                <p className="gr-research-format">{r.format}</p>
                {r.breakdown && (
                  <div className="gr-research-breakdown">
                    {r.breakdown.map(b => <span key={b} className="gr-breakdown-pill">{b}</span>)}
                  </div>
                )}
                <ul className="gr-research-findings">
                  {r.findings.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH03 — SYNTHESIS ════════════════════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">03</span>
            <span className="gr-eyebrow">Synthesis & Insights</span>
          </div>

          <h2 className="gr-section-title gr-reveal">
            5 themes. 6 jobs to be done. 5 insights that shaped every{' '}
            <span className="gr-blue">product decision</span>.
          </h2>

          {/* Affinity Themes */}
          <h3 className="gr-sub-heading gr-reveal">Affinity Map — What We Heard Most</h3>
          <div className="gr-affinity-grid gr-reveal-stagger">
            {AFFINITY_THEMES.map(a => (
              <div className="gr-affinity-card" key={a.theme}>
                <span className="gr-affinity-icon">{a.icon}</span>
                <div className="gr-affinity-count">{a.count}</div>
                <h4 className="gr-affinity-theme">{a.theme}</h4>
                <p className="gr-affinity-desc">{a.desc}</p>
              </div>
            ))}
          </div>

          {/* JTBDs */}
          <h3 className="gr-sub-heading gr-reveal" style={{ marginTop: '3.5rem' }}>Jobs To Be Done</h3>
          <div className="gr-jtbd-list gr-reveal-stagger">
            {JTBDS.map(j => (
              <div className="gr-jtbd" key={j.id}>
                <div className="gr-jtbd-header">
                  <span className="gr-jtbd-id">{j.id}</span>
                  <span className="gr-jtbd-actor">{j.actor}</span>
                  <span className="gr-jtbd-freq">{j.freq}</span>
                  <span className="gr-jtbd-driver">{j.driver}</span>
                </div>
                <p className="gr-jtbd-job">"{j.job}"</p>
                <div className="gr-jtbd-workaround">
                  <span className="gr-wa-label">Current workaround →</span> {j.workaround}
                </div>
              </div>
            ))}
          </div>

          {/* Key Insights */}
          <h3 className="gr-sub-heading gr-reveal" style={{ marginTop: '3.5rem' }}>Key Insights</h3>
          <div className="gr-insights gr-reveal-stagger">
            {KEY_INSIGHTS.map(ins => (
              <div className="gr-insight" key={ins.id}>
                <span className="gr-insight-id">{ins.id}</span>
                <div>
                  <h4 className="gr-insight-title">{ins.insight}</h4>
                  <p className="gr-insight-evidence"><em>Evidence:</em> {ins.evidence}</p>
                  <p className="gr-insight-principle"><em>Design principle triggered:</em> {ins.principle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH04 — PERSONAS ══════════════════════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">04</span>
            <span className="gr-eyebrow">Personas</span>
          </div>

          <h2 className="gr-section-title gr-reveal">
            Three people. One shared breakdown.{' '}
            <span className="gr-blue">Completely different contexts.</span>
          </h2>

          <div className="gr-personas gr-reveal-stagger">
            {PERSONAS.map(p => (
              <div className="gr-persona" key={p.id} style={{ '--p-color': p.color }}>
                <div className="gr-persona-top">
                  <span className="gr-persona-id">{p.id}</span>
                  <h3 className="gr-persona-name" style={{ color: p.color }}>{p.name}</h3>
                  <div className="gr-persona-archetype">"{p.archetype}"</div>
                </div>

                <blockquote className="gr-persona-quote">"{p.quote}"</blockquote>

                <div className="gr-persona-meta">
                  {[['Age', p.age], ['Role', p.role], ['Company', p.company], ['Location', p.location]].map(([k, v]) => (
                    <div className="gr-pmeta-row" key={k}>
                      <span className="gr-pmeta-k">{k}</span>
                      <span className="gr-pmeta-v">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="gr-persona-tools">
                  <div className="gr-ps-label">Tools currently used</div>
                  <div className="gr-tools-list">
                    {p.tools.map(t => <span key={t} className="gr-tool-pill">{t}</span>)}
                  </div>
                </div>

                <div className="gr-persona-section">
                  <div className="gr-ps-label gr-ps-label--goal">Goals</div>
                  <ul className="gr-ps-list">{p.goals.map(g => <li key={g}>{g}</li>)}</ul>
                </div>
                <div className="gr-persona-section">
                  <div className="gr-ps-label gr-ps-label--pain">Frustrations</div>
                  <ul className="gr-ps-list gr-ps-list--pain">{p.frustrations.map(f => <li key={f}>{f}</li>)}</ul>
                </div>
                <div className="gr-persona-section">
                  <div className="gr-ps-label">Behaviors</div>
                  <ul className="gr-ps-list">{p.behaviors.map(b => <li key={b}>{b}</li>)}</ul>
                </div>

                <div className="gr-persona-success">
                  <span className="gr-success-label">Success looks like →</span> {p.success}
                </div>
                <div className="gr-persona-state">{p.state}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH05 — PROBLEM FRAMING ══════════════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">05</span>
            <span className="gr-eyebrow">Problem Framing</span>
          </div>

          <h2 className="gr-section-title gr-reveal">
            One problem statement. Six How Might We questions. Six design principles that{' '}
            <span className="gr-blue">governed every decision</span>.
          </h2>

          <div className="gr-problem-statement gr-reveal">
            <span className="gr-ps-eyebrow">Problem Statement</span>
            <p>SMB and mid-market teams managing customer conversations across WhatsApp, Instagram, Email, and SMS are operating in fragmented, manually-coordinated workflows with zero team visibility, no automation, and no measurement — leading to missed messages, burnt-out agents, and invisible campaign results.</p>
          </div>

          <h3 className="gr-sub-heading gr-reveal" style={{ marginTop: '3rem' }}>How Might We</h3>
          <div className="gr-hmw-list gr-reveal-stagger">
            {HMW.map((h, i) => (
              <div className="gr-hmw" key={i}>
                <span className="gr-hmw-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="gr-hmw-text">{h.hmw}</p>
                  <span className="gr-hmw-persona">Target: {h.persona}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="gr-sub-heading gr-reveal" style={{ marginTop: '3.5rem' }}>Design Principles</h3>
          <div className="gr-principles gr-reveal-stagger">
            {DESIGN_PRINCIPLES.map(dp => (
              <div className="gr-principle" key={dp.principle}>
                <h4 className="gr-principle-title">{dp.principle}</h4>
                <p className="gr-principle-rationale">{dp.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CH06 — INFORMATION ARCHITECTURE ════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">06</span>
            <span className="gr-eyebrow">Information Architecture</span>
          </div>

          <h2 className="gr-section-title gr-reveal">
            6 nav items. 4 IA levels. Organized around{' '}
            <span className="gr-blue">how users think</span>, not how channels work.
          </h2>

          <div className="gr-ia-note gr-reveal">
            <span className="gr-ia-note-icon">💡</span>
            <p>{IA_NOTE}</p>
          </div>

          <div className="gr-nav-grid gr-reveal-stagger">
            {NAV_ITEMS.map(n => (
              <div className="gr-nav-card" key={n.id}>
                <div className="gr-nav-header">
                  <span className="gr-nav-icon">{n.icon}</span>
                  <div>
                    <span className="gr-nav-id">{n.id}</span>
                    <h3 className="gr-nav-label">{n.label}</h3>
                  </div>
                </div>
                <p className="gr-nav-desc">{n.desc}</p>
                <div className="gr-nav-meta">
                  <div className="gr-nav-user"><span className="gr-nav-k">Primary user</span>{n.user}</div>
                  <div className="gr-nav-badge-row"><span className="gr-nav-k">Badge</span>{n.badge}</div>
                </div>
                <div className="gr-nav-subs">
                  {n.subs.map(s => <span key={s} className="gr-nav-sub">{s}</span>)}
                </div>
              </div>
            ))}
          </div>

          <h3 className="gr-sub-heading gr-reveal" style={{ marginTop: '3.5rem' }}>IA Hierarchy (4 levels)</h3>
          <div className="gr-ia-tree gr-reveal">
            <div className="gr-ia-l1">
              <span className="gr-ia-badge">L1 — Workspace</span>
              <span className="gr-ia-l1-label">{IA_LEVELS.L1}</span>
            </div>
            <div className="gr-ia-l2-row">
              {IA_LEVELS.L2.map(mod => (
                <div className="gr-ia-module" key={mod}>
                  <div className="gr-ia-mod-label">
                    <span className="gr-ia-badge gr-ia-badge--l2">L2</span> {mod}
                  </div>
                  {IA_LEVELS.L3[mod] && (
                    <div className="gr-ia-l3">
                      <span className="gr-ia-badge gr-ia-badge--l3">L3 Views</span>
                      {IA_LEVELS.L3[mod].map(v => <span key={v} className="gr-ia-item">{v}</span>)}
                    </div>
                  )}
                  {IA_LEVELS.L4[mod] && (
                    <div className="gr-ia-l4">
                      <span className="gr-ia-badge gr-ia-badge--l4">L4 Panels</span>
                      {IA_LEVELS.L4[mod].map(p => <span key={p} className="gr-ia-item gr-ia-item--l4">{p}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CH07 — UX FLOWS ══════════════════════════════════════════════ */}
        <section className="gr-section">
          <div className="gr-section-label gr-reveal">
            <span className="gr-ch-num">07</span>
            <span className="gr-eyebrow">UX Flows</span>
          </div>

          <h2 className="gr-section-title gr-reveal">
            Five end-to-end flows — from login to live dashboard —{' '}
            <span className="gr-blue">every step mapped with design rationale</span>.
          </h2>

          <p className="gr-body gr-reveal">
            Each flow was mapped through the complete happy path, validated with usability testing,
            and documented with the specific design decisions that differentiate Greeto from competitors.
            Edge cases and tracked metrics are included for each flow.
          </p>

          <div className="gr-reveal" style={{ marginTop: '2rem' }}>
            <FlowViewer flows={UX_FLOWS} />
          </div>
        </section>

        {/* ══ CTA ══════════════════════════════════════════════════════════ */}
        <section className="gr-cta-section gr-reveal">
          <div className="gr-cta-glow" aria-hidden="true" />
          <span className="gr-eyebrow">Next</span>
          <h2 className="gr-cta-title">Want to go deeper on any part of this — or talk about what we could build together?</h2>
          <div className="gr-cta-actions">
            <a href="mailto:hashtaginflu@gmail.com" className="gr-btn gr-btn--primary">Get in Touch</a>
            <button className="gr-btn gr-btn--ghost" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
