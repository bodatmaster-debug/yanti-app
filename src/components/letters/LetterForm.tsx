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
import { Item, ItemContent, ItemMedia } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const onHandleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      fileName,
      fileUrl: fileName ? 'dummy_url' : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="flex flex-col h-full bg-white">
        {/* SECTION 1: HEADER (Sticky) */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <Item variant="outline" size="sm" className="bg-white border-slate-300 rounded-md py-2 px-3">
            <ItemMedia variant="icon" className="bg-slate-50 text-slate-600 border-slate-300 size-7">
              <Hash className="h-4 w-4" />
            </ItemMedia>
            <ItemContent className="gap-0 ml-1">
              <p className="text-[10px] text-slate-500 font-medium">Agenda Berikutnya</p>
              <p className="text-sm font-bold text-slate-900">{nextAgendaNumber}</p>
            </ItemContent>
          </Item>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 text-slate-600 hover:text-primary transition-all rounded-md shrink-0 ml-3">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-white border border-slate-300 p-4 shadow-none w-80 rounded-md">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 border-b pb-1">Arsip Terakhir</p>
                  {lastLetter ? (
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between"><span>No. Agenda:</span> <span className="font-semibold">{lastLetter.id}</span></div>
                      <div className="flex justify-between"><span>No. Surat:</span> <span className="font-semibold">{lastLetter.refNumber}</span></div>
                      <div className="flex justify-between"><span>Hal:</span> <span className="font-semibold text-right max-w-[120px] truncate">{lastLetter.subject}</span></div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Belum Ada Data.</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* SECTION 2: INPUT AREA (Scrollable) */}
        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="typography-p">Jenis Surat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 border-slate-300 bg-white">
                          <SelectValue placeholder="Pilih Jenis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-slate-300">
                        <SelectItem value="Masuk">Surat Masuk</SelectItem>
                        <SelectItem value="Keluar">Surat Keluar</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="typography-p mb-2">Tanggal Surat</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-10 w-full pl-3 text-left font-normal border-slate-300 bg-white",
                              !field.value && "typography-muted"
                            )}
                          >
                            {field.value ? format(new Date(field.value), "dd MMM yyyy") : <span>Pilih Tanggal</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 text-slate-500" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border-slate-300" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="refNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="typography-p">Nomor Surat</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ketik Nomor Surat..." 
                      {...field} 
                      className="h-10 border-slate-300 bg-white typography-p placeholder:typography-muted" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="typography-p">Perihal</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ringkasan Isi Surat..." 
                      {...field} 
                      className="h-10 border-slate-300 bg-white typography-p placeholder:typography-muted" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="typography-p">Pengirim</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nama / Instansi" 
                        {...field} 
                        className="h-10 border-slate-300 bg-white typography-p placeholder:typography-muted" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="typography-p">Penerima</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nama / Instansi" 
                        {...field} 
                        className="h-10 border-slate-300 bg-white typography-p placeholder:typography-muted" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        {/* SECTION 3: FOOTER (Sticky) */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-white">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel} 
            className="text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground text-xs font-bold h-10 px-6 rounded-md border border-primary"
          >
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}