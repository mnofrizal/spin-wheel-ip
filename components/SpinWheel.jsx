"use client";
import React, { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shuffle, MenuIcon as Menu2 } from "lucide-react";
import { Navbar } from "./Navbar"
import { WinnerDialog } from "./WinnerDialog"
import { EntriesPanel } from "./EntriesPanel"

const INITIAL_NAMES = ["IPS", "Bob", "IPS", "IPS", "IPS", "IP", "IPS"]

const COLORS = [
  "#3B82F6", // Blue
  "#22C55E", // Green
  "#EF4444", // Red
  "#F59E0B", // Orange
]

const calculateFontSize = (nameCount) => {
  const baseFontSize = 24
  const minFontSize = 10
  return Math.max(minFontSize, baseFontSize - (nameCount - 10) * 0.5);
}

const drawWheel = (canvas, names, ipsFilterEnabled) => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 20

  // Add shadow to the entire wheel
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
  ctx.shadowBlur = 15
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 5

  const fontSize = calculateFontSize(names.length)

  // Draw segments
  names.forEach((name, index) => {
    const startAngle = (index / names.length) * Math.PI * 2
    const endAngle = ((index + 1) / names.length) * Math.PI * 2
    const midAngle = (startAngle + endAngle) / 2

    // Draw segment
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.fillStyle = ipsFilterEnabled && name.toUpperCase().includes("IPS") ? "#808080" : COLORS[index % COLORS.length]
    ctx.fill()
    ctx.closePath()

    // Draw segment border
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()

    // Draw text
    ctx.save()
    ctx.translate(centerX, centerY)

    // Rotate the entire context to align with the segment
    ctx.rotate(midAngle)

    // Set text properties
    ctx.fillStyle = "#FFFFFF"
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    // Draw the text along the radius, close to the outer edge
    const textDistance = radius * 0.85 // Position text at 85% of the radius
    ctx.fillText(name, textDistance, 0)

    ctx.restore()
  })

  // Reset shadow for center circle
  ctx.shadowColor = "transparent"

  // Draw white center circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2)
  ctx.fillStyle = "#FFFFFF"
  ctx.fill()
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.closePath()
}

export default function SpinWheel() {
  const [names, setNames] = useState(INITIAL_NAMES)
  const [winners, setWinners] = useState([])
  const [winner, setWinner] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState("")
  const [showManageDialog, setShowManageDialog] = useState(false)
  const [showWinnerDialog, setShowWinnerDialog] = useState(false)
  const [ipsFilterEnabled, setIpsFilterEnabled] = useState(true)
  const [showEntries, setShowEntries] = useState(false) // Added state for EntriesPanel
  const canvasRef = useRef(null)
  const rotationValue = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, names, ipsFilterEnabled)
    }

    // Start the slow continuous spin only on initial load
    controls.start({
      rotate: 360,
      transition: {
        duration: 60,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    })

    // Cleanup function to stop the animation when component unmounts
    return () => {
      controls.stop()
    };
  }, [names, ipsFilterEnabled]) // Add names and ipsFilterEnabled to the dependency array

  const spinWheel = async (targetIndex = null) => {
    if (isSpinning) return

    setIsSpinning(true)
    setSpinResult("")
    setShowWinnerDialog(false)

    // Stop any ongoing animation
    controls.stop()

    // Reset rotation before spinning
    rotationValue.set(0)
    controls.set({ rotate: 0 })

    const spinDuration = 8 // seconds
    const minSpins = 5
    const maxSpins = 10
    const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins

    let targetRotation
    let winnerIndex

    if (targetIndex !== null) {
      winnerIndex = targetIndex
      targetRotation = 360 * randomSpins + (360 - (360 / names.length) * (targetIndex + Math.random()))
    } else {
      // Find a valid winner that respects the IPS filter
      do {
        winnerIndex = Math.floor(Math.random() * names.length)
      } while (ipsFilterEnabled && names[winnerIndex].toUpperCase().includes("IPS"))

      targetRotation = 360 * randomSpins + (360 - (360 / names.length) * (winnerIndex + Math.random()))
    }

    // Ensure clockwise rotation
    targetRotation = Math.abs(targetRotation)

    // Perform the spin animation
    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: spinDuration,
        ease: (t) => {
          // Custom easing function for more natural spin
          if (t < 0.5) {
            // Accelerate
            return 2 * t * t
          } else {
            // Decelerate with slight bounce
            const bounceT = (t - 0.5) * 2
            return 0.5 + (1 - Math.pow(1 - bounceT, 3)) / 2;
          }
        },
      },
    })

    setIsSpinning(false)
    setSpinResult(names[winnerIndex])
    setShowWinnerDialog(true)

    // The wheel now stays stopped after determining the winner
  }

  const handleWheelClick = () => {
    if (!isSpinning) {
      spinWheel(null)
    }
  }

  const handleRemoveWinner = () => {
    if (spinResult) {
      const newNames = names.filter((name) => name !== spinResult)
      setNames(newNames)
      setWinners([...winners, spinResult])
      setShowWinnerDialog(false)
      const canvas = canvasRef.current
      if (canvas) {
        drawWheel(canvas, newNames, ipsFilterEnabled)
      }
    }
  }

  const handleShuffle = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5)
    setNames(shuffled)
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, shuffled, ipsFilterEnabled)
    }
  }

  const handleSort = () => {
    const sorted = [...names].sort()
    setNames(sorted)
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, sorted, ipsFilterEnabled)
    }
  }

  const handleUpdateNames = (newNames) => {
    setNames(newNames)
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, newNames, ipsFilterEnabled)
    }
  }

  const toggleIpsFilter = () => {
    setIpsFilterEnabled(!ipsFilterEnabled)
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, names, !ipsFilterEnabled)
    }
  }

  return (
    (<div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto p-4 flex flex-col items-center">
        <div className="relative mb-4">
          {/* Toggle Entries Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 right-0 z-10"
            onClick={() => setShowEntries(!showEntries)}>
            <Menu2 className="h-6 w-6" />
          </Button>

          {/* Entries Panel */}
          <div
            className={`absolute top-10 right-0 z-20 transform transition-transform duration-300 ${
              showEntries ? "translate-x-0" : "translate-x-[320px]"
            }`}>
            <EntriesPanel
              names={names}
              winners={winners}
              onShuffle={handleShuffle}
              onSort={handleSort}
              onSpin={() => spinWheel(null)}
              onUpdateNames={handleUpdateNames}
              ipsFilterEnabled={ipsFilterEnabled} />
          </div>

          <motion.div
            animate={controls}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "500px",
              maxHeight: "500px",
            }}
            className="cursor-pointer"
            onClick={() => !isSpinning && spinWheel(null)}>
            <canvas ref={canvasRef} width={500} height={500} className="w-full h-full" />
          </motion.div>
          <div
            className="absolute top-1/2 right-[-1px] w-0 h-0 
            border-t-[16px] border-t-transparent
            border-r-[32px] border-r-gray-300
            border-b-[16px] border-b-transparent
            transform -translate-y-1/2"></div>
        </div>
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center space-x-2 justify-end">
            <Switch
              id="ips-filter"
              checked={ipsFilterEnabled}
              onCheckedChange={toggleIpsFilter} />
            <Label htmlFor="ips-filter">IPS Filter</Label>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter winner's name"
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className="flex-grow" />
            <Button
              onClick={() => spinWheel(names.indexOf(winner))}
              disabled={
                isSpinning ||
                !winner ||
                !names.includes(winner) ||
                (ipsFilterEnabled && winner.toUpperCase().includes("IPS"))
              }>
              Spin to Winner
            </Button>
          </div>
          <Button onClick={() => spinWheel()} disabled={isSpinning} className="w-full">
            <Shuffle className="w-4 h-4 mr-2" />
            Random Spin
          </Button>
        </div>
      </main>
      <WinnerDialog
        isOpen={showWinnerDialog}
        onClose={() => setShowWinnerDialog(false)}
        onRemove={handleRemoveWinner}
        winner={spinResult} />
    </div>)
  );
}

