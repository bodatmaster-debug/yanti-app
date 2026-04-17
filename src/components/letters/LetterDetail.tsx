
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
            className={`border-2 mb-2 ${
              letter.type === 'Masuk' 
                ? 'border-green-600 text-green-700 bg-green-50' 
                : 'border-blue-600 text-blue-700 bg-blue-50'
            }`}
          >
            {letter.type === 'Masuk' ? <ArrowDownLeft className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
            Surat {letter.type}
          </Badge>
          <h2 className="text-2xl font-bold leading-tight">{letter.subject}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <DetailItem 
            icon={<Hash className="h-4 w-4" />} 
            label="Nomor Surat" 
            value={letter.refNumber} 
          />
          <DetailItem 
            icon={<Calendar className="h-4 w-4" />} 
            label="Tanggal Surat" 
            value={format(new Date(letter.date), 'dd MMMM yyyy', { locale: id })} 
          />
          <Separator />
          <DetailItem 
            icon={<User className="h-4 w-4" />} 
            label="Pengirim" 
            value={letter.sender} 
          />
          <DetailItem 
            icon={<User className="h-4 w-4" />} 
            label="Penerima" 
            value={letter.recipient} 
          />
          <Separator />
          <DetailItem 
            icon={<Clock className="h-4 w-4" />} 
            label="Diarsipkan pada" 
            value={format(new Date(letter.createdAt), 'dd/MM/yyyy HH:mm')} 
          />
        </div>

        {letter.fileName && (
          <div className="pt-4">
            <Button variant="outline" className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors">
              <Download className="mr-2 h-4 w-4" /> Unduh Dokumen ({letter.fileName})
            </Button>
          </div>
        )}
      </div>

      {/* Right Column: Integrated Preview (Simulation) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pratinjau Dokumen</h3>
        <div className="aspect-[3/4] border-2 rounded-lg bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden group">
          {letter.fileName ? (
            <div className="p-8 text-center">
              <div className="w-20 h-24 bg-white border-2 border-primary/20 rounded shadow-none mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-10 w-10 text-accent" />
              </div>
              <p className="font-bold text-sm mb-1">{letter.fileName}</p>
              <p className="text-xs text-muted-foreground">Digital Preview terintegrasi memerlukan library viewer PDF.</p>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Tidak ada lampiran dokumen untuk surat ini.</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded bg-muted border border-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
