import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Impact from './components/Impact'
import Connect from './components/Connect'
import Footer from './components/Footer'
import ParticleCanvas from './components/ParticleCanvas'
import CursorGlow from './components/CursorGlow'
import About from './components/About'
import ProductThinking from './components/ProductThinking'
import ResearchLab from './components/ResearchLab'
import AiLab from './components/AiLab'
import GreetoCaseStudy from './components/GreetoCaseStudy'
import MyExamlyCaseStudy from './components/MyExamlyCaseStudy'

function HomePage() {
  return (
    <>
      <ParticleCanvas />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Impact />
        <Connect />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/about"     element={<About />} />
      <Route path="/thinking"  element={<ProductThinking />} />
      <Route path="/research"  element={<ResearchLab />} />
      <Route path="/ai-lab"      element={<AiLab />} />
      <Route path="/work/greeto"    element={<GreetoCaseStudy />} />
      <Route path="/work/myexamly"  element={<MyExamlyCaseStudy />} />
    </Routes>
  )
}
