"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Stage = "open" | "candle" | "final";
export type MusicConfig = Record<Stage, string>;

export function useMusic(cfg: MusicConfig) {
  const els = useRef<Partial<Record<Stage, HTMLAudioElement>>>({});
  const stage = useRef<Stage | null>(null);
  const mutedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [muted, setMuted] = useState(false);
  const hasAny = Boolean(cfg.open || cfg.candle || cfg.final);

  /** Panggil di dalam event klik (gesture) agar browser mengizinkan audio. */
  const start = useCallback(() => {
    if (timer.current) return;
    (Object.keys(cfg) as Stage[]).forEach((s) => {
      if (!cfg[s]) return;
      const a = new Audio(cfg[s]);
      a.loop = s !== "candle"; // lagu lilin diputar sekali agar api padam saat lagunya selesai
      a.volume = 0;
      a.preload = "auto";
      els.current[s] = a;
      // "buka kunci" audio untuk tahap berikutnya (iOS/Safari) lalu jeda lagi
      a.play()
        .then(() => {
          if (stage.current !== s) {
            a.pause();
            a.currentTime = 0;
          }
        })
        .catch(() => {});
    });
    timer.current = setInterval(() => {
      (Object.entries(els.current) as [Stage, HTMLAudioElement][]).forEach(
        ([s, a]) => {
          const target = s === stage.current && !mutedRef.current ? 1 : 0;
          const diff = target - a.volume;
          if (Math.abs(diff) > 0.001)
            a.volume = Math.min(
              1,
              Math.max(0, a.volume + Math.sign(diff) * 0.03)
            );
          else if (target === 0 && s !== stage.current && !a.paused) a.pause();
        }
      );
    }, 40);
  }, [cfg]);

  const goTo = useCallback((next: Stage) => {
    if (stage.current === next) return;
    stage.current = next;
    document.body.dataset.music = next;
    const a = els.current[next];
    if (a) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  }, []);

  /** Akses elemen audio sebuah tahap (dipakai untuk menyinkronkan api lilin). */
  const getTrack = useCallback((s: Stage) => els.current[s], []);
  const toggle = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      Object.values(els.current).forEach((a) => a?.pause());
    },
    []
  );

  return { start, goTo, toggle, getTrack, muted, hasAny };
}
