import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PartyPopper } from "lucide-react"
import { motion } from "framer-motion"

export function WinnerDialog({
  isOpen,
  onClose,
  onRemove,
  winner
}) {
  return (
    (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 bg-[#1C1C1C] p-0">
        <div className="px-8 py-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}>
              <PartyPopper className="w-10 h-10 text-[#FFD700]" />
            </motion.div>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-4xl font-bold text-white tracking-tight">
              We Have a Winner!
            </motion.h2>
            <motion.div
              initial={{ rotate: 20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}>
              <PartyPopper className="w-10 h-10 text-[#FFD700]" />
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-center mb-12">
            <h3 className="text-5xl font-black text-white tracking-wider leading-tight">{winner}</h3>
          </motion.div>

          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              onClick={onRemove}
              className="w-32 h-12 text-lg font-semibold bg-[#E74C3C] hover:bg-[#C0392B] transition-colors">
              Remove
            </Button>
            <Button
              onClick={onClose}
              className="w-32 h-12 text-lg font-semibold bg-[#34495E] hover:bg-[#2C3E50] text-white transition-colors">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>)
  );
}

