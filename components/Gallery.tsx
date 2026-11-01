"use client";

import { motion } from "framer-motion";
import { config } from "@/lib/config";

const tints = ["#ffd9e6", "#ffe5cc", "#e6dcff", "#d4f1f9", "#fff0b8", "#ffd0d0"];

export default function Gallery() {
  return (
    <section style={{ paddingTop: 130 }}>
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="title">Kenangan <span className="grad">kita</span> 📸</h2>
        <p className="sub">maaf ya momen yang aku berikan tidak banyak, nanti nge lag</p>
      </motion.div>

      <div className="scroller">
        {config.photos.map((p, i) => (
          <motion.figure
            key={i}
            className="polaroid"
            initial={{ opacity: 0, y: 80, rotate: i % 2 ? 8 : -8, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 3 : -3, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ type: "spring", stiffness: 90, damping: 14, delay: (i % 3) * 0.08 }}
            whileHover={{ rotate: 0, scale: 1.06, y: -10 }}
          >
            <div className="pic" style={{ background: tints[i % tints.length] }}>
              {p.src ? <img src={p.src} alt={p.caption} loading="lazy" /> : <span>{p.emoji}</span>}
            </div>
            <p className="hand">{p.caption}</p>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}