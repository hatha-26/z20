"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { config } from "@/lib/config";

function Line({ i, n, p, emoji, text }: { i: number; n: number; p: MotionValue<number>; emoji: string; text: string }) {
  const seg = 1 / n;
  const s = i * seg;
  const last = i === n - 1;
  const first = i === 0;
  const inputs = last ? [s, s + seg * 0.3] : first ? [s, s + seg * 0.7, s + seg] : [s, s + seg * 0.25, s + seg * 0.75, s + seg];
  const opacity = useTransform(p, inputs, last ? [0, 1] : first ? [1, 1, 0] : [0, 1, 1, 0]);
  const scale = useTransform(p, inputs, last ? [0.88, 1] : first ? [1, 1, 1.1] : [0.88, 1, 1, 1.1]);
  const y = useTransform(p, inputs, last ? [70, 0] : first ? [0, 0, -70] : [70, 0, 0, -70]);
  const blurPx = useTransform(p, inputs, last ? [14, 0] : first ? [0, 0, 14] : [14, 0, 0, 14]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

  return (
    <motion.div className="story-line" style={{ opacity, scale, y, filter }}>
      <span className="emoji">{emoji}</span>
      <p className={i % 2 === 1 ? "grad" : ""}>{text}</p>
    </motion.div>
  );
}

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = config.story.length;
  return (
    <section ref={ref} className="story" style={{ height: `${n * 90 + 60}vh` }}>
      <div className="story-stick">
        {config.story.map((l, i) => (
          <Line key={i} i={i} n={n} p={scrollYProgress} emoji={l.emoji} text={l.text} />
        ))}
      </div>
    </section>
  );
}