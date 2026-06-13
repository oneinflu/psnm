import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  const desktopCls = ({ isActive }) =>
    `nav-link nav-link--special${isActive ? ' nav-link--active' : ''}`

  const mobileCls = ({ isActive }) =>
    `nav-mobile-link${isActive ? ' nav-mobile-link--active' : ''}`

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo" onClick={close}>
            M<span className="logo-accent">.</span>
          </Link>

          {/* Desktop links */}
          <nav className="nav-links">
            <a href="#hero"   className="nav-link">Home</a>
            <a href="#work"   className="nav-link">Work</a>
            <a href="#impact" className="nav-link">Impact</a>
            <NavLink to="/about"    className={desktopCls}>About Me</NavLink>
            <NavLink to="/thinking" className={desktopCls}>Thinking</NavLink>
            <NavLink to="/research" className={desktopCls}>Research</NavLink>
            <NavLink to="/ai-lab"   className={desktopCls}>AI Lab</NavLink>
          </nav>

          <div className="nav-right">
            <a href="mailto:contact@murthy.build" className="btn btn-primary nav-cta">Let's Build</a>
            <button
              className={`nav-hamburger${menuOpen ? ' nav-hamburger--open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — outside <header> so backdrop-filter doesn't break position:fixed */}
      <div className={`nav-mobile${menuOpen ? ' nav-mobile--open' : ''}`}>
        <nav className="nav-mobile-links">
          <a href="#hero"   className="nav-mobile-link" onClick={close}>Home</a>
          <a href="#work"   className="nav-mobile-link" onClick={close}>Work</a>
          <a href="#impact" className="nav-mobile-link" onClick={close}>Impact</a>
          <NavLink to="/about"    className={mobileCls} onClick={close}>About Me</NavLink>
          <NavLink to="/thinking" className={mobileCls} onClick={close}>Thinking</NavLink>
          <NavLink to="/research" className={mobileCls} onClick={close}>Research</NavLink>
          <NavLink to="/ai-lab"   className={mobileCls} onClick={close}>AI Lab</NavLink>
        </nav>
        <a href="mailto:contact@murthy.build" className="btn btn-primary nav-mobile-cta" onClick={close}>
          Let's Build →
        </a>
      </div>
    </>
  )
}
