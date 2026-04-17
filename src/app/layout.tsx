
"use client"

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { NeuralBackground } from '@/components/layout/NeuralBackground';
import { usePathname, useRouter } from 'next/navigation';
import { FirebaseClientProvider, useUser, initializeFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const { firebaseApp, firestore, auth } = initializeFirebase();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/login');
    }
    if (!isLoading && user && isLoginPage) {
      router.push('/');
    }
  }, [user, isLoading, isLoginPage, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika di halaman login dan sudah login, jangan render login (akan diredirect)
  // Jika di halaman utama dan belum login, jangan render utama (akan diredirect)
  if (!user && !isLoginPage) return null;
  if (user && isLoginPage) return null;

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <FirebaseClientProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthGuard>
              <SidebarProvider>
                <div className="flex min-h-screen w-full relative overflow-hidden">
                  {!isLoginPage && <AppSidebar />}
                  <main className="flex-1 overflow-auto bg-background relative">
                    <NeuralBackground />
                    <div className="relative z-10 min-h-full">
                      {children}
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            </AuthGuard>
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
