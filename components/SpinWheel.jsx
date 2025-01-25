"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shuffle, MenuIcon as Menu2 } from "lucide-react"
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

  ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
  ctx.shadowBlur = 15
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 5

  const fontSize = calculateFontSize(names.length)

  names.forEach((name, index) => {
    const startAngle = (index / names.length) * Math.PI * 2
    const endAngle = ((index + 1) / names.length) * Math.PI * 2
    const midAngle = (startAngle + endAngle) / 2

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.fillStyle = ipsFilterEnabled && name.toUpperCase().includes("IPS") ? "#808080" : COLORS[index % COLORS.length]
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(midAngle)
    ctx.fillStyle = "#FFFFFF"
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    const textDistance = radius * 0.85
    ctx.fillText(name, textDistance, 0)
    ctx.restore()
  })

  ctx.shadowColor = "transparent"
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
  const [showWinnerDialog, setShowWinnerDialog] = useState(false)
  const [ipsFilterEnabled, setIpsFilterEnabled] = useState(true)
  const [showEntries, setShowEntries] = useState(false)
  const canvasRef = useRef(null)
  const rotationValue = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, names, ipsFilterEnabled)
    }

    controls.start({
      rotate: 360,
      transition: {
        duration: 60,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    })

    const intervalId = setInterval(() => {
      const currentRotation = rotationValue.get()
      rotationValue.set((currentRotation + 1) % 360)
    }, 1000 / 60)

    return () => {
      controls.stop()
      clearInterval(intervalId)
    };
  }, [controls, names, ipsFilterEnabled, rotationValue.get]) // Added rotationValue.get to dependencies

  const spinWheel = async (targetIndex = null) => {
    if (isSpinning) return

    setIsSpinning(true)
    setSpinResult("")
    setShowWinnerDialog(false)

    controls.stop()

    const currentRotation = rotationValue.get()

    const spinDuration = 8
    const minSpins = 5
    const maxSpins = 10
    const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins

    let targetRotation
    let winnerIndex

    if (targetIndex !== null) {
      winnerIndex = targetIndex
      targetRotation =
        currentRotation + 360 * randomSpins + (360 - (360 / names.length) * (targetIndex + Math.random()))
    } else {
      do {
        winnerIndex = Math.floor(Math.random() * names.length)
      } while (ipsFilterEnabled && names[winnerIndex].toUpperCase().includes("IPS"))

      targetRotation =
        currentRotation + 360 * randomSpins + (360 - (360 / names.length) * (winnerIndex + Math.random()))
    }

    targetRotation = Math.abs(targetRotation)

    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: spinDuration,
        ease: (t) => {
          if (t < 0.5) {
            return 2 * t * t
          } else {
            const bounceT = (t - 0.5) * 2
            return 0.5 + (1 - Math.pow(1 - bounceT, 3)) / 2;
          }
        },
      },
    })

    setIsSpinning(false)
    setSpinResult(names[winnerIndex])
    setShowWinnerDialog(true)

    rotationValue.set(targetRotation % 360)
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

  const toggleIpsFilter = () => {
    setIpsFilterEnabled(!ipsFilterEnabled)
    const canvas = canvasRef.current
    if (canvas) {
      drawWheel(canvas, names, !ipsFilterEnabled)
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

  return (
    (<div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto p-4 flex flex-col items-center">
        <div className="relative mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 right-0 z-10"
            onClick={() => setShowEntries(!showEntries)}>
            <Menu2 className="h-6 w-6" />
          </Button>

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

