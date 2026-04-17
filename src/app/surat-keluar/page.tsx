
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Letter } from '@/lib/types';
import LetterTable from '@/components/letters/LetterTable';
import { SidebarTrigger } from "@/components/ui/sidebar"

const INITIAL_LETTERS: Letter[] = [
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

export default function SuratKeluarPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetters(INITIAL_LETTERS);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredLetters = useMemo(() => {
    return letters.filter(l => 
      l.type === 'Keluar' && (
        l.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [letters, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <header className="h-16 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors" />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
          <h2 className="text-[11px] font-medium text-slate-400 hidden md:block tracking-tight">Koleksi Surat Keluar</h2>
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="space-y-1">
          <h1 className="typography-h1 font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-sky-600">Surat Keluar</h1>
          <p className="typography-muted text-sm font-medium">Daftar seluruh dokumen dinas yang dikeluarkan oleh instansi.</p>
        </div>

        <div className="border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-300 dark:border-slate-800 bg-slate-50/10">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari surat keluar..." 
                className="pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-sm h-10 tracking-tight"
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
                <Send className="h-10 w-10 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                <h3 className="typography-h3 text-slate-900 dark:text-slate-100 font-medium text-sm">Tidak ada surat keluar</h3>
                <p className="typography-muted font-medium text-xs">Semua surat keluar akan tampil di sini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
