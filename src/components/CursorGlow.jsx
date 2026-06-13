import { useEffect, useRef } from 'react'
import './CursorGlow.css'

export default function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let glowX = mouseX
    let glowY = mouseY
    let hasMoved = false
    let rafId

    const onMove = (e) => {
      if (!hasMoved) {
        hasMoved = true
        glow.style.opacity = '1'
      }
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onLeave = () => { glow.style.opacity = '0' }
    const onEnter = () => { if (hasMoved) glow.style.opacity = '1' }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    const tick = () => {
      glowX += (mouseX - glowX) * 0.08
      glowY += (mouseY - glowY) * 0.08
      glow.style.left = `${glowX}px`
      glow.style.top = `${glowY}px`
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}
