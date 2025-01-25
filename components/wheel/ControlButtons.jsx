import { Button } from "@/components/ui/button"
import { Settings, MenuIcon as Menu2 } from "lucide-react"

export function ControlButtons({ onToggleSettings, onToggleEntries }) {
  return (
    <div className="fixed top-20 right-4 z-50 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSettings}
        className="bg-background/80 backdrop-blur-sm shadow-lg">
        <Settings className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleEntries}
        className="bg-background/80 backdrop-blur-sm shadow-lg">
        <Menu2 className="h-6 w-6" />
      </Button>
    </div>
  )
}