
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  LayoutGrid,
  ClipboardList,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Letter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { NeuralBackground } from '@/components/layout/NeuralBackground';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetters(INITIAL_LETTERS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const countsByType = useMemo(() => {
    return {
      Masuk: letters.filter(l => l.type === 'Masuk').length,
      Keluar: letters.filter(l => l.type === 'Keluar').length,
      'Berita acara': letters.filter(l => l.type === 'Berita acara').length,
    };
  }, [letters]);

  const recentLetters = useMemo(() => letters.slice(0, 5), [letters]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
      <NeuralBackground />
      
      <header className="h-16 border-b border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors" />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
          <h2 className="text-[11px] font-medium text-slate-400 hidden md:block tracking-tight">Dashboard Ringkasan</h2>
        </div>
      </header>

      <motion.div 
        className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="space-y-1" variants={itemVariants}>
          <h1 className="typography-h1 font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Halo, Yanti!</h1>
          <p className="typography-muted text-sm font-medium">Berikut adalah ringkasan aktivitas kearsipan digital Anda hari ini.</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
          <StatsCard 
            label="Total Dokumen" 
            value={letters.length} 
            icon={<LayoutGrid className="h-5 w-5" />} 
          />
          <StatsCard 
            label="Surat Masuk" 
            value={countsByType.Masuk} 
            icon={<ArrowDownLeft className="h-5 w-5 text-emerald-600" />} 
          />
          <StatsCard 
            label="Surat Keluar" 
            value={countsByType.Keluar} 
            icon={<ArrowUpRight className="h-5 w-5 text-sky-600" />} 
          />
          <StatsCard 
            label="Berita Acara" 
            value={countsByType['Berita acara']} 
            icon={<ClipboardList className="h-5 w-5 text-amber-600" />} 
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-2 space-y-4" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Aktivitas Terakhir
              </h3>
              <Button variant="link" asChild className="text-xs h-auto p-0 font-medium text-slate-400">
                <Link href="/arsip-digital">Lihat Semua <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            
            <div className="border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
              {isLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
                </div>
              ) : recentLetters.length > 0 ? (
                recentLetters.map((l) => (
                  <motion.div 
                    key={l.id} 
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{l.subject}</span>
                      <span className="text-[11px] font-mono text-slate-400">{l.refNumber}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        l.type === 'Masuk' ? 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 
                        l.type === 'Keluar' ? 'border-sky-200 text-sky-600 bg-sky-50 dark:bg-sky-950/20' : 
                        'border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-950/20'
                      }`}>
                        {l.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{format(new Date(l.date), 'dd MMM yyyy', { locale: id })}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">Belum ada aktivitas.</div>
              )}
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bantuan & Tip</h3>
            <div className="p-5 border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg space-y-4 shadow-sm">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Ekspor Laporan</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Gunakan menu Arsip Digital untuk mengekspor data ke Excel guna keperluan administrasi bulanan.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Penomoran Otomatis</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Sistem akan otomatis mengatur nomor surat untuk Surat Keluar dan Berita Acara berdasarkan kategori (Hal) yang dipilih.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex items-center justify-between rounded-lg hover:border-slate-400 dark:hover:border-slate-700 transition-colors shadow-sm"
    >
      <div className="space-y-1">
        <p className="text-[11px] font-medium text-slate-400 mb-1">{label}</p>
        <h4 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-slate-100">{value}</h4>
      </div>
      <div className="h-12 w-12 rounded border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
        {icon}
      </div>
    </motion.div>
  );
}
