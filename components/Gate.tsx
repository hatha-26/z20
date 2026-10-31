"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { burst } from "@/lib/confetti";
import { config } from "@/lib/config";

export default function Gate({ onOpen, onGesture }: { onOpen: () => void; onGesture: () => void }) {
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onGesture();
    setTimeout(() => burst(0.5, 0.5), 350);
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div
      className="gate"
      exit={{ opacity: 0, scale: 1.15, filter: "blur(14px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <motion.div
          className="gift"
          onClick={open}
          initial={{ scale: 0.6, opacity: 0, y: 40 }}
          animate={
            opening
              ? { scale: 1.25, y: 10 }
              : { scale: 1, opacity: 1, y: [0, -8, 0] }
          }
          transition={
            opening
              ? { type: "spring", stiffness: 200, damping: 12 }
              : { scale: { type: "spring", stiffness: 160, damping: 12 }, y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" } }
          }
          whileHover={opening ? undefined : { rotate: [0, -4, 4, -3, 0], transition: { duration: 0.5 } }}
          whileTap={{ scale: 0.94 }}
        >
          <div className="gift-body" />
          <motion.div
            className="gift-lid"
            animate={opening ? { y: -90, rotate: -22, opacity: 0.0 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 11, opacity: { delay: 0.6, duration: 0.5 } }}
          >
            <div className="bow"><i /><i /></div>
          </motion.div>
          {opening && (
            <motion.div
              style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontSize: "3rem" }}
              initial={{ y: 30, opacity: 0, scale: 0.4 }}
              animate={{ y: -80, opacity: [0, 1, 1, 0], scale: 1.2 }}
              transition={{ duration: 1.2, delay: 0.25 }}
            >
              💖
            </motion.div>
          )}
        </motion.div>

        <motion.h1 animate={{ opacity: opening ? 0 : 1 }} initial={{ opacity: 0 }} transition={{ delay: opening ? 0 : 0.4 }}>
          Ada hadiah buat {config.name}
        </motion.h1>
        <motion.p animate={{ opacity: opening ? 0 : 1 }} initial={{ opacity: 0 }} transition={{ delay: opening ? 0 : 0.6 }}>
          dari seseorang yang sayang banget sama kamu
        </motion.p>
        <motion.span
          className="hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 0 : [0.5, 1, 0.5] }}
          transition={opening ? {} : { repeat: Infinity, duration: 2 }}
        >
          👆 ketuk kotaknya
        </motion.span>
      </div>
    </motion.div>
  );
}