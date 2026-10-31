"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { burst } from "@/lib/confetti";
import { config } from "@/lib/config";
import { fmtB, judge, type Verdict } from "@/lib/parseSpeech";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRec = any;

const ERRORS: Record<string, string> = {
  "not-allowed":
    "Izin mikrofon ditolak. Aktifkan lewat ikon gembok di address bar, lalu coba lagi ya.",
  "service-not-allowed":
    "Izin mikrofon ditolak. Aktifkan lewat ikon gembok di address bar, lalu coba lagi ya.",
  "no-speech": "Aku nggak mendengar suaramu. Coba lagi ya.",
  "audio-capture": "Mikrofon tidak ditemukan di perangkat ini.",
  network: "Pengenalan suara butuh koneksi internet. Coba lagi ya.",
};

/** Layar pembuka berupa quiz yang dijawab dengan SUARA. Setelah "Lanjut" -> kejutan dimulai. */
export default function QuizGate({
  onOpen,
  onGesture,
  onUnlock,
}: {
  onOpen: () => void;
  onGesture: () => void;
  onUnlock?: () => void;
}) {
  const { quiz } = config;
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [live, setLive] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const recRef = useRef<AnyRec>(null);
  const altsRef = useRef<string[]>([]);
  const errRef = useRef<string | null>(null);
  const leavingRef = useRef(false);

  useEffect(() => {
    const w = window as AnyRec;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => recRef.current?.abort?.();
  }, []);

  const startListening = () => {
    const w = window as AnyRec;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR || listening) return;
    onUnlock?.(); // tap mikrofon = gesture user -> buka izin audio (penting untuk Safari)

    altsRef.current = [];
    errRef.current = null;
    setLive("");
    setMessage(null);
    setVerdict(null);

    const rec = new SR();
    rec.lang = "id-ID";
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = false;

    rec.onresult = (e: AnyRec) => {
      const res = e.results[e.results.length - 1];
      setLive(res[0].transcript);
      if (res.isFinal) altsRef.current = Array.from(res).map((a: AnyRec) => a.transcript);
    };
    
    
    rec.onerror = (e: AnyRec) => {
      errRef.current = e.error;
    };
    rec.onend = () => {
      setListening(false);
      setTries((t) => t + 1);
      if (altsRef.current.length) {
        const v = judge(
          altsRef.current,
          quiz.answerBillions,
          quiz.toleranceBillions
        );
        if (v.kind === "unclear")
          setMessage(
            `Aku dengar "${altsRef.current[0]}", belum nangkep angkanya. Coba lagi ya 🎤`
          );              
        else {
          setVerdict(v);
          // jawaban benar -> langsung lanjut ke kejutan, tanpa tombol
          if (v.kind === "right") setTimeout(() => next(), 1400);
        }
      } else if (errRef.current && errRef.current !== "aborted") {
        setMessage(
          ERRORS[errRef.current] ??
            "Ada masalah dengan pengenalan suara. Coba lagi ya."
        );
      } else {
        setMessage(ERRORS["no-speech"]);
      }
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setMessage("Gagal memulai mikrofon. Coba lagi ya.");
    }
  };

  const stopListening = () => recRef.current?.stop?.();

  const next = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    onGesture();
    setTimeout(() => burst(0.5, 0.55), 350);
    setTimeout(onOpen, 900);
};


  const answered = verdict !== null;
  const canSkip = tries >= 2 && !answered;

  return (
    <motion.div
      className="gate quiz-gate"
      exit={{ opacity: 0, scale: 1.12, filter: "blur(16px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="quiz-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={
          leaving
            ? { opacity: 0, scale: 0.9, filter: "blur(8px)" }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: leaving ? 0.5 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="q-eyebrow">Satu pertanyaan</p>
        <h1>{quiz.question}</h1>

        {supported === false ? (
          <div className="q-footer">
            <p className="q-feedback">
              Browser ini belum mendukung jawaban suara. Gunakan Chrome atau
              Safari ya.
            </p>
            <button className="btn" onClick={next}>
              Lanjut →
            </button>
          </div>
        ) : (
          <>
            {/* tombol mikrofon */}
            <div className="mic-wrap">
              <motion.button
                className={`mic-btn ${listening ? "on" : ""}`}
                onClick={listening ? stopListening : startListening}
                disabled={answered || supported === null}
                whileTap={{ scale: 0.92 }}
                aria-label={
                  listening ? "Berhenti mendengarkan" : "Jawab dengan suara"
                }
              >
                {listening && <span className="mic-ring" />}
                {listening && <span className="mic-ring r2" />}
                <svg
                  viewBox="0 0 24 24"
                  width="34"
                  height="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect
                    x="9"
                    y="3"
                    width="6"
                    height="9"
                    rx="3"
                    fill="currentColor"
                    opacity="0.12"
                  />
                  <path d="M5 11a7 7 0 0 0 14 0" />
                  <path d="M12 18v4" />
                  <path d="M8 22h8" />
                </svg>
              </motion.button>
              <p className="mic-label">
                {listening
                  ? "Mendengarkan… sebutkan jawabanmu"
                  : answered
                  ? "Jawaban diterima"
                  : "Tekan mikrofon, lalu jawab dengan suara"}
              </p>
              {listening && (
                <div className="bars" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              )}
            </div>

            <div className="q-footer">
              <AnimatePresence mode="wait">
                {(listening || (live && !message)) && !answered && (
                  <motion.p
                    key="live"
                    className="q-live"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {live ? `“${live}”` : "…"}
                  </motion.p>
                )}
                {message && !listening && !answered && (
                  <motion.div
                    key="msg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="q-feedback">{message}</p>
                    {canSkip && (
                      <button className="q-skip" onClick={next}>
                        Lewati →
                      </button>
                    )}
                  </motion.div>
                )}
                {answered && verdict && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="q-heard">
                      Kamu bilang: <b>±{fmtB(verdict.heardB ?? 0)} miliar</b>
                    </p>
                    <p className={`q-feedback ${verdict.kind}`}>
                      {verdict.kind === "right"
                        ? quiz.rightText
                        : quiz.wrongText}
                    </p>
                    {verdict.kind === "wrong" && (
                      <motion.button
                        className="btn"
                        onClick={next}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ scale: 1.04 }}
                      >
                        Lanjut →
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
