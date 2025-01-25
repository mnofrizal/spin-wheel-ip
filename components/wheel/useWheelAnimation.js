"use client";

import { useCallback, useRef, useState, useEffect } from "react";

export const useWheelAnimation = (
  controls,
  rotationValue,
  names,
  ipsFilterEnabled
) => {
  const audioRef = useRef(null);
  const tingRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/applause.mp3"); // For winner sound
    tingRef.current = new Audio("/ting.mp3"); // For passing names sound
  }, []);
  const lastNamePassedRef = useRef(-1);
  const spinWheel = useCallback(
    async (targetIndex = null) => {
      const spinDuration = 6; // Keep total duration at 6 seconds
      const minSpins = 10;
      const maxSpins = 20;
      const randomSpins =
        Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;

      controls.stop();
      rotationValue.set(0);
      controls.set({ rotate: 0 });

      let targetRotation;
      let winnerIndex;

      if (targetIndex !== null) {
        winnerIndex = targetIndex;
        targetRotation =
          360 * randomSpins +
          (360 - (360 / names.length) * (targetIndex + Math.random()));
      } else {
        do {
          winnerIndex = Math.floor(Math.random() * names.length);
        } while (
          ipsFilterEnabled &&
          names[winnerIndex].toUpperCase().includes("IPS")
        );

        targetRotation =
          360 * randomSpins +
          (360 - (360 / names.length) * (winnerIndex + Math.random()));
      }

      targetRotation = Math.abs(targetRotation);

      // Reset the last passed name index
      lastNamePassedRef.current = -1;

      await controls.start({
        rotate: targetRotation,
        transition: {
          duration: spinDuration,
          ease: (t) => {
            // Calculate current rotation
            const currentRotation = t * targetRotation;
            // Calculate which name is passing the arrow
            const nameCount = names.length;
            const degreesPerName = 360 / nameCount;
            const currentNameIndex = Math.floor(
              (currentRotation % 360) / degreesPerName
            );

            // Play sound when a new name passes
            if (currentNameIndex !== lastNamePassedRef.current) {
              lastNamePassedRef.current = currentNameIndex;
              tingRef.current.currentTime = 0;
              tingRef.current.play().catch(console.error);
            }

            if (t < 0.1) {
              // Reduced acceleration phase to 10% of total time
              // Steeper acceleration curve for faster initial speed
              return 8 * t * t; // Increased multiplier for faster acceleration
            } else {
              // Longer, smoother deceleration (90% of time)
              const decelerateT = (t - 0.1) / 0.9;
              // Using a higher power (5) for more dramatic slowdown
              return 0.08 + (1 - Math.pow(1 - decelerateT, 5)) / 1.09;
            }
          },
        },
      });

      // Play applause sound when wheel stops
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);

      return winnerIndex;
    },
    [controls, rotationValue, names, ipsFilterEnabled]
  );

  return { spinWheel };
};
