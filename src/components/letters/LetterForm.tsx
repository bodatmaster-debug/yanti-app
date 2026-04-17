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
  FormMessage 
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
import { Letter, LetterType } from '@/lib/types';
import { CalendarIcon, FileUp, X, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  refNumber: z.string().min(1, 'Nomor surat wajib diisi'),
  sender: z.string().min(1, 'Pengirim wajib diisi'),
  recipient: z.string().min(1, 'Penerima wajib diisi'),
  subject: z.string().min(5, 'Subjek minimal 5 karakter'),
  date: z.string().min(1, 'Pilih tanggal surat'),
  type: z.enum(['Masuk', 'Keluar'] as const),
});

interface LetterFormProps {
  initialData?: Letter;
  onSubmit: (data: Partial<Letter>) => void;
  onCancel: () => void;
}

export default function LetterForm({ initialData, onSubmit, onCancel }: LetterFormProps) {
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
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-5 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Jenis Surat</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10 bg-slate-50/50">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Masuk">Surat Masuk</SelectItem>
                    <SelectItem value="Keluar">Surat Keluar</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tanggal Surat</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-10 w-full pl-3 text-left font-normal bg-slate-50/50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd MMMM yyyy")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="refNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nomor Surat</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 400/12/SK/2023" {...field} className="h-10 bg-slate-50/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pengirim</FormLabel>
                <FormControl>
                  <Input placeholder="Nama instansi atau orang" {...field} className="h-10 bg-slate-50/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Penerima</FormLabel>
                <FormControl>
                  <Input placeholder="Nama instansi atau orang" {...field} className="h-10 bg-slate-50/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Perihal</FormLabel>
              <FormControl>
                <Input placeholder="Ringkasan tujuan surat" {...field} className="h-10 bg-slate-50/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lampiran Dokumen (Opsional)</FormLabel>
          <div className={cn(
            "border border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all bg-slate-50/30",
            fileName ? "border-sky-500/50 bg-sky-50/20" : "hover:border-primary/30"
          )}>
            {fileName ? (
              <div className="flex items-center gap-3 w-full">
                <div className="bg-sky-100 p-2.5 rounded-md">
                  <Upload className="h-4 w-4 text-sky-600" />
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{fileName}</span>
                  <button 
                    type="button" 
                    onClick={() => setFileName(undefined)}
                    className="text-[10px] text-destructive hover:underline text-left font-bold uppercase tracking-wider mt-0.5"
                  >
                    Ganti file
                  </button>
                </div>
              </div>
            ) : (
              <>
                <FileUp className="h-7 w-7 text-muted-foreground/40 mb-3" />
                <p className="text-[11px] text-muted-foreground font-medium mb-4 text-center">
                  Drag & drop file atau klik tombol di bawah
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Pilih Dokumen
                </Button>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs font-semibold">
            BATAL
          </Button>
          <Button type="submit" className="min-w-[120px] shadow-sm">
            SIMPAN ARSIP
          </Button>
        </div>
      </form>
    </Form>
  );
}