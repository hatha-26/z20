"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";

export function Background() {
  return (
    <div className="bg" aria-hidden>
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
    </div>
  );
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
  return null;
}

const pops = ["💖", "✨", "🌸", "💕", "⭐", "🎀"];

/** Setiap tap/klik memunculkan emoji lucu. */
export function ClickHearts() {
  const [items, setItems] = useState<{ id: number; x: number; y: number; e: string }[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const onDown = (ev: PointerEvent) => {
      const id = idRef.current++;
      const e = pops[id % pops.length];
      setItems((s) => [...s.slice(-12), { id, x: ev.clientX, y: ev.clientY, e }]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 1000);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  return (
    <AnimatePresence>
      {items.map((i) => (
        <motion.span
          key={i.id}
          className="pop-heart"
          style={{ left: i.x, top: i.y }}
          initial={{ scale: 0.3, opacity: 1, y: 0 }}
          animate={{ scale: 1.3, opacity: 0, y: -70, rotate: (i.id % 2 ? 1 : -1) * 20 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {i.e}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

export function MusicButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button className="music" onClick={onToggle} aria-label={muted ? "Nyalakan musik" : "Matikan musik"}>
      {muted ? "🔇" : "🎵"}
    </button>
  );
}