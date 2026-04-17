"use client"

import React from 'react';
import { Letter } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Hash, 
  User, 
  ArrowDownLeft, 
  ArrowUpRight,
  Download,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LetterDetailProps {
  letter: Letter;
}

export default function LetterDetail({ letter }: LetterDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
      {/* Left Column: Metadata */}
      <div className="space-y-6">
        <div>
          <Badge 
            variant="outline" 
            className={`border-[1.5px] mb-2 font-bold text-[10px] tracking-wider ${
              letter.type === 'Masuk' 
                ? 'border-emerald-500 text-emerald-700' 
                : 'border-sky-500 text-sky-700'
            }`}
          >
            {letter.type === 'Masuk' ? <ArrowDownLeft className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
            SURAT {letter.type.toUpperCase()}
          </Badge>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900">{letter.subject}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <DetailItem 
            icon={<Hash className="h-3.5 w-3.5" />} 
            label="Nomor Surat" 
            value={letter.refNumber} 
          />
          <DetailItem 
            icon={<Calendar className="h-3.5 w-3.5" />} 
            label="Tanggal Surat" 
            value={format(new Date(letter.date), 'dd MMMM yyyy', { locale: id })} 
          />
          <Separator className="bg-border" />
          <DetailItem 
            icon={<User className="h-3.5 w-3.5" />} 
            label="Pengirim" 
            value={letter.sender} 
          />
          <DetailItem 
            icon={<User className="h-3.5 w-3.5" />} 
            label="Penerima" 
            value={letter.recipient} 
          />
          <Separator className="bg-border" />
          <DetailItem 
            icon={<Clock className="h-3.5 w-3.5" />} 
            label="Diarsipkan pada" 
            value={format(new Date(letter.createdAt), 'dd/MM/yyyy HH:mm')} 
          />
        </div>

        {letter.fileName && (
          <div className="pt-4">
            <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-bold text-xs tracking-widest">
              <Download className="mr-2 h-4 w-4" /> UNDUH DOKUMEN
            </Button>
          </div>
        )}
      </div>

      {/* Right Column: Integrated Preview (Simulation) */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pratinjau Dokumen</h3>
        <div className="aspect-[3/4] border border-border rounded bg-white flex flex-col items-center justify-center relative overflow-hidden group">
          {letter.fileName ? (
            <div className="p-8 text-center">
              <div className="w-16 h-20 bg-white border border-border rounded mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="font-bold text-xs mb-1 uppercase tracking-tight">{letter.fileName}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Digital Preview terintegrasi</p>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-4 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Tidak ada lampiran</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded border border-border bg-white">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="font-bold text-xs tracking-tight">{value}</p>
      </div>
    </div>
  );
}