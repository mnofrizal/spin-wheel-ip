"use client";

import { useState } from "react";
import { Moon, Sun, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-blue-500 p-4 text-white shadow-md dark:bg-background dark:text-primary">
      <div className="text-2xl font-bold">EG Wheel Of Name</div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="hover:bg-blue-600 dark:hover:bg-accent"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="hover:bg-blue-600 dark:hover:bg-accent"
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}
