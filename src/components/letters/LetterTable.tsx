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
import { MoreVertical, Eye, Edit, Trash2, Calendar, User, FileText } from 'lucide-react';
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
            <TableRow>
              <TableHead className="w-[200px] text-xs font-bold uppercase tracking-wider">Nomor Surat</TableHead>
              <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider">Jenis</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Perihal & Instansi</TableHead>
              <TableHead className="w-[150px] text-xs font-bold uppercase tracking-wider">Tanggal</TableHead>
              <TableHead className="w-[80px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {letters.map((letter) => (
              <TableRow key={letter.id} className="group transition-colors hover:bg-slate-50/80">
                <TableCell className="font-mono text-[11px] font-medium text-muted-foreground">
                  {letter.refNumber}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded-md ${
                      letter.type === 'Masuk' 
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50' 
                        : 'border-sky-200 text-sky-700 bg-sky-50/50'
                    }`}
                  >
                    {letter.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm line-clamp-1 text-slate-900">{letter.subject}</span>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">
                        {letter.type === 'Masuk' ? letter.sender : letter.recipient}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {format(new Date(letter.date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem onClick={() => handleOpenDetail(letter)}>
                        <Eye className="mr-2 h-4 w-4" /> Detail Arsip
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(letter)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(letter.id)}
                        className="text-destructive focus:text-destructive"
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Rincian Arsip Surat</DialogTitle>
          </DialogHeader>
          {selectedLetter && <LetterDetail letter={selectedLetter} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ubah Informasi Surat</DialogTitle>
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