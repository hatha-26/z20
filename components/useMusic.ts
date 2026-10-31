"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Stage = "open" | "candle" | "final";
export type MusicConfig = Record<Stage, string>;

/** WAV hening sangat pendek, dipakai untuk "membuka kunci" audio saat pertama kali disentuh. */
function silentWav(): string {
  const n = 800;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, "data"); v.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

/**
 * Musik 3 tahap (open -> candle -> final) memakai SATU elemen audio.
 * Di HP (terutama iPhone) tiap elemen audio butuh "dibuka" oleh sentuhan,
 * dan volume tidak bisa diatur, sehingga beberapa elemen bisa bunyi bersamaan.
 * Dengan satu elemen, hanya ada satu lagu yang bisa bunyi. Lagu diganti dengan mengubah src.
 */
export function useMusic(cfg: MusicConfig) {
  const el = useRef<HTMLAudioElement | null>(null);
  const stage = useRef<Stage | null>(null);
  const token = useRef(0);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const hasAny = Boolean(cfg.open || cfg.candle || cfg.final);

  const fade = (a: HTMLAudioElement, from: number, to: number, ms: number, done?: () => void) => {
    if (fadeTimer.current) clearInterval(fadeTimer.current);
    const steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    fadeTimer.current = setInterval(() => {
      i++;
      try { a.volume = Math.min(1, Math.max(0, from + ((to - from) * i) / steps)); } catch {}
      if (i >= steps) {
        if (fadeTimer.current) clearInterval(fadeTimer.current);
        fadeTimer.current = null;
        done?.();
      }
    }, 40);
  };

  /** Panggil di dalam sentuhan/klik user agar browser HP mengizinkan audio. */
  const start = useCallback(() => {
    if (el.current) return;
    const a = new Audio();
    a.preload = "auto";
    a.muted = mutedRef.current;
    a.loop = true;
    a.src = silentWav();
    a.play().catch(() => {});
    el.current = a;
  }, []);

  const goTo = useCallback(
    (next: Stage) => {
      if (stage.current === next) return;
      stage.current = next;
      document.body.dataset.music = next;
      const a = el.current;
      const src = cfg[next];
      if (!a || !src) return;
      const my = ++token.current;
      const swap = () => {
        if (my !== token.current) return;
        a.pause();
        a.src = src;
        a.loop = next !== "candle"; // lagu lilin diputar sekali agar api padam saat lagunya selesai
        try { a.volume = 0; } catch {}
        a.muted = mutedRef.current;
        a.play().catch(() => {});
        fade(a, 0, 1, 900);
      };
      if (!a.paused) fade(a, 1, 0, 400, swap);
      else swap();
    },
    [cfg]
  );

  /** Elemen audio tahap tertentu (hanya jika tahap itu sedang aktif), untuk menyinkronkan api lilin. */
  const getTrack = useCallback((s: Stage) => (stage.current === s ? el.current ?? undefined : undefined), []);

  const toggle = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (el.current) el.current.muted = mutedRef.current;
  }, []);

  useEffect(
    () => () => {
      if (fadeTimer.current) clearInterval(fadeTimer.current);
      el.current?.pause();
    },
    []
  );

  return { start, goTo, toggle, getTrack, muted, hasAny };
}