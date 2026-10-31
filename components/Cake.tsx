"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cannons } from "@/lib/confetti";
import { config } from "@/lib/config";

const candles = [120, 150, 180];

/**
 * Api lilin padam otomatis mengikuti lagu tahap "candle":
 * lilin 1, 2, 3 padam beberapa detik sebelum lagu selesai (lihat config.candle).
 * Tidak ada tombol tiup. Waktu diambil dari audio sebenarnya; jika audio tidak ada/diblokir,
 * dipakai penghitung waktu biasa sepanjang config.candle.fallbackSeconds.
 */
export default function Cake({
  getAudio,
}: {
  getAudio?: () => HTMLAudioElement | undefined;
}) {
  const cfg = config.candle;
  const [clock, setClock] = useState({ t: 0, d: cfg.fallbackSeconds });
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useRef(false);
  const since = useRef(0);
  const getAudioRef = useRef(getAudio);
  getAudioRef.current = getAudio;

  // catat kapan bagian kue mulai terlihat (untuk mode cadangan tanpa audio)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !inView.current)
          since.current = performance.now();
        inView.current = e.isIntersecting;
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // baca posisi lagu 10x per detik
  useEffect(() => {
    const id = setInterval(() => {
      const a = getAudioRef.current?.();
      let t = 0;
      let d = cfg.fallbackSeconds;
      if (
        a &&
        Number.isFinite(a.duration) &&
        a.duration > 0 &&
        (!a.paused || a.ended)
      ) {
        d = a.duration;
        t = a.ended ? a.duration : a.currentTime;
      } else if (inView.current) {
        t = (performance.now() - since.current) / 1000;
      }
      setClock((p) => (Math.abs(p.t - t) < 0.05 && p.d === d ? p : { t, d }));
    }, 100);
    return () => clearInterval(id);
  }, [cfg.fallbackSeconds]);

  const lit = candles.map((_, i) => clock.t < (cfg.blowAt[i] ?? Infinity));
  const allOut = lit.every((l) => !l);

  useEffect(() => {
    if (allOut) cannons(1600);
  }, [allOut]);

  return (
    <section id="cake" ref={sectionRef} className="section">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="title">
          Saatnya <span className="grad">tiup lilin</span> 🕯️
        </h2>
        <p className="sub">
          dengarkan lagunya sampai selesai, lalu make a wish ✨
        </p>
        <p style={{ fontSize: 12, opacity: 0.6 }}>
          {clock.t.toFixed(1)} / {clock.d.toFixed(1)} dtk
        </p>
      </motion.div>

      <motion.div
        className="cake-wrap"
        initial={{ opacity: 0, scale: 0.8, y: 60 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      >
        <svg
          viewBox="0 0 300 280"
          width="100%"
          role="img"
          aria-label="Kue ulang tahun"
        >
          <ellipse cx="150" cy="262" rx="125" ry="12" fill="#f3c9d8" />
          {/* bottom tier */}
          <rect x="45" y="180" width="210" height="80" rx="18" fill="#ffc2d9" />
          <rect
            x="45"
            y="180"
            width="210"
            height="80"
            rx="18"
            fill="url(#shade)"
          />
          <path
            d="M45 198c0 10 12 10 12 0 0 14 16 14 16 0 0 12 14 12 14 0 0 16 18 16 18 0 0 12 14 12 14 0 0 14 16 14 16 0 0 12 14 12 14 0 0 16 18 16 18 0 0 12 14 12 14 0 0 14 16 14 16 0 0 10 12 10 12 0v-18H45z"
            fill="#fff"
          />
          {/* top tier */}
          <rect x="90" y="118" width="120" height="64" rx="16" fill="#ffd9b8" />
          <path
            d="M90 134c0 9 10 9 10 0 0 12 14 12 14 0 0 10 12 10 12 0 0 14 16 14 16 0 0 10 12 10 12 0 0 12 14 12 14 0 0 9 10 9 10 0v-16H90z"
            fill="#fff"
          />
          {/* sprinkles */}
          {[
            [70, 225, "#ff5f9e"],
            [110, 235, "#a78bfa"],
            [160, 228, "#ffd166"],
            [205, 236, "#7bdff2"],
            [235, 222, "#ff5f9e"],
            [130, 160, "#ff5f9e"],
            [175, 165, "#a78bfa"],
          ].map(([x, y, c], i) => (
            <rect
              key={i}
              x={x as number}
              y={y as number}
              width="10"
              height="4"
              rx="2"
              fill={c as string}
              transform={`rotate(${i * 37} ${x} ${y})`}
            />
          ))}
          {/* cute face */}
          <circle cx="125" cy="222" r="4" fill="#3a2833" />
          <circle cx="175" cy="222" r="4" fill="#3a2833" />
          <path
            d="M140 228q10 9 20 0"
            stroke="#3a2833"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="112" cy="232" r="7" fill="#ff8fb8" opacity=".6" />
          <circle cx="188" cy="232" r="7" fill="#ff8fb8" opacity=".6" />
          <defs>
            <linearGradient id="shade" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".25" />
              <stop offset="1" stopColor="#000" stopOpacity=".06" />
            </linearGradient>
          </defs>

          {/* candles */}
          {candles.map((x, i) => (
            <g key={x}>
              <rect
                x={x - 5}
                y="82"
                width="10"
                height="38"
                rx="3"
                fill={["#ff5f9e", "#a78bfa", "#7bdff2"][i]}
              />
              <rect
                x={x - 5}
                y="92"
                width="10"
                height="5"
                fill="#fff"
                opacity=".6"
              />
              <AnimatePresence>
                {lit[i] && (
                  <motion.g
                    key="f"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, y: -10, opacity: 0 }}
                    style={{ transformOrigin: `${x}px 80px` }}
                  >
                    <circle
                      cx={x}
                      cy="68"
                      r="22"
                      fill="#ffd166"
                      opacity=".25"
                    />
                    <path
                      className="flame"
                      d={`M${x} 52c8 9 9 17 0 28-9-11-8-19 0-28z`}
                      fill="#ffb347"
                    />
                    <path
                      className="flame"
                      d={`M${x} 64c4 5 5 9 0 14-5-5-4-9 0-14z`}
                      fill="#fff3b0"
                    />
                  </motion.g>
                )}
              </AnimatePresence>
              {!lit[i] && (
                <motion.path
                  d={`M${x} 78c-6-8 6-14 0-24`}
                  stroke="#b9a5b0"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.9 }}
                  animate={{ pathLength: 1, opacity: 0, y: -18 }}
                  transition={{ duration: 1.6 }}
                />
              )}
            </g>
          ))}
        </svg>
      </motion.div>

      <div className="center" style={{ marginTop: 28, minHeight: 90 }}>
        <AnimatePresence mode="wait">
          {allOut && (
            <motion.div
              key="wish"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignItems: "center",
              }}
            >
              <p
                className="hand"
                style={{ fontSize: "2.2rem", lineHeight: 1.1, margin: 0 }}
              >
                Semoga semua wishmu terkabul 🌟
              </p>
              <motion.button
                className="btn"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.06 }}
                onClick={() => {
                  // reset timer lilin
                  setClock({ t: 0, d: cfg.fallbackSeconds });
                
                  // putar ulang lagu "candle" dari awal
                  const a = getAudio?.();
                  if (a) {
                    a.currentTime = 0;
                    a.play().catch(() => {});
                  }
                }}
              >
                Tiup Lilin Lagi 🕯️
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
