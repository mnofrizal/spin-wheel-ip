"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shuffle, ArrowDownAZ, Save } from "lucide-react";

export function EntriesPanel({
  names,
  winners,
  onShuffle,
  onSort,
  onSpin,
  onUpdateNames,
  ipsFilterEnabled,
}) {
  const [editableNames, setEditableNames] = useState("");

  useEffect(() => {
    setEditableNames(names.join("\n"));
  }, [names]);

  const handleSave = () => {
    const newNames = editableNames
      .split("\n")
      .filter((name) => name.trim() !== "");
    onUpdateNames(newNames);
  };

  return (
    <div className="flex h-[600px] w-[300px] flex-col overflow-hidden rounded-lg bg-[#1C1C1C] shadow-lg shadow-black/25">
      <Tabs defaultValue="entries" className="flex-1">
        <div className="flex items-center border-b border-gray-800 px-4 py-3">
          <TabsList className="flex-1 bg-transparent">
            <TabsTrigger
              value="entries"
              className="flex-1 text-gray-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
            >
              Daftar ({names.length})
            </TabsTrigger>
            <TabsTrigger
              value="winners"
              className="flex-1 text-gray-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
            >
              Pemenang ({winners.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="entries" className="m-0 flex flex-1 flex-col">
          <div className="flex gap-2 p-2">
            <Button
              variant="secondary"
              className="flex-1 bg-gray-800 text-white shadow-sm hover:bg-gray-700"
              onClick={onShuffle}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Acak
            </Button>
            <Button
              variant="secondary"
              className="flex-1 bg-gray-800 text-white shadow-sm hover:bg-gray-700"
              onClick={onSort}
            >
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              Urutkan
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <Textarea
              value={editableNames}
              onChange={(e) => setEditableNames(e.target.value)}
              className="min-h-[400px] border-gray-700 bg-gray-900 text-white shadow-sm"
              placeholder="Masukkan nama, satu per baris"
            />
          </ScrollArea>
          <div className="p-2">
            <Button
              onClick={handleSave}
              className="w-full bg-green-600 text-white shadow-sm hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="winners" className="m-0 flex-1">
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
      <div className="border-t border-gray-800 p-4">
        <Button
          className="w-full bg-blue-600 py-6 text-lg text-white shadow-sm hover:bg-blue-700"
          onClick={onSpin}
        >
          Putar
        </Button>
      </div>
    </div>
  );
}
