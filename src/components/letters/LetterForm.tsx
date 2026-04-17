"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Letter, LetterType } from '@/lib/types';
import { 
  AlertCircle, 
} from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Field, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

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

  const onHandleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="flex flex-col h-full bg-white overflow-hidden">
        {/* SECTION 1: HEADER */}
        <div className="px-6 py-5 border-b border-slate-300 bg-white flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">Tambah Arsip Surat</h2>
            <p className="typography-muted">Kelola metadata surat untuk kearsipan digital.</p>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">No. Agenda</span>
              <span className="text-sm font-medium text-slate-800 tabular-nums tracking-tight">{nextAgendaNumber}</span>
            </div>

            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button 
                    type="button" 
                    className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus:outline-none ml-1"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  align="end" 
                  className="bg-white border border-slate-300 p-4 shadow-none w-64 rounded-md z-[100]"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-medium text-slate-400 border-b border-slate-100 pb-1 tracking-wider uppercase">Arsip Terakhir</p>
                    {lastLetter ? (
                      <div className="space-y-1.5 text-[11px] text-slate-600">
                        <div className="flex justify-between"><span>No. Agenda</span> <span className="font-medium">{lastLetter.id}</span></div>
                        <div className="flex justify-between gap-4"><span>No. Surat</span> <span className="font-medium text-right truncate">{lastLetter.refNumber}</span></div>
                        <div className="flex justify-between"><span>Tanggal</span> <span className="font-medium">{format(new Date(lastLetter.date), 'dd/MM/yyyy')}</span></div>
                        <div className="flex justify-between gap-4"><span>Penerima</span> <span className="font-medium text-right truncate">{lastLetter.recipient}</span></div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">Belum ada data sebelumnya.</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* SECTION 2: INPUT AREA */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="flex gap-10">
              {/* LEFT COLUMN: Administrative Data */}
              <div className="w-44 space-y-4 shrink-0">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="typography-p text-slate-800 text-[12px] mb-0.5">Jenis Surat</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 border-slate-300 bg-white font-normal text-xs tracking-tight">
                              <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-slate-300">
                            <SelectItem value="Masuk" className="text-xs">Surat Masuk</SelectItem>
                            <SelectItem value="Keluar" className="text-xs">Surat Keluar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px]" />
                      </Field>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="typography-p text-slate-800 text-[12px] mb-0.5">Tanggal Surat</FieldLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field} 
                            className="h-9 border-slate-300 bg-white text-xs tracking-tight" 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </Field>
                    </FormItem>
                  )}
                />
              </div>

              <Separator orientation="vertical" className="h-auto bg-slate-200" />

              {/* RIGHT COLUMN: Document Metadata */}
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="refNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="typography-p text-slate-800 text-[12px] mb-0.5">Nomor Surat</FieldLabel>
                        <FormControl>
                          <Input 
                            autoFocus
                            placeholder="Masukan nomor surat dinas..." 
                            {...field} 
                            className="h-9 border-slate-300 bg-white text-xs tracking-tight placeholder:text-slate-300" 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </Field>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="typography-p text-slate-800 text-[12px] mb-0.5">Perihal / Hal</FieldLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ringkasan perihal dokumen..." 
                            {...field} 
                            className="h-9 border-slate-300 bg-white text-xs tracking-tight placeholder:text-slate-300" 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </Field>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sender"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <Field>
                          <FieldLabel className="typography-p text-slate-800 text-[12px] mb-0.5">Pengirim</FieldLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama atau instansi" 
                              {...field} 
                              className="h-9 border-slate-300 bg-white text-xs tracking-tight placeholder:text-slate-300" 
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </Field>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <Field>
                          <FieldLabel className="typography-p text-slate-800 text-[12px] mb-0.5">Penerima</FieldLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama atau instansi" 
                              {...field} 
                              className="h-9 border-slate-300 bg-white text-xs tracking-tight placeholder:text-slate-300" 
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </Field>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* SECTION 3: FOOTER */}
        <div className="px-6 py-4 border-t border-slate-300 flex items-center justify-end gap-3 bg-slate-50/10 shrink-0">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel} 
            className="text-xs font-medium text-slate-500 hover:bg-slate-50 h-9 px-5"
          >
            Batalkan
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground text-xs font-medium h-9 px-6 rounded-md border border-primary hover:bg-primary/90 transition-all"
          >
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}