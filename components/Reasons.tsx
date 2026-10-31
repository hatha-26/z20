"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { config } from "@/lib/config";

function Card({ r, i }: { r: (typeof config.reasons)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className="flip"
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.1 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="flip-in"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div className="face front">
          <span className="emoji">{r.emoji}</span>
          <b>{r.front}</b>
          <small>ketuk untuk buka</small>
        </div>
        <div className="face back">{r.back}</div>
      </motion.div>
    </motion.div>
  );
}

export default function Reasons() {
  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="title">Kenapa aku <span className="grad">sayang</span> kamu 💌</h2>
        <p className="sub">ini baru sebagian kecil, lho</p>
      </motion.div>
      <div className="grid">
        {config.reasons.map((r, i) => (
          <Card key={i} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}