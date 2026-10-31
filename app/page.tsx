"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Gate from "@/components/Gate";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Reasons from "@/components/Reasons";
import Cake from "@/components/Cake";
import Letter from "@/components/Letter";
import Finale from "@/components/Finale";
import { Background, ClickHearts, MusicButton, SmoothScroll } from "@/components/Extras";
import { useMusic } from "@/components/useMusic";
import { config } from "@/lib/config";
import { cannons } from "@/lib/confetti";
import QuizGate from "@/components/QuizGate";

export default function Page() {
  const [opened, setOpened] = useState(false);
  const music = useMusic(config.music);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    if (opened) window.scrollTo(0, 0);
  }, [opened]);

  // dipanggil langsung dari klik pada kotak hadiah (butuh gesture user untuk audio)
  const handleGesture = () => {
    music.start();
    music.goTo("open");
  };

  // ganti lagu sesuai posisi scroll
  useEffect(() => {
    if (!opened) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.scrollY + window.innerHeight * 0.6;
      const top = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      };
      music.goTo(line >= top("letter") ? "final" : line >= top("cake") ? "candle" : "open");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => cannons(1200), 500);
  };

  return (
    <>
      <Background />
      {/* <ClickHearts /> */}
      <AnimatePresence>{!opened && <QuizGate key="gate" onUnlock={music.start} onGesture={handleGesture} onOpen={handleOpen} />}</AnimatePresence>
      {opened && (
        <main>
          <SmoothScroll />
          <Hero />
          <Story />
          <Gallery />
          <Reasons />
          <Cake getAudio={() => music.getTrack("candle")} />
          <Letter />
          <Finale />
        </main>
      )}
      {music.hasAny && opened && <MusicButton muted={music.muted} onToggle={music.toggle} />}
    </>
  );
}