"use client"

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Letter } from '@/lib/types';
import { MoreVertical, Eye, Edit, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import LetterForm from './LetterForm';
import LetterDetail from './LetterDetail';

interface LetterTableProps {
  letters: Letter[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Letter>) => void;
}

export default function LetterTable({ letters, onDelete, onUpdate }: LetterTableProps) {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenDetail = (letter: Letter) => {
    setSelectedLetter(letter);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (letter: Letter) => {
    setEditingLetter(letter);
    setIsEditOpen(true);
  };

  const handleUpdate = (data: Partial<Letter>) => {
    if (editingLetter) {
      onUpdate(editingLetter.id, data);
      setIsEditOpen(false);
      setEditingLetter(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow className="border-b border-slate-300 dark:border-slate-800">
              <TableHead className="w-[200px] text-xs font-medium tracking-tight text-slate-500 dark:text-slate-400 py-4">Nomor Surat</TableHead>
              <TableHead className="w-[120px] text-xs font-medium tracking-tight text-slate-500 dark:text-slate-400 py-4">Jenis</TableHead>
              <TableHead className="text-xs font-medium tracking-tight text-slate-500 dark:text-slate-400 py-4">Perihal & Entitas</TableHead>
              <TableHead className="w-[160px] text-xs font-medium tracking-tight text-slate-500 dark:text-slate-400 py-4">Tanggal</TableHead>
              <TableHead className="w-[80px] text-right py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {letters.map((letter) => (
              <TableRow key={letter.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-b border-slate-300 dark:border-slate-800">
                <TableCell className="font-mono text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {letter.refNumber}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`font-medium text-[10px] px-2.5 py-0.5 rounded-sm tracking-tight shadow-none ${
                      letter.type === 'Masuk' 
                        ? 'border-emerald-200 bg-emerald-50/30 text-emerald-700 dark:text-emerald-400 dark:border-emerald-900/50 dark:bg-emerald-950/20' 
                        : letter.type === 'Keluar'
                        ? 'border-sky-200 bg-sky-50/30 text-sky-700 dark:text-sky-400 dark:border-sky-900/50 dark:bg-sky-950/20'
                        : 'border-amber-200 bg-amber-50/30 text-amber-700 dark:text-amber-400 dark:border-amber-900/50 dark:bg-amber-950/20'
                    }`}
                  >
                    {letter.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm line-clamp-1 text-slate-900 dark:text-slate-100 tracking-tight">{letter.subject}</span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[240px]">
                        {letter.type === 'Masuk' ? letter.sender : letter.recipient}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
                    {format(new Date(letter.date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] border border-slate-300 dark:border-slate-800 rounded bg-white dark:bg-slate-950 p-1 shadow-none">
                      <DropdownMenuItem onClick={() => handleOpenDetail(letter)} className="text-xs font-medium focus:bg-slate-50 dark:focus:bg-slate-900 cursor-pointer py-2 text-slate-900 dark:text-slate-100">
                        <Eye className="mr-2 h-4 w-4 text-slate-400" /> Detail Arsip
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(letter)} className="text-xs font-medium focus:bg-slate-50 dark:focus:bg-slate-900 cursor-pointer py-2 text-slate-900 dark:text-slate-100">
                        <Edit className="mr-2 h-4 w-4 text-slate-400" /> Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-1 shadow-none" />
                      <DropdownMenuItem 
                        onClick={() => onDelete(letter.id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/5 text-xs font-medium cursor-pointer py-2"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl border border-slate-300 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 shadow-none focus:outline-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100">Rincian Arsip Surat</DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Informasi lengkap mengenai dokumen yang diarsipkan.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedLetter && <LetterDetail letter={selectedLetter} />}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl border border-slate-300 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 shadow-none focus:outline-none overflow-hidden p-0">
          <LetterForm 
            initialData={editingLetter || undefined} 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}