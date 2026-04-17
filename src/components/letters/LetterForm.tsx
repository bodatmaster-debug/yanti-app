
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
import { CalendarIcon, FileUp, X } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  refNumber: z.string().min(1, 'Nomor surat harus diisi'),
  sender: z.string().min(1, 'Pengirim harus diisi'),
  recipient: z.string().min(1, 'Penerima harus diisi'),
  subject: z.string().min(5, 'Subjek minimal 5 karakter'),
  date: z.string().min(1, 'Tanggal harus dipilih'),
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
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Surat</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-2">
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
                <FormLabel className="mb-2">Tanggal Surat</PopLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
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
              <FormLabel>Nomor Surat</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 400/12/SK/2023" {...field} className="border-2" />
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
                <FormLabel>Pengirim</FormLabel>
                <FormControl>
                  <Input placeholder="Nama instansi/orang" {...field} className="border-2" />
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
                <FormLabel>Penerima</FormLabel>
                <FormControl>
                  <Input placeholder="Nama instansi/orang" {...field} className="border-2" />
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
              <FormLabel>Perihal</FormLabel>
              <FormControl>
                <Input placeholder="Tujuan atau isi ringkas surat" {...field} className="border-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>File Dokumen (Opsional)</FormLabel>
          <div className={cn(
            "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors",
            fileName ? "bg-accent/5 border-accent" : "hover:border-primary/50"
          )}>
            {fileName ? (
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded">
                  <FileUp className="h-5 w-5 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-1">{fileName}</span>
                  <button 
                    type="button" 
                    onClick={() => setFileName(undefined)}
                    className="text-xs text-destructive hover:underline text-left"
                  >
                    Hapus file
                  </button>
                </div>
              </div>
            ) : (
              <>
                <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Tarik dan lepas file di sini, atau klik untuk memilih file
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="border-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Pilih File
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

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="border-2">
            Batal
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground border-2 border-transparent">
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}
