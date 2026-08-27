"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  User,
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  toggleFavoriteTool,
} from "@/lib/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  useEffect(() => {
    setMounted(true);
    const active = getCurrentUser();
    setUser(active);
  }, []);

  const openAuthModal = useCallback((tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    const res = await loginUser(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      toast.success(
        res.user.role === "admin"
          ? `Bem-vindo, Administrador ${res.user.name} 👑`
          : `Bem-vindo de volta, ${res.user.name}!`
      );
      return true;
    } else {
      toast.error(res.error || "Erro ao efetuar login.");
      return false;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, pass: string): Promise<boolean> => {
      const res = await registerUser(name, email, pass);
      if (res.success) {
        setIsAuthModalOpen(false);
        toast.info(
          "Solicitação enviada com sucesso! Seu cadastro está aguardando a aprovação do Administrador.",
          { duration: 6000 }
        );
        return true;
      } else {
        toast.error(res.error || "Erro ao cadastrar conta.");
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    toast.info("Você saiu da sua conta.");
  }, []);

  const toggleFavorite = useCallback(
    (toolId: string) => {
      if (!user) {
        openAuthModal("login");
        toast.info("Faça login para salvar ferramentas nos seus favoritos.");
        return;
      }
      const updated = toggleFavoriteTool(user.id, toolId);
      setUser({ ...user, favoriteTools: updated });
    },
    [user, openAuthModal]
  );

  const isFavorite = useCallback(
    (toolId: string) => {
      if (!user) return false;
      return user.favoriteTools?.includes(toolId) || false;
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: mounted && !!user,
    isAdmin: mounted && user?.role === "admin",
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    toggleFavorite,
    isFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
