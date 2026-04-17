
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
import { MoreVertical, Eye, Edit, Trash2, Calendar, User, ArrowRightLeft } from 'lucide-react';
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
          <TableHeader className="bg-muted/50 border-b-2">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px] font-bold">Nomor Surat</TableHead>
              <TableHead className="w-[100px] font-bold">Jenis</TableHead>
              <TableHead className="font-bold">Info Surat</TableHead>
              <TableHead className="w-[150px] font-bold">Tanggal</TableHead>
              <TableHead className="w-[80px] text-right font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {letters.map((letter) => (
              <TableRow key={letter.id} className="group hover:bg-accent/5">
                <TableCell className="font-mono text-xs font-semibold">
                  {letter.refNumber}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`border-2 ${
                      letter.type === 'Masuk' 
                        ? 'border-green-600 text-green-700 bg-green-50' 
                        : 'border-blue-600 text-blue-700 bg-blue-50'
                    }`}
                  >
                    {letter.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm line-clamp-1">{letter.subject}</span>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">
                        {letter.type === 'Masuk' ? `Dari: ${letter.sender}` : `Ke: ${letter.recipient}`}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {format(new Date(letter.date), 'dd MMM yyyy', { locale: id })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] border-2">
                      <DropdownMenuItem onClick={() => handleOpenDetail(letter)}>
                        <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(letter)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-t-2" />
                      <DropdownMenuItem 
                        onClick={() => onDelete(letter.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Arsip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl border-2">
          <DialogHeader>
            <DialogTitle>Detail Arsip Surat</DialogTitle>
          </DialogHeader>
          {selectedLetter && <LetterDetail letter={selectedLetter} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl border-2">
          <DialogHeader>
            <DialogTitle>Edit Metadata Surat</DialogTitle>
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
