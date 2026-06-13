import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none'
      return
    }

    const ctx = canvas.getContext('2d')
    let particles = []
    let rafId
    let mouse = { x: -9999, y: -9999, radius: 150 }

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)

    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x = Math.random() * window.innerWidth
        this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 20
        this.size = Math.random() * 2 + 0.5
        this.speedY = Math.random() * 0.3 + 0.1
        this.speedX = Math.random() * 0.2 - 0.1
        this.opacity = Math.random() * 0.5 + 0.1
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = Math.random() * 0.02
      }
      update() {
        this.y -= this.speedY
        this.wobble += this.wobbleSpeed
        this.x += this.speedX + Math.sin(this.wobble) * 0.15
        if (mouse.x !== -9999) {
          const dx = this.x - mouse.x
          const dy = this.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius
            this.x += (dx / dist) * force * 1.2
            this.y += (dy / dist) * force * 1.2
          }
        }
        if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(223, 183, 67, ${this.opacity})`
        ctx.fill()
      }
    }

    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 90)
    for (let i = 0; i < count; i++) particles.push(new Particle())

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      particles.forEach(p => { p.update(); p.draw() })
      rafId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: -2, pointerEvents: 'none'
      }}
    />
  )
}
