
"use client"

import React, { useState } from 'react';
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, Calendar } from 'lucide-react';
import { Letter } from '@/lib/types';
import { exportLettersToExcel } from '@/lib/utils/excel';
import { useToast } from '@/hooks/use-toast';

interface ExportSheetProps {
  letters: Letter[];
  onClose: () => void;
}

const MONTHS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

export default function ExportSheet({ letters, onClose }: ExportSheetProps) {
  const [reportType, setReportType] = useState<'all' | 'monthly'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      let filtered = letters;
      if (reportType === 'monthly') {
        filtered = letters.filter(l => {
          const date = new Date(l.date);
          const m = (date.getMonth() + 1).toString().padStart(2, '0');
          const y = date.getFullYear().toString();
          return m === selectedMonth && y === selectedYear;
        });

        if (filtered.length === 0) {
          toast({
            title: "Data Kosong",
            description: "Tidak ada data arsip pada bulan yang dipilih.",
            variant: "destructive"
          });
          setIsExporting(false);
          return;
        }
      }

      await exportLettersToExcel(filtered, reportType === 'monthly' ? { month: selectedMonth, year: selectedYear } : undefined);
      
      toast({
        title: "Ekspor Berhasil",
        description: "File Excel sedang diunduh.",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Ekspor Gagal",
        description: "Terjadi kesalahan saat memproses data.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-md border-l border-slate-300 bg-white p-0 flex flex-col focus:outline-none shadow-none">
      <SheetHeader className="p-6 border-b border-slate-300 bg-slate-50/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
          </div>
          <SheetTitle className="text-xl font-semibold tracking-tight text-slate-900">Ekspor Data Arsip</SheetTitle>
        </div>
        <SheetDescription className="text-sm font-medium text-slate-400">
          Pilih kriteria laporan yang ingin Anda unduh dalam format Microsoft Excel (.xlsx).
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 p-6 space-y-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-900">Jenis Laporan</Label>
            <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
              <SelectTrigger className="h-10 border-slate-300 bg-white text-sm font-medium shadow-none focus:ring-1 focus:ring-slate-400">
                <SelectValue placeholder="Pilih Jenis Laporan" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 shadow-none">
                <SelectItem value="all" className="text-sm">Semua Data Arsip</SelectItem>
                <SelectItem value="monthly" className="text-sm">Laporan Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === 'monthly' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-slate-900">Pilih Bulan</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-10 border-slate-300 bg-white text-sm font-medium shadow-none focus:ring-1 focus:ring-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300 shadow-none">
                    {MONTHS.map(m => (
                      <SelectItem key={m.value} value={m.value} className="text-sm">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-slate-900">Tahun</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-10 border-slate-300 bg-white text-sm font-medium shadow-none focus:ring-1 focus:ring-slate-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300 shadow-none">
                    {['2023', '2024', '2025', '2026'].map(y => (
                      <SelectItem key={y} value={y} className="text-sm">{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 rounded border border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Informasi File</p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {reportType === 'all' 
                  ? `Mengekspor seluruh ${letters.length} data arsip yang tersimpan dalam sistem.`
                  : `Mengekspor arsip untuk periode ${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <SheetFooter className="p-6 border-t border-slate-300 bg-slate-50/10 sm:flex-col gap-3">
        <Button 
          onClick={handleDownload} 
          disabled={isExporting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm h-11 shadow-none transition-all"
        >
          {isExporting ? 'Memproses...' : (
            <>
              <Download className="mr-2 h-4 w-4" /> Unduh Laporan Excel
            </>
          )}
        </Button>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="w-full text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-transparent"
        >
          Batalkan
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
