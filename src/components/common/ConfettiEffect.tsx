import confetti from 'canvas-confetti';

export const fireCelebrationConfetti = () => {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f43f5e', '#fb7185', '#fbbf24', '#a855f7', '#38bdf8', '#34d399'],
  });

  // Left & right cannons with a slight delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#fda4af', '#f43f5e', '#fef08a', '#c084fc'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#fda4af', '#f43f5e', '#fef08a', '#c084fc'],
    });
  }, 250);

  // Gentle star shower
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.4 },
      shapes: ['circle'],
      scalar: 1.2,
      colors: ['#fbbf24', '#f59e0b', '#f43f5e'],
    });
  }, 600);
};

export const fireHeartConfetti = () => {
  confetti({
    particleCount: 45,
    spread: 80,
    origin: { y: 0.65 },
    colors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48'],
    scalar: 1.3,
  });
};

