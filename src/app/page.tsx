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
import { Card, CardContent } from '@/components/ui/card';
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

  // Logic Penomoran Agenda Otomatis
  const nextAgendaNumber = useMemo(() => {
    const lastId = letters.length > 0 ? parseInt(letters[0].id) : 0;
    return (lastId + 1).toString().padStart(3, '0');
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
      <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-slate-600 hover:bg-slate-50 transition-colors" />
          <div className="h-6 w-px bg-border hidden md:block" />
          <h2 className="text-sm font-semibold text-slate-500 hidden md:block tracking-tight">Manajemen Arsip Digital</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex border-border h-9 text-xs font-bold tracking-tight hover:bg-slate-50"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
            Export Excel
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground h-9 text-xs font-bold tracking-tight px-4">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Arsip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl border border-border bg-white p-0 overflow-hidden">
              <div className="p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Tambah Arsip Surat</DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium">Lengkapi Metadata Surat Untuk Kearsipan Yang Lebih Baik.</DialogDescription>
                </DialogHeader>
                <LetterForm 
                  onSubmit={handleAddLetter} 
                  onCancel={() => setIsFormOpen(false)} 
                  lastLetter={lastLetter}
                  nextAgendaNumber={nextAgendaNumber}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daftar Arsip Surat</h1>
          <p className="text-sm text-slate-500 font-medium leading-normal">Monitor Dan Kelola Seluruh Dokumen Dinas Secara Efisien Dalam Satu Dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            label="Total Arsip Dokumen" 
            value={letters.length} 
            icon={<LayoutGrid className="h-4 w-4" />} 
          />
          <StatsCard 
            label="Surat Masuk" 
            value={letters.filter(l => l.type === 'Masuk').length} 
            icon={<ArrowDownLeft className="h-4 w-4 text-emerald-600" />} 
          />
          <StatsCard 
            label="Surat Keluar" 
            value={letters.filter(l => l.type === 'Keluar').length} 
            icon={<ArrowUpRight className="h-4 w-4 text-sky-600" />} 
          />
        </div>

        <Card className="border border-border bg-white rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Cari Nomor Surat, Subjek, Atau Instansi..." 
                  className="pl-10 bg-white border-border text-sm h-10 focus:ring-1 focus:ring-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white border-border text-sm font-bold h-10">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent className="border border-border bg-white shadow-none">
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
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Memuat Data...</p>
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
                    <Mail className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Arsip Tidak Ditemukan</h3>
                    <p className="text-sm text-slate-400 font-medium">Silakan Sesuaikan Kata Kunci Atau Filter Pencarian Anda.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="border border-border bg-white transition-all hover:border-slate-400 group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 tracking-tight leading-none mb-2">{label}</p>
          <h4 className="text-3xl font-bold tracking-tight tabular-nums text-slate-900">{value}</h4>
        </div>
        <div className="h-12 w-12 rounded-lg border border-border flex items-center justify-center text-slate-400 bg-white group-hover:text-primary group-hover:border-primary/50 transition-colors">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}