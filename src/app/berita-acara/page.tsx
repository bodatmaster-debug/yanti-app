
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ClipboardList, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Letter } from '@/lib/types';
import LetterTable from '@/components/letters/LetterTable';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { motion } from 'framer-motion';

export default function BeritaAcaraPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetters([]);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredLetters = useMemo(() => {
    return letters.filter(l => 
      l.type === 'Berita acara' && (
        l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.refNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [letters, searchTerm]);

  return (
    <div className="flex flex-col min-h-full">
      <header className="h-16 border-b border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors" />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
          <h2 className="text-[11px] font-medium text-slate-400 hidden md:block tracking-tight">Koleksi Berita Acara</h2>
        </div>
      </header>

      <motion.div 
        className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-1">
          <h1 className="typography-h1 font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-amber-600">Berita Acara</h1>
          <p className="typography-muted text-sm font-medium">Pengarsipan khusus dokumen berita acara aset dan inventaris.</p>
        </div>

        <div className="border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-300 dark:border-slate-800 bg-slate-50/10">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari berita acara..." 
                className="pl-10 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-sm h-10 tracking-tight"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
              </div>
            ) : filteredLetters.length > 0 ? (
              <LetterTable 
                letters={filteredLetters} 
                onDelete={() => {}}
                onUpdate={() => {}}
              />
            ) : (
              <div className="py-24 text-center">
                <ClipboardList className="h-10 w-10 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                <h3 className="typography-h3 text-slate-900 dark:text-slate-100 font-medium text-sm">Tidak ada berita acara</h3>
                <p className="typography-muted font-medium text-xs">Dokumen berita acara akan tampil di sini.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
