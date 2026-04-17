
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Logika login akan diimplementasikan nanti
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-8 border-b border-slate-100 dark:border-slate-900">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Pengarsipan Yanti
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-500">
              Masuk sebagai Admin untuk mengelola dokumen digital.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 pt-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                  Email atau Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    placeholder="admin@pengarsipan.app" 
                    className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                    Kata Sandi
                  </Label>
                  <Link href="#" className="text-[11px] font-medium text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all"
                    required
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button 
                type="submit" 
                className="w-full h-11 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <LogIn className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Masuk Sekarang
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-slate-400 font-medium">
                Hak Cipta &copy; {new Date().getFullYear()} UD Petani Marsaor.
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
