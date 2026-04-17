
"use client"

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Letter, LetterType } from '@/lib/types';
import { 
  CalendarIcon,
  Lock,
  Edit2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Field, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  refNumber: z.string().min(1, 'Nomor surat wajib diisi'),
  sender: z.string().min(1, 'Pengirim wajib diisi'),
  recipient: z.string().min(1, 'Penerima wajib diisi'),
  subject: z.string().min(1, 'Pilih hal'),
  date: z.string().min(1, 'Pilih tanggal surat'),
  type: z.enum(['Masuk', 'Keluar', 'Berita acara'] as const),
});

interface LetterFormProps {
  initialData?: Letter;
  lastLetter?: Letter;
  nextAgendaNumber?: string;
  countsByType?: { Masuk: number; Keluar: number; 'Berita acara': number };
  onSubmit: (data: Partial<Letter>) => void;
  onCancel: () => void;
}

const getRomanMonth = (month: number) => {
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return roman[month] || "";
};

export default function LetterForm({ 
  initialData, 
  nextAgendaNumber = "001",
  countsByType = { Masuk: 0, Keluar: 0, 'Berita acara': 0 },
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

  const watchType = useWatch({ control: form.control, name: 'type' });
  const watchDate = useWatch({ control: form.control, name: 'date' });
  const watchSubject = useWatch({ control: form.control, name: 'subject' });

  useEffect(() => {
    if (!initialData) {
      const d = watchDate ? parseISO(watchDate) : new Date();
      const year = d.getFullYear();
      const monthRoman = getRomanMonth(d.getMonth());
      const hal = watchSubject || '...';

      if (watchType === 'Berita acara') {
        const seq = (countsByType['Berita acara'] + 1).toString().padStart(3, '0');
        // Format: Nomor/BA-ASET/PM/Bulan Romawi/Tahun
        const autoRef = `${seq}/BA-ASET/PM/${monthRoman}/${year}`;
        form.setValue('refNumber', autoRef, { shouldValidate: true });
        form.setValue('subject', 'BA-ASET');
      } else if (watchType === 'Keluar') {
        const seq = (countsByType.Keluar + 1).toString().padStart(3, '0');
        // Format: nomor/hal/bulan(romawi)/tahun
        const autoRef = `${seq}/${hal}/${monthRoman}/${year}`;
        form.setValue('refNumber', autoRef, { shouldValidate: true });
      } else if (watchType === 'Masuk') {
        // Biarkan kosong untuk input manual atau reset jika baru ganti dari otomatis
        const currentRef = form.getValues('refNumber');
        if (currentRef.includes('/') && currentRef.split('/').length >= 4) {
          form.setValue('refNumber', '', { shouldValidate: false });
        }
      }
    }
  }, [watchType, watchDate, watchSubject, initialData, countsByType, form]);

  const onHandleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
  };

  const isAutoNumber = watchType === 'Keluar' || watchType === 'Berita acara';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden shadow-none">
        <div className="px-6 py-5 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-lg font-medium tracking-tight text-slate-900 dark:text-slate-100 leading-none">Tambah Arsip Surat</h2>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">Kelola metadata surat untuk kearsipan digital.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-medium">No. Agenda</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 tabular-nums">{nextAgendaNumber}</p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Field>
                      <FieldLabel className="text-slate-900 dark:text-slate-100 text-[13px] font-medium leading-none mb-1.5">Jenis Surat</FieldLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-[12px] font-medium shadow-none">
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
                          <SelectItem value="Masuk" className="text-[12px]">Surat Masuk</SelectItem>
                          <SelectItem value="Keluar" className="text-[12px]">Surat Keluar</SelectItem>
                          <SelectItem value="Berita acara" className="text-[12px]">Berita Acara</SelectItem>
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
                      <FieldLabel className="text-slate-900 dark:text-slate-100 text-[13px] font-medium leading-none mb-1.5">Tanggal Surat</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-9 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-left font-medium text-[12px] shadow-none",
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
                        <PopoverContent className="w-auto p-0 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950" align="start">
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

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Field>
                    <FieldLabel className="text-slate-900 dark:text-slate-100 text-[13px] font-medium mb-1.5">Hal</FieldLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      disabled={watchType === 'Berita acara'}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-[12px] font-medium shadow-none">
                          <SelectValue placeholder="Pilih hal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
                        {watchType === 'Berita acara' ? (
                          <SelectItem value="BA-ASET" className="py-2">
                            <div className="flex flex-col text-left">
                              <span className="font-medium text-[12px]">BA-ASET</span>
                              <span className="text-[10px] text-slate-400 font-normal">Berita acara aset</span>
                            </div>
                          </SelectItem>
                        ) : (
                          <>
                            <SelectItem value="SK" className="py-2">
                              <div className="flex flex-col text-left">
                                <span className="font-medium text-[12px]">SK</span>
                                <span className="text-[10px] text-slate-400 font-normal">Surat keterangan</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="BBH" className="py-2">
                              <div className="flex flex-col text-left">
                                <span className="font-medium text-[12px]">BBH</span>
                                <span className="text-[10px] text-slate-400 font-normal">Bahan baku</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="SU" className="py-2">
                              <div className="flex flex-col text-left">
                                <span className="font-medium text-[12px]">SU</span>
                                <span className="text-[10px] text-slate-400 font-normal">Surat undangan</span>
                              </div>
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refNumber"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Field>
                    <FieldLabel className="text-slate-900 dark:text-slate-100 text-[13px] font-medium flex items-center gap-1.5 mb-1.5">
                      Nomor Surat {isAutoNumber ? <Lock className="h-3 w-3 text-slate-300" /> : <Edit2 className="h-3 w-3 text-slate-300" />}
                    </FieldLabel>
                    <FormControl>
                      <Input 
                        readOnly={isAutoNumber}
                        placeholder={isAutoNumber ? "Nomor otomatis..." : "Masukkan nomor surat..."} 
                        {...field} 
                        className={cn(
                          "h-9 border-slate-300 dark:border-slate-800 text-[12px] shadow-none",
                          isAutoNumber ? "bg-slate-50/50 dark:bg-slate-900/50 cursor-default" : "bg-white dark:bg-slate-900"
                        )} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </Field>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <Field>
                      <FieldLabel className="text-slate-900 dark:text-slate-100 text-[13px] font-medium mb-1.5">Pengirim</FieldLabel>
                      <FormControl>
                        <Input placeholder="Instansi / Nama" {...field} className="h-9 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-[12px] shadow-none" />
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
                      <FieldLabel className="text-slate-900 dark:text-slate-100 text-[13px] font-medium mb-1.5">Penerima</FieldLabel>
                      <FormControl>
                        <Input placeholder="Instansi / Nama" {...field} className="h-9 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-[12px] shadow-none" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </Field>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-slate-300 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/10 dark:bg-slate-900/10 shrink-0">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-[11px] font-medium h-9 px-5">Batalkan</Button>
          <Button type="submit" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-medium h-9 px-6 shadow-none">Simpan Arsip</Button>
        </div>
      </form>
    </Form>
  );
}
