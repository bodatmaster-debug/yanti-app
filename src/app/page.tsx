"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Filter, 
  Mail, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  Menu
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

// Initial Mock Data
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
    // Simulate initial data load
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
    <div className="flex flex-col min-h-screen">
      {/* Top Header/Toolbar */}
      <header className="h-16 border-b-2 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="border-2 h-9 w-9">
              <Menu className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
          <h2 className="font-bold text-lg hidden md:block">Dashboard Arsip</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="border-2 border-primary/20 hover:border-primary font-medium hidden sm:flex"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                <Plus className="mr-2 h-4 w-4" />
                Arsip Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-2">
              <DialogHeader>
                <DialogTitle className="text-xl">Tambah Arsip Surat Baru</DialogTitle>
              </DialogHeader>
              <LetterForm onSubmit={handleAddLetter} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-primary">Manajemen Surat</h1>
          <p className="text-muted-foreground">Kelola semua arsip surat masuk dan keluar di satu tempat.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            label="Total Surat" 
            value={letters.length} 
            icon={<Mail className="h-5 w-5" />} 
            delay={0.1}
          />
          <StatsCard 
            label="Surat Masuk" 
            value={letters.filter(l => l.type === 'Masuk').length} 
            icon={<ArrowDownLeft className="h-5 w-5 text-green-600" />} 
            delay={0.2}
          />
          <StatsCard 
            label="Surat Keluar" 
            value={letters.filter(l => l.type === 'Keluar').length} 
            icon={<ArrowUpRight className="h-5 w-5 text-blue-600" />} 
            delay={0.3}
          />
        </div>

        <Card className="border-2 shadow-none bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b-2 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari subjek, nomor, pengirim..." 
                  className="pl-9 border-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                  <SelectTrigger className="w-full md:w-[150px] border-2">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Semua Tipe</SelectItem>
                    <SelectItem value="Masuk">Masuk</SelectItem>
                    <SelectItem value="Keluar">Keluar</SelectItem>
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
                    className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
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
                    className="py-20 text-center"
                  >
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Tidak ada surat ditemukan</h3>
                    <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter Anda.</p>
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

function StatsCard({ label, value, icon, delay }: { label: string, value: number, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className="border-2 shadow-none hover:border-primary transition-colors cursor-default bg-white">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border-2">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h4 className="text-2xl font-bold">{value}</h4>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
