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
  Hash, 
  Calendar as CalendarIconLucide,
} from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
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
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="flex flex-col h-full bg-white">
        {/* SECTION 1: HEADER */}
        <div className="px-6 py-5 border-b border-slate-300 bg-white flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Tambah Arsip Surat</h2>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Lengkapi Metadata Surat Untuk Kearsipan Digital.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-300" />
              <div className="flex flex-col leading-none">
                <p className="text-[9px] text-slate-400 font-medium">No. Agenda</p>
                <p className="text-sm font-medium text-slate-900 tabular-nums">{nextAgendaNumber}</p>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button 
                    type="button" 
                    className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  align="end" 
                  className="bg-white border border-slate-300 p-4 shadow-none w-72 rounded-md z-[100]"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 border-b border-slate-200 pb-1 tracking-widest uppercase">Arsip Terakhir</p>
                    {lastLetter ? (
                      <div className="space-y-1.5 text-[11px] text-slate-600">
                        <div className="flex justify-between"><span>No. Agenda</span> <span className="font-semibold">{lastLetter.id}</span></div>
                        <div className="flex justify-between"><span>No. Surat</span> <span className="font-semibold text-right max-w-[120px] truncate">{lastLetter.refNumber}</span></div>
                        <div className="flex justify-between"><span>Tanggal</span> <span className="font-semibold">{format(new Date(lastLetter.date), 'dd/MM/yyyy')}</span></div>
                        <div className="flex justify-between gap-4"><span>Perihal</span> <span className="font-semibold text-right truncate flex-1">{lastLetter.subject}</span></div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">Belum Ada Data.</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* SECTION 2: INPUT AREA */}
        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-6">
            <div className="flex gap-8">
              {/* LEFT COLUMN */}
              <div className="w-48 space-y-5">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="text-slate-800 font-medium text-[12px] tracking-tight mb-1">Jenis Surat</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 border-slate-300 bg-white font-medium text-xs tracking-tight">
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
                        <FieldLabel className="text-slate-800 font-medium text-[12px] tracking-tight mb-1">Tanggal Surat</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-9 w-full pl-3 text-left font-medium border-slate-300 bg-white text-xs tracking-tight",
                                  !field.value && "text-slate-400"
                                )}
                              >
                                {field.value ? format(new Date(field.value), "dd MMM yyyy") : <span>Pilih Tanggal</span>}
                                <CalendarIconLucide className="ml-auto h-3.5 w-3.5 text-slate-400" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border-slate-300 z-[100]" align="start">
                            <Calendar
                              mode="single"
                              selected={new Date(field.value)}
                              onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-[10px]" />
                      </Field>
                    </FormItem>
                  )}
                />
              </div>

              <Separator orientation="vertical" className="h-auto bg-slate-200" />

              {/* RIGHT COLUMN */}
              <div className="flex-1 space-y-5">
                <FormField
                  control={form.control}
                  name="refNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="text-slate-800 font-medium text-[12px] tracking-tight mb-1">Nomor Surat</FieldLabel>
                        <FormControl>
                          <Input 
                            autoFocus
                            placeholder="Contoh: 400/12/SK/2023" 
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
                        <FieldLabel className="text-slate-800 font-medium text-[12px] tracking-tight mb-1">Perihal / Hal</FieldLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ringkasan Perihal Dokumen..." 
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
                          <FieldLabel className="text-slate-800 font-medium text-[12px] tracking-tight mb-1">Pengirim</FieldLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama Atau Instansi" 
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
                          <FieldLabel className="text-slate-800 font-medium text-[12px] tracking-tight mb-1">Penerima</FieldLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama Atau Instansi" 
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
        <div className="px-6 py-4 border-t border-slate-300 flex items-center justify-end gap-3 bg-slate-50/20">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel} 
            className="text-xs font-semibold text-slate-500 hover:bg-slate-100 h-9 px-5 transition-colors"
          >
            Batalkan
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground text-xs font-bold h-9 px-6 rounded-md border border-primary shadow-none hover:bg-primary/90 transition-all"
          >
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}
