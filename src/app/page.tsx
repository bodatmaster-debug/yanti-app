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
    id: '1',
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
    id: '2',
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

  const handleAddLetter = (data: Partial<Letter>) => {
    const newLetter: Letter = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Letter;
    setLetters(prev => [newLetter, ...prev]);
    setIsFormOpen(false);
    toast({
      title: "Berhasil",
      description: "Surat berhasil ditambahkan ke arsip.",
    });
  };

  const handleUpdateLetter = (id: string, data: Partial<Letter>) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l));
    toast({
      title: "Berhasil",
      description: "Data surat telah diperbarui.",
    });
  };

  const handleDeleteLetter = (id: string) => {
    setLetters(prev => prev.filter(l => l.id !== id));
    toast({
      title: "Terhapus",
      description: "Surat telah dihapus dari arsip.",
    });
  };

  const handleExport = async () => {
    try {
      await exportLettersToExcel(filteredLetters);
    } catch (err) {
      toast({
        title: "Gagal Export",
        description: "Terjadi kesalahan saat mengekspor data.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="h-6 w-px bg-border hidden md:block" />
          <h2 className="font-semibold text-xs tracking-wide text-muted-foreground hidden md:block">Manajemen Arsip</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex border-border"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Arsip Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-2 shadow-none">
              <DialogHeader>
                <DialogTitle>Tambah Arsip Surat</DialogTitle>
              </DialogHeader>
              <LetterForm onSubmit={handleAddLetter} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Daftar Surat</h1>
          <p className="text-sm text-muted-foreground">Monitor dan kelola seluruh dokumen surat dinas secara digital.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            label="Total Arsip" 
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

        <Card className="border border-border bg-white rounded-lg overflow-hidden shadow-none">
          <CardContent className="p-0">
            <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nomor atau subjek..." 
                  className="pl-9 bg-white border-border shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                  <SelectTrigger className="w-full md:w-[160px] bg-white border-border shadow-none">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Semua Tipe</SelectItem>
                    <SelectItem value="Masuk">Surat Masuk</SelectItem>
                    <SelectItem value="Keluar">Surat Keluar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                    className="py-24 text-center"
                  >
                    <Mail className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-sm font-medium">Data tidak ditemukan</h3>
                    <p className="text-xs text-muted-foreground">Silakan periksa kembali filter atau kata kunci Anda.</p>
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
    <Card className="border border-border bg-white shadow-none transition-colors hover:border-primary/50">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-muted-foreground tracking-wide">{label}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
        <div className="h-10 w-10 rounded border border-border flex items-center justify-center text-muted-foreground bg-white">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}