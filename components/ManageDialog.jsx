"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Shuffle, ArrowDownAZ } from "lucide-react"

export function ManageDialog({
  isOpen,
  onClose,
  names,
  winners,
  onShuffle,
  onSort,
  onSpin,
  ipsFilterEnabled
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 bg-[#1C1C1C] border-0">
        <DialogTitle className="sr-only">Manage Entries and Winners</DialogTitle>
        <div className="relative h-[600px] flex flex-col">
          <Tabs defaultValue="entries" className="flex-1">
            <div className="flex items-center px-4 py-3 border-b border-gray-800">
              <TabsList className="flex-1 bg-transparent">
                <TabsTrigger
                  value="entries"
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 text-gray-400">
                  Entries ({names.length})
                </TabsTrigger>
                <TabsTrigger
                  value="winners"
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:text-blue-500 text-gray-400">
                  Winners ({winners.length})
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-gray-400 hover:text-white"
                onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="entries" className="flex-1 m-0">
              <div className="p-2 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                  onClick={onShuffle}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Shuffle
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                  onClick={onSort}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {names.map((name, index) => (
                    <div
                      key={index}
                      className={`text-lg ${
                        ipsFilterEnabled && name.toUpperCase().includes("IPS") ? "text-gray-500" : "text-white"
                      }`}>
                      {name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="winners" className="flex-1 m-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {winners.map((name, index) => (
                    <div key={index} className="text-lg text-white">
                      {name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="p-4 border-t border-gray-800">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              onClick={onSpin}>
              Spin
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}