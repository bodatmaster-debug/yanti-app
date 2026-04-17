
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Archive,
  Loader2
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
import { Sheet } from '@/components/ui/sheet';
import { Letter, LetterType } from '@/lib/types';
import LetterTable from '@/components/letters/LetterTable';
import LetterForm from '@/components/letters/LetterForm';
import ExportSheet from '@/components/letters/ExportSheet';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from "@/components/ui/sidebar"

const INITIAL_LETTERS: Letter[] = [
  {
    id: '001',
    refNumber: '001/SU/XI/2023',
    sender: 'Dinas Pendidikan',
    recipient: 'Sekretariat Utama',
    subject: 'SU',
    date: '2023-11-20',
    type: 'Masuk',
    createdAt: '2023-11-21T08:00:00Z',
    updatedAt: '2023-11-21T08:00:00Z',
    fileName: 'surat_bantuan_dana.pdf'
  },
  {
    id: '002',
    refNumber: '001/SK/XII/2023',
    sender: 'Sekretariat Utama',
    recipient: 'Kementerian Keuangan',
    subject: 'SK',
    date: '2023-12-05',
    type: 'Keluar',
    createdAt: '2023-12-06T10:30:00Z',
    updatedAt: '2023-12-06T10:30:00Z',
    fileName: 'lpj_2023.pdf'
  }
];

export default function ArsipDigitalPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | LetterType>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
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
    const nextId = (letters.length + 1).toString().padStart(3, '0');
    const newLetter: Letter = {
      ...data,
      id: nextId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Letter;
    setLetters(prev => [newLetter, ...prev]);
    setIsFormOpen(false);
    toast({ title: "Berhasil", description: "Arsip baru telah ditambahkan." });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <header className="h-16 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors" />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
          <h2 className="text-[11px] font-medium text-slate-400 hidden md:block tracking-tight">Perpustakaan Digital</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setIsExportOpen(true)} className="hidden sm:flex h-9 text-xs font-medium">
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Ekspor Excel
          </Button>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground h-9 text-xs font-medium px-5">
                <Plus className="mr-2 h-4 w-4" /> Tambah Arsip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden max-h-[90vh]">
              <DialogHeader className="sr-only">
                <DialogTitle>Tambah Arsip</DialogTitle>
                <DialogDescription>Masukan metadata surat.</DialogDescription>
              </DialogHeader>
              <LetterForm 
                onSubmit={handleAddLetter} 
                onCancel={() => setIsFormOpen(false)} 
                nextAgendaNumber={(letters.length + 1).toString().padStart(3, '0')}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="space-y-1">
          <h1 className="typography-h1 font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Arsip Digital</h1>
          <p className="typography-muted text-sm font-medium">Koleksi lengkap seluruh dokumen surat masuk, keluar, dan berita acara.</p>
        </div>

        <div className="border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-300 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/10">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari semua arsip..." 
                className="pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-sm h-10 tracking-tight"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-sm font-medium h-10">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none">
                  <SelectItem value="All">Semua Kategori</SelectItem>
                  <SelectItem value="Masuk">Surat Masuk</SelectItem>
                  <SelectItem value="Keluar">Surat Keluar</SelectItem>
                  <SelectItem value="Berita acara">Berita Acara</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative min-h-[480px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
                </motion.div>
              ) : filteredLetters.length > 0 ? (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <LetterTable 
                    letters={filteredLetters} 
                    onDelete={() => {}}
                    onUpdate={() => {}}
                  />
                </motion.div>
              ) : (
                <div className="py-32 text-center">
                  <Archive className="h-10 w-10 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                  <h3 className="typography-h3 text-slate-900 dark:text-slate-100 font-medium">Data tidak ditemukan</h3>
                  <p className="typography-muted font-medium">Sesuaikan filter atau kata kunci pencarian Anda.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Sheet open={isExportOpen} onOpenChange={setIsExportOpen}>
        <ExportSheet 
          letters={letters} 
          onClose={() => setIsExportOpen(false)} 
        />
      </Sheet>
    </div>
  );
}
