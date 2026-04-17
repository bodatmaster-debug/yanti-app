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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Letter, LetterType } from '@/lib/types';
import { 
  AlertCircle, 
  CalendarIcon
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Field, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
        {/* SECTION 1: HEADER - Title Case, Thin Font, No Frame */}
        <div className="px-6 py-5 border-b border-slate-300 bg-white flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 leading-none">Tambah Arsip Surat</h2>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Kelola metadata surat untuk kearsipan digital.</p>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-end pr-1">
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">No. Agenda</span>
              <span className="text-sm font-medium text-slate-800 tabular-nums tracking-tight">{nextAgendaNumber}</span>
            </div>

            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button 
                    type="button" 
                    className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
                    onFocus={(e) => e.target.blur()} // Anti auto-show saat dialog buka
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-semibold border-b border-slate-600 pb-1 mb-1">Arsip Terakhir</p>
                    {lastLetter ? (
                      <div className="space-y-1 text-[10px]">
                        <p>No. Agenda: {lastLetter.id}</p>
                        <p>No. Surat: {lastLetter.refNumber}</p>
                        <p>Tanggal: {format(new Date(lastLetter.date), 'dd/MM/yyyy')}</p>
                      </div>
                    ) : (
                      <p className="text-[10px] italic">Belum Ada Data Sebelumnya</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* SECTION 2: INPUT AREA - 2 Column Layout with Vertical Separator */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="flex gap-8">
              {/* LEFT COLUMN: Admin Data */}
              <div className="w-44 space-y-4 shrink-0">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="text-slate-900 text-[12px] font-medium leading-none">Jenis Surat</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 border-slate-300 bg-white text-[12px] font-medium tracking-tight">
                              <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-slate-300 shadow-none">
                            <SelectItem value="Masuk" className="text-[12px]">Surat Masuk</SelectItem>
                            <SelectItem value="Keluar" className="text-[12px]">Surat Keluar</SelectItem>
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
                        <FieldLabel className="text-slate-900 text-[12px] font-medium leading-none">Tanggal Surat</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-9 border-slate-300 bg-white px-3 text-left font-medium text-[12px] tracking-tight",
                                  !field.value && "text-slate-400"
                                )}
                              >
                                <span className="truncate">
                                  {field.value ? format(parseISO(field.value), "dd MMMM yyyy", { locale: id }) : "Pilih Tanggal"}
                                </span>
                                <CalendarIcon className="ml-auto h-3.5 w-3.5 text-slate-400" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-slate-300 bg-white shadow-none" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? parseISO(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                              initialFocus
                              locale={id}
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

              {/* RIGHT COLUMN: Metadata */}
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="refNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <Field>
                        <FieldLabel className="text-slate-900 text-[12px] font-medium leading-none">Nomor Surat</FieldLabel>
                        <FormControl>
                          <Input 
                            autoFocus // Focus di sini agar tooltip di atas tidak terpicu otomatis
                            placeholder="Masukan nomor surat dinas..." 
                            {...field} 
                            className="h-9 border-slate-300 bg-white text-[12px] font-medium tracking-tight placeholder:text-slate-300 shadow-none" 
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
                        <FieldLabel className="text-slate-900 text-[12px] font-medium leading-none">Perihal / Hal</FieldLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ringkasan perihal dokumen..." 
                            {...field} 
                            className="h-9 border-slate-300 bg-white text-[12px] font-medium tracking-tight placeholder:text-slate-300 shadow-none" 
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
                          <FieldLabel className="text-slate-900 text-[12px] font-medium leading-none">Pengirim</FieldLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama atau instansi" 
                              {...field} 
                              className="h-9 border-slate-300 bg-white text-[12px] font-medium tracking-tight placeholder:text-slate-300 shadow-none" 
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
                          <FieldLabel className="text-slate-900 text-[12px] font-medium leading-none">Penerima</FieldLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama atau instansi" 
                              {...field} 
                              className="h-9 border-slate-300 bg-white text-[12px] font-medium tracking-tight placeholder:text-slate-300 shadow-none" 
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
            className="text-[11px] font-medium text-slate-500 hover:bg-slate-100 h-9 px-5 transition-colors"
          >
            Batalkan
          </Button>
          <Button 
            type="submit" 
            className="bg-slate-900 text-white text-[11px] font-medium h-9 px-6 rounded border border-slate-900 hover:bg-slate-800 transition-all tracking-wide shadow-none"
          >
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}
