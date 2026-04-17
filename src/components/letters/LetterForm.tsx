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
  FormDescription
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
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
  FileUp, 
  Upload, 
  Info, 
  Hash, 
  User, 
  FileText, 
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
  onSubmit: (data: Partial<Letter>) => void;
  onCancel: () => void;
}

export default function LetterForm({ initialData, onSubmit, onCancel }: LetterFormProps) {
  const [fileName, setFileName] = useState<string | undefined>(initialData?.fileName);
  const [activeTab, setActiveTab] = useState("detail");

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
      <form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 border border-border p-1 h-12 shadow-none">
            <TabsTrigger value="detail" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-border rounded-sm text-sm font-medium transition-all shadow-none">
              Detail Utama
            </TabsTrigger>
            <TabsTrigger value="lampiran" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-border rounded-sm text-sm font-medium transition-all shadow-none">
              Lampiran & Pihak
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detail" className="space-y-5 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-2">
                      <FormLabel className="text-sm font-semibold tracking-tight">Jenis Surat</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border border-border text-xs text-slate-600 shadow-none">
                            Tentukan apakah surat ini masuk ke instansi atau keluar.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-white border-border shadow-none focus:ring-1 focus:ring-slate-400">
                          <SelectValue placeholder="Pilih Jenis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border border-border">
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
                    <FormLabel className="text-sm font-semibold tracking-tight mb-2">Tanggal Surat</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-10 w-full pl-3 text-left font-normal bg-white border-border shadow-none hover:bg-slate-50",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd MMMM yyyy")
                            ) : (
                              <span>Pilih Tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border border-border shadow-none" align="start">
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
                  <FormLabel className="text-sm font-semibold tracking-tight">Nomor Surat</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Contoh: 400/12/SK/2023" {...field} className="pl-10 h-10 bg-white border-border shadow-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold tracking-tight">Perihal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Ringkasan Tujuan Surat" {...field} className="pl-10 h-10 bg-white border-border shadow-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[10px] text-muted-foreground">Tuliskan inti dari surat secara singkat dan padat.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={() => setActiveTab("lampiran")} variant="outline" className="border-border text-xs font-semibold h-9 shadow-none hover:bg-slate-50">
                Lanjut Ke Lampiran
                <ArrowRightLeft className="ml-2 h-3.5 w-3.5 rotate-90" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="lampiran" className="space-y-5 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold tracking-tight">Pengirim</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nama Instansi/Orang" {...field} className="pl-10 h-10 bg-white border-border shadow-none focus:ring-1 focus:ring-slate-400" />
                      </div>
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
                    <FormLabel className="text-sm font-semibold tracking-tight">Penerima</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nama Instansi/Orang" {...field} className="pl-10 h-10 bg-white border-border shadow-none focus:ring-1 focus:ring-slate-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="bg-border shadow-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-semibold tracking-tight">Lampiran Dokumen</FormLabel>
                {fileName && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Terpilih</span>}
              </div>
              <div className={cn(
                "border border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all bg-slate-50/20 shadow-none cursor-pointer hover:bg-slate-50",
                fileName ? "border-emerald-500/50 bg-emerald-50/5" : "border-border"
              )} onClick={() => document.getElementById('file-upload')?.click()}>
                {fileName ? (
                  <div className="flex items-center gap-4 w-full px-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <Upload className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <span className="text-sm font-semibold truncate text-slate-900">{fileName}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">Klik Untuk Mengganti File</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileUp className="h-8 w-8 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-slate-900 mb-1">Unggah Digital Scan</p>
                    <p className="text-[10px] text-muted-foreground">Format PDF, DOCX (Maks. 5MB)</p>
                  </>
                )}
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button type="button" onClick={() => setActiveTab("detail")} variant="ghost" className="text-xs font-semibold h-9">
                Kembali
              </Button>
              <div className="text-[10px] text-muted-foreground font-medium italic">
                Pastikan Semua Metadata Benar
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-sm font-semibold">
            Batal
          </Button>
          <Button type="submit" className="min-w-[140px] bg-primary text-primary-foreground text-sm font-bold shadow-none hover:opacity-90 transition-opacity">
            Simpan Arsip
          </Button>
        </div>
      </form>
    </Form>
  );
}
