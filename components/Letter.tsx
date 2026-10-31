"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "@/lib/config";

function Typewriter({ text, speed = 38 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const ch = text[n];
    const t = setTimeout(() => setN(n + 1), ch === "\n" ? speed * 8 : /[.,]/.test(ch) ? speed * 4 : speed);
    return () => clearTimeout(t);
  }, [n, text, speed]);
  return (
    <>
      {text.slice(0, n)}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}>|</motion.span>
      {n >= text.length && (
        <motion.div className="sign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          dengan sayang,<br />{config.from} 💗
        </motion.div>
      )}
    </>
  );
}

export default function Letter() {
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
    setTimeout(() => setStage("open"), 900);
  };

  return (
    <section id="letter" className="section">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="title">Ada <span className="grad">surat</span> buat kamu ✉️</h2>
      </motion.div>

      <AnimatePresence mode="wait">
        {stage !== "open" ? (
          <motion.div
            key="env"
            className="env"
            onClick={open}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            whileHover={{ y: -6, rotate: -1.5 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
          >
            <div className="env-body" />
            <motion.div
              style={{ position: "absolute", left: 14, right: 14, bottom: 14, top: 14, background: "#fffdf7", borderRadius: 6 }}
              animate={stage === "opening" ? { y: -60 } : { y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
            <div className="env-front" />
            <motion.div
              className="env-flap"
              animate={{ rotateX: stage === "opening" ? 180 : 0, zIndex: stage === "opening" ? 0 : 2 }}
              transition={{ duration: 0.6 }}
            />
            <motion.div className="seal" animate={stage === "opening" ? { opacity: 0, scale: 0.4 } : { scale: [1, 1.18, 1] }} transition={stage === "opening" ? {} : { repeat: Infinity, duration: 1.4 }}>
              💗
            </motion.div>
            <p className="center" style={{ position: "absolute", top: "calc(100% + 18px)", width: "100%", color: "var(--muted)" }}>ketuk untuk membuka</p>
          </motion.div>
        ) : (
          <motion.div
            key="paper"
            className="paper hand"
            initial={{ opacity: 0, y: 80, rotate: -3, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 14 }}
          >
            <Typewriter text={config.letter} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}