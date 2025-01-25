"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export function SettingsPanel({
  ipsFilterEnabled,
  onToggleIpsFilter,
  onUpdateNames,
  borderThickness = 2,
  onBorderThicknessChange,
  showBorder = true,
  onToggleBorder,
  showShadow = true,
  onToggleShadow,
  centerSize = 15,
  onCenterSizeChange,
  arrowOffset = 0,
  onArrowOffsetChange,
  winner = "",
  onWinnerChange,
  onSpinToWinner,
  isSpinning,
  names,
  className,
  onResetSettings,
}) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const names = jsonData.map((row) => {
          const name = row.name || row.Name || Object.values(row)[0];
          const entity = row.entity || row.Entity || Object.values(row)[1];
          return `${name.toUpperCase()} - ${entity.toUpperCase()}`;
        });

        if (names.length > 0) {
          onUpdateNames(names);
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        alert(
          "Kesalahan memproses file Excel. Pastikan file memiliki kolom nama dan entitas."
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`w-[300px] bg-[#1C1C1C] rounded-lg overflow-hidden flex flex-col p-4 shadow-lg shadow-black/25 ${className}`}
    >
      <h2 className="mb-4 text-lg font-semibold text-white">Pengaturan</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="ips-filter" className="text-white">
            Filter IPS
          </Label>
          <Switch
            id="ips-filter"
            checked={ipsFilterEnabled}
            onCheckedChange={onToggleIpsFilter}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="wheel-border" className="text-white">
            Batas Roda
          </Label>
          <Switch
            id="wheel-border"
            checked={showBorder}
            onCheckedChange={onToggleBorder}
          />
        </div>

        {showBorder && (
          <div className="space-y-2">
            <Label className="text-white">Ketebalan Batas</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[borderThickness]}
                onValueChange={([value]) => onBorderThicknessChange(value)}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="min-w-[2rem] text-center text-white">
                {borderThickness}px
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="wheel-shadow" className="text-white">
            Bayangan Roda
          </Label>
          <Switch
            id="wheel-shadow"
            checked={showShadow}
            onCheckedChange={onToggleShadow}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Ukuran Lingkaran Tengah</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[centerSize]}
              onValueChange={([value]) => onCenterSizeChange(value)}
              min={5}
              max={30}
              step={1}
              className="flex-1"
            />
            <span className="min-w-[2rem] text-center text-white">
              {centerSize}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Posisi Y Panah</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[arrowOffset]}
              onValueChange={([value]) => onArrowOffsetChange(value)}
              min={-100}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="min-w-[2rem] text-center text-white">
              {arrowOffset}px
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-700 pt-4">
          <Label className="text-white">Putar ke Pemenang</Label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Masukkan nama pemenang"
              value={winner}
              onChange={(e) => onWinnerChange(e.target.value)}
              className="flex-grow border-gray-700 bg-gray-800 text-white shadow-sm"
            />
            <Button
              onClick={onSpinToWinner}
              disabled={
                isSpinning ||
                !winner ||
                !names.includes(winner) ||
                (ipsFilterEnabled && winner.toUpperCase().includes("IPS"))
              }
              className="shrink-0 shadow-sm"
            >
              Putar
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <Label className="mb-2 block text-white">Impor Nama</Label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            className="flex w-full items-center justify-center gap-2 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Unggah Excel
          </Button>
          <p className="mt-2 text-xs text-gray-400">
            Unggah file Excel dengan kolom nama dan entitas
          </p>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <Button
            onClick={onResetSettings}
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            Atur Ulang ke Default
          </Button>
        </div>
      </div>
    </div>
  );
}
