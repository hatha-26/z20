import confetti from "canvas-confetti";

const colors = ["#ff5f9e", "#ff9a62", "#a78bfa", "#ffd166", "#7bdff2"];

export function burst(x = 0.5, y = 0.6) {
  confetti({ particleCount: 140, spread: 100, startVelocity: 45, origin: { x, y }, colors, zIndex: 100 });
}

export function cannons(ms = 1400) {
  const end = Date.now() + ms;
  const frame = () => {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.85 }, colors, zIndex: 100 });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.85 }, colors, zIndex: 100 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function emojiRain(emoji = "💖", ms = 3500) {
  const shape = confetti.shapeFromText({ text: emoji, scalar: 4 });
  const end = Date.now() + ms;
  const frame = () => {
    confetti({
      particleCount: 2,
      startVelocity: 0,
      ticks: 300,
      gravity: 0.6,
      origin: { x: Math.random(), y: -0.05 },
      shapes: [shape],
      scalar: 3,
      flat: true,
      zIndex: 100,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}