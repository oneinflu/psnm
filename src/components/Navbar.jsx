import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const specialLink = ({ isActive }) =>
    `nav-link nav-link--special${isActive ? ' nav-link--active' : ''}`

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">M<span className="logo-accent">.</span></Link>
        <nav className="nav-links">
          <a href="#hero"   className="nav-link">Home</a>
          <a href="#work"   className="nav-link">Work</a>
          <a href="#impact" className="nav-link">Impact</a>
          <NavLink to="/about"    className={specialLink}>About Me</NavLink>
          <NavLink to="/thinking" className={specialLink}>Thinking</NavLink>
          <NavLink to="/research" className={specialLink}>Research</NavLink>
          <NavLink to="/ai-lab"   className={specialLink}>AI Lab</NavLink>
        </nav>
        <a href="mailto:contact@murthy.build" className="btn btn-primary">Let's Build</a>
      </div>
    </header>
  )
}
