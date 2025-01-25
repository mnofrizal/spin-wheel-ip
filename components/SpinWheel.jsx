"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Navbar } from "./Navbar";
import { WinnerDialog } from "./WinnerDialog";
import { EntriesPanel } from "./EntriesPanel";
import { SettingsPanel } from "./SettingsPanel";
import { drawWheel } from "./wheel/WheelDrawer";
import { useWheelAnimation } from "./wheel/useWheelAnimation";
import { ControlButtons } from "./wheel/ControlButtons";
import { useWheelSettings } from "@/hooks/use-wheel-settings";

const INITIAL_NAMES = ["IPS", "Bob", "IPS", "IPS", "IPS", "IP", "IPS"];
const MIN_WHEEL_SIZE = 500;
const CONTAINER_PADDING = 40;

const defaultSettings = {
  ipsFilterEnabled: true,
  showBorder: true,
  borderThickness: 1,
  showShadow: true,
  centerSize: 15,
  arrowOffset: 0,
};

export default function SpinWheel() {
  const { settings, updateSettings, isLoaded } = useWheelSettings();
  const [names, setNames] = useState(INITIAL_NAMES);
  const [winners, setWinners] = useState([]);
  const [winner, setWinner] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState("");
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wheelSize, setWheelSize] = useState(MIN_WHEEL_SIZE); // Start with minimum size, will update on mount

  // Use default settings if not loaded yet
  const currentSettings = isLoaded ? settings : defaultSettings;

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rotationValue = useMotionValue(0);
  const controls = useAnimation();
  const { spinWheel } = useWheelAnimation(
    controls,
    rotationValue,
    names,
    currentSettings.ipsFilterEnabled
  );

  // Update wheel size and redraw when container is mounted, on resize, or when settings change
  useEffect(() => {
    let timeoutId;
    const updateWheelSize = () => {
      if (!containerRef.current || !canvasRef.current) return;

      const containerWidth = window.innerWidth - CONTAINER_PADDING * 2;
      const containerHeight = window.innerHeight - 200; // Account for navbar and padding
      const maxSize = Math.min(containerWidth, containerHeight);
      const newSize = Math.max(maxSize, MIN_WHEEL_SIZE);

      // Update canvas size first
      canvasRef.current.width = newSize;
      canvasRef.current.height = newSize;

      // Then update state and redraw
      setWheelSize(newSize);
      drawWheel(
        canvasRef.current,
        names,
        currentSettings.ipsFilterEnabled,
        currentSettings.showBorder ? currentSettings.borderThickness : 0,
        currentSettings.showShadow,
        currentSettings.centerSize / 100
      );
    };

    // Debounced resize handler
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWheelSize, 100);
    };

    // Initial update
    updateWheelSize();

    // Add resize listener with debounce
    window.addEventListener("resize", handleResize);
    window.addEventListener("fullscreenchange", updateWheelSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fullscreenchange", updateWheelSize);
      clearTimeout(timeoutId);
    };
  }, [names, currentSettings, wheelSize]); // Added wheelSize to dependencies

  const handleSpinWheel = async (targetIndex = null) => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult("");
    setShowWinnerDialog(false);

    const winnerIndex = await spinWheel(targetIndex);
    setSpinResult(names[winnerIndex]);
    setShowWinnerDialog(true);
    setIsSpinning(false);
  };

  const handleRemoveWinner = () => {
    if (spinResult) {
      const newNames = names.filter((name) => name !== spinResult);
      setNames(newNames);
      setWinners([...winners, spinResult]);
      setShowWinnerDialog(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffled);
  };

  const handleSort = () => {
    const sorted = [...names].sort();
    setNames(sorted);
  };

  const handleUpdateNames = (newNames) => {
    setNames(newNames);
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
    setShowEntries(false);
  };

  const handleToggleEntries = () => {
    setShowEntries(!showEntries);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main
        className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-0"
        ref={containerRef}
      >
        <ControlButtons
          onToggleSettings={handleToggleSettings}
          onToggleEntries={handleToggleEntries}
        />

        <div className="relative flex w-full flex-1 items-center justify-center">
          {/* Settings Panel */}
          <div
            className={`fixed top-20 right-4 z-40 transform transition-transform duration-300 ${
              showSettings ? "translate-x-0" : "translate-x-[320px]"
            }`}
          >
            <SettingsPanel
              ipsFilterEnabled={currentSettings.ipsFilterEnabled}
              onToggleIpsFilter={(enabled) =>
                updateSettings({ ipsFilterEnabled: enabled })
              }
              onUpdateNames={handleUpdateNames}
              borderThickness={currentSettings.borderThickness}
              onBorderThicknessChange={(value) =>
                updateSettings({ borderThickness: value })
              }
              showBorder={currentSettings.showBorder}
              onToggleBorder={(enabled) =>
                updateSettings({ showBorder: enabled })
              }
              showShadow={currentSettings.showShadow}
              onToggleShadow={(enabled) =>
                updateSettings({ showShadow: enabled })
              }
              centerSize={currentSettings.centerSize}
              onCenterSizeChange={(value) =>
                updateSettings({ centerSize: value })
              }
              arrowOffset={currentSettings.arrowOffset}
              onArrowOffsetChange={(value) =>
                updateSettings({ arrowOffset: value })
              }
              winner={winner}
              onWinnerChange={setWinner}
              onSpinToWinner={() => handleSpinWheel(names.indexOf(winner))}
              isSpinning={isSpinning}
              names={names}
              onResetSettings={() => updateSettings(defaultSettings)}
            />
          </div>

          {/* Entries Panel */}
          <div
            className={`fixed top-20 right-4 z-40 transform transition-transform duration-300 ${
              showEntries ? "translate-x-0" : "translate-x-[320px]"
            }`}
          >
            <EntriesPanel
              names={names}
              winners={winners}
              onShuffle={handleShuffle}
              onSort={handleSort}
              onSpin={() => handleSpinWheel(null)}
              onUpdateNames={handleUpdateNames}
              ipsFilterEnabled={currentSettings.ipsFilterEnabled}
            />
          </div>

          {/* Wheel Container */}
          <div className="relative">
            <motion.div
              animate={controls}
              style={{
                width: wheelSize,
                height: wheelSize,
              }}
              className="cursor-pointer"
              onClick={() => !isSpinning && handleSpinWheel(null)}
            >
              <canvas
                ref={canvasRef}
                width={wheelSize}
                height={wheelSize}
                className="h-full w-full"
              />
            </motion.div>

            {/* Arrow indicator with outline */}
            <div
              className="absolute right-[-2px] top-1/2 z-10 h-0 w-0"
              style={{
                transform: `translateY(${currentSettings.arrowOffset}px)`,
              }}
            >
              {/* Black outline - rendered as 4 slightly offset arrows */}
              <div className="absolute right-[-2px] top-[-24px] h-0 w-0 translate-x-[2px] transform border-b-[24px] border-r-[48px] border-t-[24px] border-b-transparent border-r-black border-t-transparent" />
              <div className="absolute right-[-2px] top-[-24px] h-0 w-0 translate-x-[-2px] transform border-b-[24px] border-r-[48px] border-t-[24px] border-b-transparent border-r-black border-t-transparent" />
              <div className="absolute right-[-2px] top-[-24px] h-0 w-0 translate-y-[2px] transform border-b-[24px] border-r-[48px] border-t-[24px] border-b-transparent border-r-black border-t-transparent" />
              <div className="absolute right-[-2px] top-[-24px] h-0 w-0 translate-y-[-2px] transform border-b-[24px] border-r-[48px] border-t-[24px] border-b-transparent border-r-black border-t-transparent" />

              {/* Red arrow on top */}
              <div className="absolute right-[-2px] top-[-24px] h-0 w-0 border-b-[24px] border-r-[48px] border-t-[24px] border-b-transparent border-r-red-500 border-t-transparent" />
            </div>
          </div>
        </div>
      </main>

      <WinnerDialog
        isOpen={showWinnerDialog}
        onClose={() => setShowWinnerDialog(false)}
        onRemove={handleRemoveWinner}
        winner={spinResult}
      />
    </div>
  );
}
