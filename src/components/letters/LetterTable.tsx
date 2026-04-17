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
  DialogTitle 
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
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border">
              <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nomor Surat</TableHead>
              <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Jenis</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Perihal & Instansi</TableHead>
              <TableHead className="w-[150px] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tanggal</TableHead>
              <TableHead className="w-[80px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {letters.map((letter) => (
              <TableRow key={letter.id} className="group transition-colors hover:bg-muted/20 border-b border-border">
                <TableCell className="font-mono text-[11px] font-semibold text-muted-foreground">
                  {letter.refNumber}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider ${
                      letter.type === 'Masuk' 
                        ? 'border-emerald-500 text-emerald-700' 
                        : 'border-sky-500 text-sky-700'
                    }`}
                  >
                    {letter.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm line-clamp-1 text-slate-900">{letter.subject}</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">
                        {letter.type === 'Masuk' ? letter.sender : letter.recipient}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {format(new Date(letter.date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded border border-transparent hover:border-border">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] border border-border shadow-none rounded">
                      <DropdownMenuItem onClick={() => handleOpenDetail(letter)} className="font-medium text-xs">
                        <Eye className="mr-2 h-4 w-4" /> DETAIL ARSIP
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(letter)} className="font-medium text-xs">
                        <Edit className="mr-2 h-4 w-4" /> EDIT METADATA
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(letter.id)}
                        className="text-destructive focus:text-destructive font-bold text-xs"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> HAPUS PERMANEN
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
        <DialogContent className="max-w-3xl border-2 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-widest">Rincian Arsip Surat</DialogTitle>
          </DialogHeader>
          {selectedLetter && <LetterDetail letter={selectedLetter} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl border-2 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-widest">Ubah Informasi Surat</DialogTitle>
          </DialogHeader>
          {editingLetter && (
            <LetterForm 
              initialData={editingLetter} 
              onSubmit={handleUpdate} 
              onCancel={() => setIsEditOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}