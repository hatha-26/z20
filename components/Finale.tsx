"use client";

import { color, motion } from "framer-motion";
import { config } from "@/lib/config";
import { cannons, emojiRain } from "@/lib/confetti";
import ScriptText from "./ScriptText";

export default function Finale() {
  return (
    <section className="finale">
      <motion.div
        initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 9 }}
      >
        <span className="big-heart">❤️</span>
      </motion.div>
      <h2
        className="finale-script"
        aria-label={`Selamat ulang tahun ke 2, ${config.name}`}
      >
        <ScriptText text="Selamat ulang tahun ke 2" inView />
        <ScriptText
          text={config.name}
          inView
          delay={1.6}
          fs="calc(var(--script-fs) * 1.2)"
          gradient
        />
      </h2>
      <motion.p
        className="sub"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        Aku sayang kamu. Hari ini, besok, dan seterusnya.
      </motion.p>
      <p>Sekarang buka kadonya sayang, meskipun itu pilihan kamu, bukan surprise, hehe</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
        style={{
          marginTop: 18,
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <motion.button
          className="btn"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
          onClick={() => emojiRain("💖")}
        >
          Hujan cinta 💖
        </motion.button>
        <motion.button
          className="btn"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
          onClick={() => cannons()}
        >
          Confetti 🎉
        </motion.button>
      </motion.div>
    </section>
  );
}
