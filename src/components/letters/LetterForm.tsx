"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from "@/components/ui/separator"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Letter, LetterType } from '@/lib/types';
import { 
  CalendarIcon, 
  Upload, 
  AlertCircle, 
  Hash, 
  User, 
  FileText, 
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from '@/components/ui/item';

const formSchema = z.object({
  refNumber: z.string().min(1, 'Nomor Surat Wajib Diisi'),
  sender: z.string().min(1, 'Pengirim Wajib Diisi'),
  recipient: z.string().min(1, 'Penerima Wajib Diisi'),
  subject: z.string().min(5, 'Subjek Minimal 5 Karakter'),
  date: z.string().min(1, 'Pilih Tanggal Surat'),
  type: z.enum(['Masuk', 'Keluar'] as const),
});

interface LetterFormProps {
  initialData?: Letter;
  lastLetter?: Letter;
  nextAgendaNumber?: string;
  onSubmit: (data: Partial<Letter>) => void;
  onCancel: () => void;
}

export default function LetterForm({ 
  initialData, 
  lastLetter, 
  nextAgendaNumber = "001",
  onSubmit, 
  onCancel 
}: LetterFormProps) {
  const [fileName, setFileName] = useState<string | undefined>(initialData?.fileName);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refNumber: initialData?.refNumber || '',
      sender: initialData?.sender || '',
      recipient: initialData?.recipient || '',
      subject: initialData?.subject || '',
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      type: (initialData?.type as LetterType) || 'Masuk',
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const onHandleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      fileName,
      fileUrl: fileName ? 'dummy_url' : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Item variant="outline" size="sm" className="flex-1 bg-slate-50/30 border-slate-100 rounded-sm py-2">
            <ItemMedia variant="icon" className="bg-white text-slate-400 border-slate-100 size-7">
              <Hash className="h-3 w-3" />
            </ItemMedia>
            <ItemContent className="gap-0">
              <ItemTitle className="text-[10px] text-slate-400 font-medium tracking-wide">Nomor Agenda Berikutnya</ItemTitle>
              <ItemDescription className="text-sm font-bold text-slate-800 tracking-tight leading-none">
                {nextAgendaNumber}
              </ItemDescription>
            </ItemContent>
          </Item>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-100 text-slate-300 hover:text-primary shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-white border-slate-100 p-3 shadow-none w-72">
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wider border-b border-slate-50 pb-1">Detail Arsip Terakhir</p>
                  {lastLetter ? (
                    <div className="space-y-1.5 text-xs font-medium text-slate-600">
                      <div className="flex justify-between"><span>No. Agenda:</span> <span className="font-mono text-slate-900">{lastLetter.id}</span></div>
                      <div className="flex justify-between"><span>No. Surat:</span> <span className="font-mono text-slate-900">{lastLetter.refNumber}</span></div>
                      <div className="flex justify-between"><span>Tanggal:</span> <span className="text-slate-900">{lastLetter.date}</span></div>
                      <div className="flex justify-between"><span>Perihal:</span> <span className="truncate max-w-[140px] text-slate-900">{lastLetter.subject}</span></div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Belum Ada Data Sebelumnya.</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator className="bg-slate-50" />

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-medium text-slate-400 tracking-wide">Jenis Surat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 bg-white border-slate-100 text-sm tracking-wide">
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-slate-100">
                      <SelectItem value="Masuk">Surat Masuk</SelectItem>
                      <SelectItem value="Keluar">Surat Keluar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[11px] font-medium text-slate-400 tracking-wide mb-2">Tanggal Surat</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-9 w-full pl-3 text-left font-normal bg-white border-slate-100 text-sm tracking-wide",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), "dd MMM yyyy") : <span>Pilih Tanggal</span>}
                          <CalendarIcon className="ml-auto h-3.5 w-3.5 opacity-30" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-slate-100" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="refNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-medium text-slate-400 tracking-wide">Nomor Surat</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                    <Input placeholder="Ketik Nomor Surat..." {...field} className="pl-9 h-9 bg-white border-slate-100 text-sm tracking-wide" />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-medium text-slate-400 tracking-wide">Perihal</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                    <Input placeholder="Ringkasan Isi Surat..." {...field} className="pl-9 h-9 bg-white border-slate-100 text-sm tracking-wide" />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-medium text-slate-400 tracking-wide">Pengirim</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                      <Input placeholder="Nama / Instansi" {...field} className="pl-9 h-9 bg-white border-slate-100 text-sm tracking-wide" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-medium text-slate-400 tracking-wide">Penerima</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                      <Input placeholder="Nama / Instansi" {...field} className="pl-9 h-9 bg-white border-slate-100 text-sm tracking-wide" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-slate-400 tracking-wide">Unggah Digital Scan</p>
            <div 
              className={cn(
                "border border-dashed rounded-sm p-3 flex flex-col items-center justify-center transition-all bg-white cursor-pointer hover:bg-slate-50",
                fileName ? "border-emerald-200 bg-emerald-50/20" : "border-slate-100"
              )} 
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {fileName ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-white p-1 rounded-sm border border-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-700 truncate">{fileName}</p>
                    <p className="text-[9px] text-slate-400 font-medium tracking-wide">Klik Untuk Mengganti</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-slate-200" />
                  <p className="text-[11px] font-medium text-slate-400 tracking-wide">Pilih File Digital (Maks. 5MB)</p>
                </div>
              )}
              <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-xs font-medium text-slate-400 hover:text-slate-600">
            Batal
          </Button>
          <Button type="submit" size="sm" className="min-w-[100px] bg-primary text-primary-foreground text-xs font-semibold tracking-wide h-9">
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}