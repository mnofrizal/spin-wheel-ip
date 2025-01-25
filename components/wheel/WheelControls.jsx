import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

export function WheelControls({ 
  winner, 
  onWinnerChange, 
  onSpinToWinner, 
  onRandomSpin, 
  isSpinning, 
  names, 
  ipsFilterEnabled 
}) {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter winner's name"
          value={winner}
          onChange={(e) => onWinnerChange(e.target.value)}
          className="flex-grow"
        />
        <Button
          onClick={onSpinToWinner}
          disabled={
            isSpinning ||
            !winner ||
            !names.includes(winner) ||
            (ipsFilterEnabled && winner.toUpperCase().includes("IPS"))
          }>
          Spin to Winner
        </Button>
      </div>
      <Button onClick={onRandomSpin} disabled={isSpinning} className="w-full">
        <Shuffle className="w-4 h-4 mr-2" />
        Random Spin
      </Button>
    </div>
  )
}