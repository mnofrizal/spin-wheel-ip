"use client";
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Shuffle, ArrowDownAZ, Save } from "lucide-react"

export function EntriesPanel({
  names,
  winners,
  onShuffle,
  onSort,
  onSpin,
  onUpdateNames,
  ipsFilterEnabled
}) {
  const [editableNames, setEditableNames] = useState("")

  useEffect(() => {
    setEditableNames(names.join("\n"))
  }, [names])

  const handleSave = () => {
    const newNames = editableNames.split("\n").filter((name) => name.trim() !== "")
    onUpdateNames(newNames)
  }

  return (
    (<div
      className="w-[300px] bg-[#1C1C1C] rounded-lg overflow-hidden flex flex-col h-[600px]">
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
        </div>

        <TabsContent value="entries" className="flex-1 m-0 flex flex-col">
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
            <Textarea
              value={editableNames}
              onChange={(e) => setEditableNames(e.target.value)}
              className="min-h-[400px] bg-gray-900 text-white border-gray-700"
              placeholder="Enter names, one per line" />
          </ScrollArea>
          <div className="p-2">
            <Button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
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
    </div>)
  );
}

