"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Crown, Lock } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ClientToaster } from "@/components/layout/ClientToaster";
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

function AdminContent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [pinAuthenticated, setPinAuthenticated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sessionAuth = sessionStorage.getItem("techtools_admin_authenticated");
    if (sessionAuth === "true") {
      setPinAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("techtools_admin_authenticated");
    setPinAuthenticated(false);
    logout();
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Case 1: User is logged in as regular user (not admin) and has not entered master PIN
  if (isAuthenticated && !isAdmin && !pinAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Acesso Não Autorizado</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Olá, <strong className="text-foreground">{user?.name}</strong>. Esta área de telemetria e gestão é restrita exclusivamente ao Administrador da plataforma.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/pt"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para as Ferramentas</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-foreground underline pt-1"
            >
              Entrar com outra conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: User is Admin or entered PIN
  if (isAdmin || pinAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Case 3: Anonymous visitor
  return <AdminLogin onSuccess={() => setPinAuthenticated(true)} />;
}

export default function AdminPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Navbar lang="pt" onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-1">
            <AdminContent />
          </main>
          <Footer lang="pt" />
          <CommandMenu
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            lang="pt"
          />
          <AuthModal lang="pt" />
          <ClientToaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
