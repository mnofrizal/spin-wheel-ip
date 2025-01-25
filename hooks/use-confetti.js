"use client";
import { useCallback } from 'react';
import confetti from 'canvas-confetti';

const PRIDE_COLORS = [
  '#FF0018', // Red
  '#FFA52C', // Orange
  '#FFFF41', // Yellow
  '#008018', // Green
  '#0000F9', // Blue
  '#86007D'  // Purple
];

export function useConfetti() {
  const firework = useCallback((x, y, colors) => {
    const end = Date.now() + 500; // Reduced from 1000ms to 500ms

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 25,
        startVelocity: 30,
        spread: 360,
        ticks: 40, // Reduced from 60 to 40
        origin: { x, y },
        colors: colors,
        shapes: ['circle', 'square'],
        gravity: 1.2,
        scalar: 0.8,
        drift: 0,
      });
    }, 50);
  }, []);

  const prideConfetti = useCallback(() => {
    const duration = 2000; // Reduced from 6000ms to 2000ms
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3, // Reduced from 4 to 3
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: PRIDE_COLORS,
      });
      confetti({
        particleCount: 3, // Reduced from 4 to 3
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: PRIDE_COLORS,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const fireConfetti = useCallback(() => {
    // Initial burst
    confetti({
      particleCount: 100, // Reduced from 150 to 100
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6B6B', '#4CAF50'],
    });

    // Start pride confetti streams
    prideConfetti();

    // Firework sequence - reduced delays
    setTimeout(() => firework(0.25, 0.5, ['#ff0000', '#ff4444', '#ff8888']), 200);
    setTimeout(() => firework(0.75, 0.5, ['#0044ff', '#4488ff', '#88ccff']), 400);
    setTimeout(() => firework(0.5, 0.5, ['#44ff44', '#88ff88', '#bbffbb']), 600);
    
    // Additional bursts - reduced delays and particle counts
    setTimeout(() => {
      confetti({
        particleCount: 50, // Reduced from 80 to 50
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.5 },
        colors: ['#00BCD4', '#2196F3', '#9C27B0', '#E91E63', '#FF9800'],
      });
    }, 800);

    setTimeout(() => {
      confetti({
        particleCount: 50, // Reduced from 80 to 50
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.5 },
        colors: ['#76FF03', '#64FFDA', '#18FFFF', '#FF4081', '#B388FF'],
      });
    }, 1000);

    // Grand finale - reduced delay
    setTimeout(() => {
      firework(0.2, 0.5, PRIDE_COLORS);
      firework(0.5, 0.5, PRIDE_COLORS);
      firework(0.8, 0.5, PRIDE_COLORS);
    }, 1200);
  }, [firework, prideConfetti]);

  return { fireConfetti };
}