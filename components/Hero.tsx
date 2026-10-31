"use client";

import { motion } from "framer-motion";
import { config } from "@/lib/config";
import ScriptText, { writeDuration } from "./ScriptText";

const ease = [0.22, 1, 0.36, 1] as const;

const balloons = [
  { x: "6%", c: "#ff7eb3", d: "13s", delay: "0s" },
  { x: "18%", c: "#ffb86b", d: "16s", delay: "2.5s" },
  { x: "32%", c: "#a78bfa", d: "14s", delay: "5s" },
  { x: "50%", c: "#7bdff2", d: "17s", delay: "1s" },
  { x: "66%", c: "#ff7eb3", d: "15s", delay: "4s" },
  { x: "80%", c: "#ffd166", d: "13.5s", delay: "7s" },
  { x: "92%", c: "#c4a7ff", d: "16s", delay: "3s" },
];

// Foto yang beterbangan (diambil dari config.photos secara berulang).
// shape: "heart" = berbentuk love, "card" = polaroid. delay negatif = sudah terbang saat halaman dibuka.
const floaters = [
  { x: "3%", s: 100, shape: "heart", d: "21s", delay: "-4s", r: 8 },
  { x: "13%", s: 84, shape: "card", d: "24s", delay: "-15s", r: 7 },
  { x: "24%", s: 112, shape: "heart", d: "22s", delay: "-9s", r: 6 },
  { x: "40%", s: 78, shape: "card", d: "26s", delay: "2s", r: 9 },
  { x: "58%", s: 96, shape: "heart", d: "23s", delay: "-18s", r: 7 },
  { x: "70%", s: 88, shape: "card", d: "25s", delay: "-6s", r: 8 },
  { x: "81%", s: 116, shape: "heart", d: "20s", delay: "-12s", r: 6 },
  { x: "91%", s: 80, shape: "card", d: "27s", delay: "4s", r: 9 },
  { x: "48%", s: 90, shape: "heart", d: "24s", delay: "8s", r: 7 },
];
const tints = [
  "#ffd9e6",
  "#ffe5cc",
  "#e6dcff",
  "#d4f1f9",
  "#fff0b8",
  "#ffd0d0",
];

// Judul ditulis berurutan: baris 1 → baris 2 → nama
const LINE1 = "Selamat";
const LINE2 = "Ulang Tahun";
const T0 = 0.7;
const T1 = T0 + writeDuration(LINE1) * 0.75;
const T2 = T1 + writeDuration(LINE2) * 0.75;
const TEND = T2 + writeDuration(config.name) * 0.75;

export default function Hero() {
  return (
    <section className="hero">
      {/* bentuk love untuk memotong foto */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,1 C0.1,0.7 0,0.48 0,0.3 C0,0.12 0.13,0 0.27,0 C0.38,0 0.46,0.07 0.5,0.17 C0.54,0.07 0.62,0 0.73,0 C0.87,0 1,0.12 1,0.3 C1,0.48 0.9,0.7 0.5,1 Z" />
          </clipPath>
        </defs>
      </svg>
      {floaters.map((f, i) => {
        const photo = config.photos[i % config.photos.length];
        return (
          <div
            key={`p${i}`}
            className={`float-photo ${f.shape}`}
            style={
              {
                "--x": f.x,
                "--s": `${f.s}px`,
                "--d": f.d,
                "--delay": f.delay,
                "--r": `${f.r}deg`,
                "--tint": tints[i % tints.length],
              } as React.CSSProperties
            }
            aria-hidden
          >
            <div className="fp-shape">
              <div className="fp-inner">
                {photo.src ? (
                  <img
                    src={photo.src}
                    alt=""
                    style={{
                      objectPosition:
                        (photo as { focus?: string }).focus ?? "50% 30%",
                    }}
                  />
                ) : (
                  <span>{photo.emoji}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {balloons.map((b, i) => (
        <div
          key={i}
          className="balloon"
          style={
            {
              "--x": b.x,
              "--c": b.c,
              "--d": b.d,
              "--delay": b.delay,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="script-stack">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {config.dateText} · hari spesial
        </motion.p>
        <h1 aria-label="Selamat Ulang Tahun">
          <ScriptText text={LINE1} delay={T0} />
          <ScriptText text={LINE2} delay={T1} />
        </h1>
        <h2 className="name-row">
          <ScriptText
            text={config.name}
            delay={T2}
            fs="calc(var(--script-fs) * 1.1)"
            maxVw={62}
            gradient
          />
          <motion.span
            className="cake-emoji"
            initial={{ opacity: 0, scale: 0.2, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 9,
              delay: TEND,
            }}
          >
            🎂
          </motion.span>
        </h2>
      </div>
      <motion.div
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TEND + 0.4, duration: 1 }}
      >
        <div className="mouse" />
        scroll ya
      </motion.div>
    </section>
  );
}
