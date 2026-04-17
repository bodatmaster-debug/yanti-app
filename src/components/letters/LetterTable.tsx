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
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-border">
              <TableHead className="w-[200px] text-xs font-semibold tracking-tight text-muted-foreground py-4">Nomor Surat</TableHead>
              <TableHead className="w-[120px] text-xs font-semibold tracking-tight text-muted-foreground py-4">Jenis</TableHead>
              <TableHead className="text-xs font-semibold tracking-tight text-muted-foreground py-4">Perihal & Entitas</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold tracking-tight text-muted-foreground py-4">Tanggal</TableHead>
              <TableHead className="w-[80px] text-right py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {letters.map((letter) => (
              <TableRow key={letter.id} className="group transition-colors hover:bg-slate-50/50 border-b border-border">
                <TableCell className="font-mono text-[11px] font-medium text-slate-500">
                  {letter.refNumber}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`font-bold text-[10px] px-2.5 py-0.5 rounded-sm tracking-tight shadow-none ${
                      letter.type === 'Masuk' 
                        ? 'border-emerald-200 bg-emerald-50/30 text-emerald-700' 
                        : 'border-sky-200 bg-sky-50/30 text-sky-700'
                    }`}
                  >
                    Surat {letter.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm line-clamp-1 text-slate-900 tracking-tight">{letter.subject}</span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[240px]">
                        {letter.type === 'Masuk' ? letter.sender : letter.recipient}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {format(new Date(letter.date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded border border-transparent hover:border-border transition-all">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] border border-border rounded bg-white p-1 shadow-none">
                      <DropdownMenuItem onClick={() => handleOpenDetail(letter)} className="text-xs font-medium focus:bg-slate-50 cursor-pointer py-2">
                        <Eye className="mr-2 h-4 w-4" /> Detail Arsip
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(letter)} className="text-xs font-medium focus:bg-slate-50 cursor-pointer py-2">
                        <Edit className="mr-2 h-4 w-4" /> Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border mx-1 my-1 shadow-none" />
                      <DropdownMenuItem 
                        onClick={() => onDelete(letter.id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/5 text-xs font-bold cursor-pointer py-2"
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
        <DialogContent className="max-w-3xl border border-border rounded-lg bg-white shadow-none focus:outline-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Rincian Arsip Surat</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Informasi lengkap mengenai dokumen yang diarsipkan.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedLetter && <LetterDetail letter={selectedLetter} />}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl border border-border rounded-lg bg-white shadow-none focus:outline-none overflow-hidden">
          <DialogHeader className="p-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Ubah Informasi Surat</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Sesuaikan metadata surat untuk akurasi data pengarsipan.</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {editingLetter && (
              <LetterForm 
                initialData={editingLetter} 
                onSubmit={handleUpdate} 
                onCancel={() => setIsEditOpen(false)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
