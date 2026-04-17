"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Mail, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Letter, LetterType } from '@/lib/types';
import { exportLettersToExcel } from '@/lib/utils/excel';
import LetterTable from '@/components/letters/LetterTable';
import LetterForm from '@/components/letters/LetterForm';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from "@/components/ui/sidebar"

const INITIAL_LETTERS: Letter[] = [
  {
    id: '001',
    refNumber: '400/12/SK/2023',
    sender: 'Dinas Pendidikan',
    recipient: 'Sekretariat Utama',
    subject: 'Permohonan Bantuan Dana Operasional',
    date: '2023-11-20',
    type: 'Masuk',
    createdAt: '2023-11-21T08:00:00Z',
    updatedAt: '2023-11-21T08:00:00Z',
    fileName: 'surat_bantuan_dana.pdf'
  },
  {
    id: '002',
    refNumber: '401/05/OUT/2023',
    sender: 'Sekretariat Utama',
    recipient: 'Kementerian Keuangan',
    subject: 'Laporan Pertanggungjawaban Tahunan',
    date: '2023-12-05',
    type: 'Keluar',
    createdAt: '2023-12-06T10:30:00Z',
    updatedAt: '2023-12-06T10:30:00Z',
    fileName: 'lpj_2023.pdf'
  }
];

export default function Dashboard() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | LetterType>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetters(INITIAL_LETTERS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredLetters = useMemo(() => {
    return letters.filter(l => {
      const matchesSearch = 
        l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.recipient.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'All' || l.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [letters, searchTerm, typeFilter]);

  const nextAgendaNumber = useMemo(() => {
    if (letters.length === 0) return "001";
    const maxId = letters.reduce((max, l) => Math.max(max, parseInt(l.id)), 0);
    return (maxId + 1).toString().padStart(3, '0');
  }, [letters]);

  const lastLetter = letters.length > 0 ? letters[0] : undefined;

  const handleAddLetter = (data: Partial<Letter>) => {
    const newLetter: Letter = {
      ...data,
      id: nextAgendaNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Letter;
    setLetters(prev => [newLetter, ...prev]);
    setIsFormOpen(false);
    toast({
      title: "Berhasil",
      description: "Surat Berhasil Ditambahkan Ke Arsip.",
    });
  };

  const handleUpdateLetter = (id: string, data: Partial<Letter>) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l));
    toast({
      title: "Berhasil",
      description: "Data Surat Telah Diperbarui.",
    });
  };

  const handleDeleteLetter = (id: string) => {
    setLetters(prev => prev.filter(l => l.id !== id));
    toast({
      title: "Terhapus",
      description: "Surat Telah Dihapus Dari Arsip.",
    });
  };

  const handleExport = async () => {
    try {
      await exportLettersToExcel(filteredLetters);
    } catch (err) {
      toast({
        title: "Gagal Export",
        description: "Terjadi Kesalahan Saat Mengekspor Data.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="h-16 border-b border-slate-300 bg-white flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-slate-600 hover:bg-slate-50 transition-colors" />
          <div className="h-6 w-px bg-slate-200 hidden md:block" />
          <h2 className="text-[11px] font-bold text-slate-400 hidden md:block tracking-widest">Digital Archive Management</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex h-9 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-300"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
            Export Excel
          </Button>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground h-9 text-xs font-bold px-5 border border-primary shadow-none hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Arsip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl border-slate-300 bg-white p-0 overflow-hidden max-h-[90vh] flex flex-col focus:outline-none shadow-none">
              <DialogHeader className="sr-only">
                <DialogTitle>Tambah Arsip Surat</DialogTitle>
                <DialogDescription>Formulir pengisian data surat baru untuk pengarsipan digital.</DialogDescription>
              </DialogHeader>
              <LetterForm 
                onSubmit={handleAddLetter} 
                onCancel={() => setIsFormOpen(false)} 
                lastLetter={lastLetter}
                nextAgendaNumber={nextAgendaNumber}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Arsip Surat</h1>
          <p className="typography-muted">Monitor Dan Kelola Seluruh Dokumen Dinas Secara Efisien.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            label="Total Arsip Dokumen" 
            value={letters.length} 
            icon={<LayoutGrid className="h-5 w-5" />} 
          />
          <StatsCard 
            label="Surat Masuk" 
            value={letters.filter(l => l.type === 'Masuk').length} 
            icon={<ArrowDownLeft className="h-5 w-5 text-emerald-600" />} 
          />
          <StatsCard 
            label="Surat Keluar" 
            value={letters.filter(l => l.type === 'Keluar').length} 
            icon={<ArrowUpRight className="h-5 w-5 text-sky-600" />} 
          />
        </div>

        <div className="border border-slate-300 bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-300 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/20">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari Nomor Surat, Subjek, Atau Instansi..." 
                className="pl-10 bg-white border-slate-300 text-sm h-10 tracking-tight focus:ring-0 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-300 text-sm font-semibold h-10">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="border-slate-300 bg-white">
                  <SelectItem value="All">Semua Kategori</SelectItem>
                  <SelectItem value="Masuk">Surat Masuk</SelectItem>
                  <SelectItem value="Keluar">Surat Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative min-h-[480px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Memuat Data</p>
                  </div>
                </motion.div>
              ) : filteredLetters.length > 0 ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <LetterTable 
                    letters={filteredLetters} 
                    onDelete={handleDeleteLetter}
                    onUpdate={handleUpdateLetter}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center"
                >
                  <Mail className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Arsip Tidak Ditemukan</h3>
                  <p className="typography-muted">Silakan Sesuaikan Kata Kunci Atau Filter Pencarian Anda.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="border border-slate-300 bg-white p-6 flex items-center justify-between rounded-lg transition-all hover:border-slate-400 group">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none mb-2">{label}</p>
        <h4 className="text-2xl font-bold tracking-tight tabular-nums text-slate-900">{value}</h4>
      </div>
      <div className="h-12 w-12 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 bg-slate-50/30 group-hover:text-primary group-hover:border-slate-300 transition-colors">
        {icon}
      </div>
    </div>
  );
}
