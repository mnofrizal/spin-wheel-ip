import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useConfetti } from "@/hooks/use-confetti";

export function WinnerDialog({ isOpen, onClose, onRemove, winner }) {
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (isOpen) {
      fireConfetti();
    }
  }, [isOpen, fireConfetti]);

  const getCompanyName = (winner) => {
    const upperWinner = winner?.toUpperCase() || "";
    // Check for IPS first, then IP to avoid matching IP within IPS
    if (upperWinner.includes("IPS")) {
      return "PLN Indonesia Power Services";
    } else if (upperWinner.includes("IP")) {
      return "PLN Indonesia Power";
    }
    return "";
  };

  const companyName = getCompanyName(winner);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 bg-[#1C1C1C] p-0">
        <DialogTitle className="sr-only">Pengumuman Pemenang</DialogTitle>
        <div className="px-8 py-10">
          <div className="mb-8 flex items-center justify-center gap-3">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <PartyPopper className="h-10 w-10 text-[#FFD700]" />
            </motion.div>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-white"
            >
              Kita Punya Pemenang!
            </motion.h2>
            <motion.div
              initial={{ rotate: 20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <PartyPopper className="h-10 w-10 text-[#FFD700]" />
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mb-6 text-center"
          >
            <h3 className="mb-2 text-5xl font-black leading-tight tracking-wider text-white">
              {winner}
            </h3>
            {companyName && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-2xl font-medium text-blue-400"
              >
                {companyName}
              </motion.p>
            )}
          </motion.div>

          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              onClick={onRemove}
              className="h-12 w-32 bg-[#E74C3C] text-lg font-semibold transition-colors hover:bg-[#C0392B]"
            >
              Hapus
            </Button>
            <Button
              onClick={onClose}
              className="h-12 w-32 bg-[#34495E] text-lg font-semibold text-white transition-colors hover:bg-[#2C3E50]"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
