import { useCallback, useState } from 'react'
import { Intro } from '@/components/intro/Intro'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/hero/Hero'
import { About, Contact, Experience, Footer, Marquee, Projects, Skills } from '@/components/sections/Sections'

export default function App() {
  // revealing: a cortina da intro começou a sair → o site entra no MESMO sentido (da direita p/ esquerda)
  const [revealing, setRevealing] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const onLeave = useCallback(() => setRevealing(true), [])
  const onDone = useCallback(() => setIntroDone(true), [])

  return (
    <>
      {/* O site renderiza por baixo da intro; ela desliza para a esquerda e o revela. */}
      {!introDone && <Intro onLeave={onLeave} onDone={onDone} />}

      <Navbar play={revealing} />
      <main>
        <Hero play={revealing} />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
