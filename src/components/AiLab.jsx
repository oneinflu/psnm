import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import './AiLab.css'

// ── Node definitions (SVG coords: viewBox 0 0 900 480) ───────
const NODES = [
  {
    id: 'MarketU',
    x: 450, y: 240,
    label: 'MarketU',
    sublabel: 'Core Product',
    color: '#dfb743',
    glow: 'rgba(223,183,67,0.4)',
    type: 'product',
    r: 36,
    badge: null,
    tagline: 'The orchestration layer.',
    desc: 'Every AI service routes through MarketU\'s backend. It manages SOP lifecycle, versioning, permissions, publishing, and triggers — the connective tissue that makes the entire AI stack coherent.',
    specs: ['React 18 + Vite', 'Node.js / Express', 'PostgreSQL + pgvector', 'Redis (job queues)'],
    flow: 'All data in, all output out.',
  },
  {
    id: 'claude',
    x: 155, y: 95,
    label: 'Claude',
    sublabel: 'Anthropic',
    color: '#D97706',
    glow: 'rgba(217,119,6,0.35)',
    type: 'ai',
    r: 28,
    badge: 'AI',
    tagline: 'Primary generation engine.',
    desc: 'Claude handles all long-form SOP drafting, rewriting, summarisation, and Q&A over document content. The context window handles entire SOP documents — no chunking hacks required. Instruction-following accuracy for structured output was unmatched when evaluated against GPT-4.',
    specs: ['Messages API (claude-3-opus)', 'Streaming responses', 'System prompt: SOP persona', 'Tool use for structured JSON output'],
    flow: 'MarketU → prompt → Claude → streamed SOP draft',
  },
  {
    id: 'openai',
    x: 450, y: 65,
    label: 'OpenAI',
    sublabel: 'Embeddings',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    type: 'ai',
    r: 28,
    badge: 'AI',
    tagline: 'Semantic search backbone.',
    desc: 'OpenAI\'s text-embedding-ada-002 powers MarketU\'s semantic search. When a user searches "how to handle a refund", the query and all SOP content are embedded into vector space — pgvector finds cosine-similar matches. No keyword hell.',
    specs: ['text-embedding-ada-002', 'pgvector (PostgreSQL extension)', 'Cosine similarity scoring', 'Batch embedding on SOP save'],
    flow: 'SOP saved → embed → pgvector store → query → ranked results',
  },
  {
    id: 'github',
    x: 745, y: 95,
    label: 'GitHub',
    sublabel: 'Version Control',
    color: '#9CA3AF',
    glow: 'rgba(156,163,175,0.3)',
    type: 'infra',
    r: 28,
    badge: 'DEV',
    tagline: 'SOP history that auditors love.',
    desc: 'Every SOP change is tracked as a git-style diff. Non-technical ops managers get a "track changes" view they instantly understand. GitHub Webhooks also drive the CI/CD pipeline — a merge to main triggers a DigitalOcean deploy in under 90 seconds.',
    specs: ['GitHub REST API (diff storage)', 'Webhook → deploy pipeline', 'Branch-per-draft workflow', 'GitHub Actions (CI)'],
    flow: 'SOP edit → diff stored via GitHub API → deploy webhook → DigitalOcean',
  },
  {
    id: 'digitalocean',
    x: 775, y: 268,
    label: 'DigitalOcean',
    sublabel: 'Infrastructure',
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.3)',
    type: 'infra',
    r: 28,
    badge: 'OPS',
    tagline: 'Predictable infra. No AWS surprises.',
    desc: 'Entire stack runs on DigitalOcean: App Platform for the web app, Managed PostgreSQL for the primary DB (with pgvector extension), Spaces for file attachments, and VPC networking. Chosen over AWS for ops simplicity and cost predictability on a small team.',
    specs: ['App Platform (auto-deploy)', 'Managed PostgreSQL (pgvector)', 'Spaces (S3-compatible CDN)', 'VPC + private networking'],
    flow: 'GitHub push → App Platform deploy → Managed DB → Spaces CDN',
  },
  {
    id: 'gsc',
    x: 600, y: 410,
    label: 'Search Console',
    sublabel: 'Google',
    color: '#EA4335',
    glow: 'rgba(234,67,53,0.3)',
    type: 'data',
    r: 28,
    badge: 'SEO',
    tagline: 'Public SOPs are a growth channel.',
    desc: 'Every time a public SOP is published, MarketU auto-submits it to Google Search Console via the Indexing API. Public SOPs — safety checklists, onboarding guides, compliance documents — rank organically and drive new signups. GSC data surfaces which SOP categories attract the most search traffic.',
    specs: ['Google Indexing API (instant submit)', 'Sitemap auto-update on publish', 'Core Web Vitals monitoring', 'Search performance → product insights'],
    flow: 'SOP published → Indexing API ping → GSC monitors → organic traffic loop',
  },
  {
    id: 'serp',
    x: 285, y: 410,
    label: 'SERP APIs',
    sublabel: 'Intelligence Layer',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.3)',
    type: 'data',
    r: 28,
    badge: 'DATA',
    tagline: 'Know what SOPs competitors have built.',
    desc: 'SERP APIs pull top-ranking SOP and process documentation from across the web for any given industry keyword. MarketU uses this to pre-populate template suggestions — when an operations manager opens a blank SOP, they get a "businesses like yours typically document these 12 processes" prompt. Drives activation and content depth.',
    specs: ['SerpAPI / ValueSERP', 'Keyword → top-10 result scrape', 'Claude summarises + structures', 'Template suggestion engine'],
    flow: 'User industry tag → SERP API → Claude structures → template suggestions',
  },
]

// ── Edge definitions ──────────────────────────────────────────
const EDGES = [
  { from: 'MarketU', to: 'claude', label: 'Generation', dir: 'both' },
  { from: 'MarketU', to: 'openai', label: 'Embeddings', dir: 'both' },
  { from: 'MarketU', to: 'github', label: 'Versioning', dir: 'both' },
  { from: 'MarketU', to: 'digitalocean', label: 'Hosting', dir: 'to' },
  { from: 'MarketU', to: 'gsc', label: 'Indexing', dir: 'to' },
  { from: 'MarketU', to: 'serp', label: 'Research', dir: 'from' },
  { from: 'claude', to: 'openai', label: 'AI Layer', dir: 'none' },
  { from: 'github', to: 'digitalocean', label: 'CI/CD', dir: 'to' },
]

// ── Helpers ───────────────────────────────────────────────────
function getNode(id) { return NODES.find(n => n.id === id) }

function edgePath(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const curve = Math.hypot(dx, dy) * 0.22
  const nx = -dy / Math.hypot(dx, dy) * curve
  const ny = dx / Math.hypot(dx, dy) * curve
  return `M${a.x},${a.y} Q${mx + nx},${my + ny} ${b.x},${b.y}`
}

function typeColor(type) {
  return { ai: '#D97706', infra: '#6B7280', data: '#8B5CF6', product: '#dfb743' }[type] || '#fff'
}

const TYPE_LABEL = { ai: 'AI Service', infra: 'Infrastructure', data: 'Data Intelligence', product: 'Core Product' }

// ── SVG Graph ─────────────────────────────────────────────────
function ArchGraph({ activeId, onSelect }) {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))

  return (
    <svg
      className="al-graph"
      viewBox="0 0 900 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {NODES.map(n => (
          <radialGradient key={n.id} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={n.glow} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        ))}
        <filter id="blur-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="rgba(255,255,255,0.18)" />
        </marker>
      </defs>

      {/* ── Edge paths (defs for animateMotion) ── */}
      {EDGES.map((e, i) => {
        const a = nodeMap[e.from], b = nodeMap[e.to]
        const d = edgePath(a, b)
        const isActive = activeId && (e.from === activeId || e.to === activeId)
        return (
          <g key={i}>
            <path
              id={`ep-${i}`}
              d={d}
              fill="none"
              stroke={isActive ? 'rgba(223,183,67,0.5)' : 'rgba(255,255,255,0.07)'}
              strokeWidth={isActive ? 1.5 : 1}
              className="al-edge"
            />
            {/* Flowing packet */}
            {[0, 0.45].map((offset, j) => (
              <circle key={j} r="2.5" fill="rgba(223,183,67,0.75)" style={{ opacity: isActive ? 1 : 0.35 }}>
                <animateMotion
                  dur={`${2.8 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${offset * (2.8 + i * 0.3)}s`}
                >
                  <mpath href={`#ep-${i}`} />
                </animateMotion>
              </circle>
            ))}
          </g>
        )
      })}

      {/* ── Nodes ── */}
      {NODES.map((n) => {
        const isActive = n.id === activeId
        const isProduct = n.type === 'product'
        return (
          <g
            key={n.id}
            className={`al-node ${isActive ? 'al-node--active' : ''}`}
            onClick={() => onSelect(n.id === activeId ? null : n.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Glow halo */}
            {isActive && (
              <circle
                cx={n.x} cy={n.y}
                r={n.r + 18}
                fill={`url(#glow-${n.id})`}
                className="al-node-glow"
              />
            )}
            {/* Pulse ring */}
            <circle
              cx={n.x} cy={n.y}
              r={n.r + 8}
              fill="none"
              stroke={n.color}
              strokeWidth="1"
              opacity={isActive ? 0.5 : 0.12}
              className={isActive ? 'al-pulse' : ''}
            />
            {/* Main circle */}
            <circle
              cx={n.x} cy={n.y}
              r={n.r}
              fill={isActive ? `${n.color}22` : 'rgba(9,9,13,0.9)'}
              stroke={n.color}
              strokeWidth={isActive ? 2 : 1.2}
              style={{
                filter: isActive ? `drop-shadow(0 0 12px ${n.glow})` : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            {/* Label */}
            <text
              x={n.x} y={n.y - 5}
              textAnchor="middle"
              className="al-node-label"
              fill={isActive ? n.color : '#f5f5f7'}
              style={{ fontWeight: isProduct ? 800 : 700 }}
            >
              {n.label}
            </text>
            <text
              x={n.x} y={n.y + 11}
              textAnchor="middle"
              className="al-node-sublabel"
              fill={isActive ? n.color : 'rgba(255,255,255,0.35)'}
            >
              {n.sublabel}
            </text>
            {/* Badge */}
            {n.badge && (
              <g>
                <rect
                  x={n.x + n.r - 4} y={n.y - n.r - 14}
                  width={28} height={14}
                  rx={4}
                  fill={n.color}
                  opacity="0.85"
                />
                <text
                  x={n.x + n.r + 10} y={n.y - n.r - 3}
                  textAnchor="middle"
                  className="al-badge-text"
                  fill="#000"
                >
                  {n.badge}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────
export default function AiLab() {
  const [activeId, setActiveId] = useState(null)
  const navigate = useNavigate()
  const activeNode = activeId ? getNode(activeId) : null

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.al-hero-eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 })
    gsap.fromTo('.al-hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out', delay: 0.2 })
    gsap.fromTo('.al-hero-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.45 })
    gsap.fromTo('.al-graph', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.5 })
    gsap.fromTo('.al-hint', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.2 })
  }, [])

  return (
    <motion.div
      className="al-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* ── Nav ── */}
      <nav className="al-nav">
        <motion.button className="al-nav-back" onClick={() => navigate('/')} whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </motion.button>
        <span className="al-nav-title">AI Lab</span>
        <div />
      </nav>

      <div className="al-body">

        {/* ════════════════════════
            HERO
        ════════════════════════ */}
        <section className="al-hero">
          <div className="al-hero-bg" />
          <div className="al-container">
            <span className="al-hero-eyebrow">AI LAB</span>
            <h1 className="al-hero-title">
              Not a chatbot wrapper.<br />
              <span className="gradient-text">A real AI system.</span>
            </h1>
            <p className="al-hero-sub">
              MarketU\'s architecture connects six services into a single coherent product experience. Click any node to see exactly how it fits.
            </p>
          </div>
        </section>

        {/* ════════════════════════
            GRAPH + DETAIL SPLIT
        ════════════════════════ */}
        <section className="al-lab">
          <div className="al-container al-lab-inner">

            {/* Graph panel */}
            <div className="al-graph-panel">
              <div className="al-graph-header">
                <span className="al-graph-title">MarketU Architecture</span>
                <div className="al-legend">
                  {Object.entries(TYPE_LABEL).map(([type, label]) => (
                    <span key={type} className="al-legend-item">
                      <span className="al-legend-dot" style={{ background: typeColor(type) }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <ArchGraph activeId={activeId} onSelect={setActiveId} />
              {!activeId && (
                <p className="al-hint">Click any node to explore the architecture →</p>
              )}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeId}
                  className="al-detail"
                  initial={{ opacity: 0, x: 32, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -32, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Close */}
                  <button className="al-detail-close" onClick={() => setActiveId(null)}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Header */}
                  <div className="al-detail-header">
                    <span className="al-detail-type" style={{ color: typeColor(activeNode.type), borderColor: `${typeColor(activeNode.type)}40` }}>
                      {TYPE_LABEL[activeNode.type]}
                    </span>
                    <h2 className="al-detail-name" style={{ color: activeNode.color }}>
                      {activeNode.label}
                    </h2>
                    <p className="al-detail-sublabel">{activeNode.sublabel}</p>
                  </div>

                  <p className="al-detail-tagline">"{activeNode.tagline}"</p>
                  <p className="al-detail-desc">{activeNode.desc}</p>

                  {/* Specs */}
                  <div className="al-block">
                    <span className="al-block-label">Stack / APIs</span>
                    <div className="al-specs">
                      {activeNode.specs.map((s, i) => (
                        <motion.span
                          key={s}
                          className="al-spec"
                          style={{ borderColor: `${activeNode.color}30`, color: activeNode.color }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 + 0.1 }}
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Data flow */}
                  <div className="al-block">
                    <span className="al-block-label">Data Flow</span>
                    <div className="al-flow-box" style={{ borderColor: `${activeNode.color}30` }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: activeNode.color, flexShrink: 0 }}>
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="al-flow-text">{activeNode.flow}</span>
                    </div>
                  </div>

                  {/* Connected edges */}
                  <div className="al-block">
                    <span className="al-block-label">Connects to</span>
                    <div className="al-connections">
                      {EDGES.filter(e => e.from === activeId || e.to === activeId).map((e, i) => {
                        const otherId = e.from === activeId ? e.to : e.from
                        const other = getNode(otherId)
                        return (
                          <button
                            key={i}
                            className="al-conn-chip"
                            onClick={() => setActiveId(otherId)}
                            style={{ borderColor: `${other.color}40` }}
                          >
                            <span className="al-conn-dot" style={{ background: other.color }} />
                            {other.label}
                            <span className="al-conn-role">{e.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="al-detail al-detail--empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="al-empty-content">
                    <div className="al-empty-icon">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="12" stroke="rgba(223,183,67,0.3)" strokeWidth="1.5" />
                        <circle cx="14" cy="14" r="4" fill="rgba(223,183,67,0.25)" />
                        <path d="M14 6v3M14 19v3M6 14h3M19 14h3" stroke="rgba(223,183,67,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p>Select a node in the graph<br />to inspect its role in the system.</p>
                    <div className="al-node-quick">
                      {NODES.map(n => (
                        <button
                          key={n.id}
                          className="al-quick-btn"
                          onClick={() => setActiveId(n.id)}
                          style={{ '--node-color': n.color }}
                        >
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

        {/* ════════════════════════
            DESIGN PRINCIPLES STRIP
        ════════════════════════ */}
        <section className="al-principles">
          <div className="al-container">
            <p className="al-principles-label">WHAT I AVOID IN AI PRODUCT DESIGN</p>
            <div className="al-principles-grid">
              {[
                { bad: 'Wrapper apps', good: 'Embedded intelligence', desc: 'AI is a feature inside the workflow, not the workflow itself.' },
                { bad: 'Magic box UX', good: 'Transparent AI actions', desc: 'Users see what the AI did and can override any output.' },
                { bad: 'Hallucination risk', good: 'Grounded prompts', desc: 'Every Claude call is anchored to user-provided context, not open-ended generation.' },
                { bad: 'Vendor lock-in', good: 'Swappable services', desc: 'Embeddings and generation are behind abstraction layers. Swap providers without rewriting product.' },
              ].map((p, i) => (
                <div key={i} className="al-principle">
                  <div className="al-principle-row">
                    <span className="al-principle-bad">✕ {p.bad}</span>
                    <span className="al-principle-arrow">→</span>
                    <span className="al-principle-good">✓ {p.good}</span>
                  </div>
                  <p className="al-principle-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════
            CLOSING
        ════════════════════════ */}
        <section className="al-closing">
          <div className="al-container">
            <div className="al-closing-inner">
              <p className="al-closing-quote">
                "The best AI products feel like the AI was always supposed to be there."
              </p>
              <a href="mailto:contact@murthy.build" className="btn btn-primary btn-large">
                Build AI Together →
              </a>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
