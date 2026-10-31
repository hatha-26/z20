"use client";

import { useEffect, useId, useState } from "react";
import { motion, type Variants } from "framer-motion";
import * as opentype from "opentype.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Font = any;
let fontPromise: Promise<Font> | null = null;
const loadFont = () =>
  (fontPromise ??= fetch("/fonts/pacifico.woff")
    .then((r) => r.arrayBuffer())
    .then((b) => opentype.parse(b)));

const r2 = (n: number) => Math.round(n * 100) / 100;
// serializer sendiri (toPathData bawaan opentype.js 2.0 kadang menghasilkan NaN)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toD(cmds: any[]): string {
  return cmds
    .map((c) => {
      switch (c.type) {
        case "M":
        case "L":
          return `${c.type}${r2(c.x)} ${r2(c.y)}`;
        case "Q":
          return `Q${r2(c.x1)} ${r2(c.y1)} ${r2(c.x)} ${r2(c.y)}`;
        case "C":
          return `C${r2(c.x1)} ${r2(c.y1)} ${r2(c.x2)} ${r2(c.y2)} ${r2(c.x)} ${r2(c.y)}`;
        default:
          return "Z";
      }
    })
    .join("");
}

type Layout = { glyphs: string[]; w: number; asc: number; h: number };

function layout(font: Font, text: string, size: number): Layout {
  const glyphs: string[] = [];
  font.forEachGlyph(text, 0, 0, size, { kerning: true }, (g: Font, x: number, y: number, fs: number) => {
    const d: string = toD(g.getPath(x, y, fs).commands);
    if (d && d.length > 2) glyphs.push(d);
  });
  const w: number = font.getAdvanceWidth(text, size, { kerning: true });
  const asc = (font.ascender / font.unitsPerEm) * size;
  const desc = (Math.abs(font.descender) / font.unitsPerEm) * size;
  return { glyphs, w, asc, h: asc + desc };
}

/** Perkiraan lama animasi satu baris (detik), untuk mengatur jeda antar baris. */
export const writeDuration = (text: string, step = 0.085) => text.length * step + 0.9;

type Props = {
  text: string;
  delay?: number;          // jeda sebelum mulai menulis (detik)
  fs?: string;             // ukuran font (CSS length), default var(--script-fs)
  maxVw?: number;          // lebar maksimal dalam vw
  gradient?: boolean;      // gradient pink→oranye→ungu
  color?: string;
  inView?: boolean;        // mulai saat terlihat di layar
  step?: number;           // jeda antar huruf (detik)
};

export default function ScriptText({ text, delay = 0, fs = "var(--script-fs, 80px)", maxVw = 92, gradient = false, color = "#3a2833", inView = false, step = 0.085 }: Props) {
  const size = 100;
  const gid = useId().replace(/:/g, "");
  const [L, setL] = useState<Layout | null>(null);

  useEffect(() => {
    let alive = true;
    loadFont().then((f) => alive && setL(layout(f, text, size)));
    return () => {
      alive = false;
    };
  }, [text]);

  if (!L) return <div style={{ height: `calc(${fs} * 1.4)` }} aria-hidden />;

  const pad = size * 0.14;
  const vbW = L.w + pad * 2;
  const paint = gradient ? `url(#${gid})` : color;

  const v: Variants = {
    hidden: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1 },
    show: (i: number) => ({
      pathLength: 1,
      fillOpacity: 1,
      strokeOpacity: 0,
      transition: {
        pathLength: { duration: 0.75, delay: delay + i * step, ease: "easeInOut" },
        fillOpacity: { duration: 0.5, delay: delay + i * step + 0.5 },
        strokeOpacity: { duration: 0.4, delay: delay + i * step + 0.8 },
      },
    }),
  };

  const trigger = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } }
    : { initial: "hidden", animate: "show" };

  return (
    <motion.svg
      role="img"
      aria-label={text}
      viewBox={`${-pad} ${-L.asc - pad / 2} ${vbW} ${L.h + pad}`}
      style={{ width: `min(${maxVw}vw, calc(${fs} * ${(vbW / size).toFixed(3)}))`, height: "auto", overflow: "visible", display: "block" }}
      {...trigger}
    >
      {gradient && (
        <defs>
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={0} x2={L.w} y1={0} y2={0}>
            <stop offset="0" stopColor="#ff5f9e" />
            <stop offset="0.55" stopColor="#ff9a62" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      )}
      {L.glyphs.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          custom={i}
          variants={v}
          fill={paint}
          stroke={paint}
          strokeWidth={size * 0.014}
          strokeLinejoin="round"
        />
      ))}
    </motion.svg>
  );
}