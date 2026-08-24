"use client";

import React, { useState, useEffect } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ClientToaster } from "@/components/layout/ClientToaster";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("techtools_admin_authenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("techtools_admin_authenticated");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar lang="pt" onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1">
          {isAuthenticated ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <AdminLogin onSuccess={() => setIsAuthenticated(true)} />
          )}
        </main>
        <Footer lang="pt" />
        <CommandMenu
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          lang="pt"
        />
        <ClientToaster />
      </div>
    </ThemeProvider>
  );
}
