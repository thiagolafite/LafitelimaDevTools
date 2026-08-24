"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";
import { siteConfig } from "@/config/site";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === siteConfig.adminPin) {
      sessionStorage.setItem("techtools_admin_authenticated", "true");
      onSuccess();
    } else {
      setError(true);
      setAttempts((prev) => prev + 1);
      setPin("");
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Painel do Administrador
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Acesso restrito para telemetria, logs de erros e análise de demanda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Chave de Acesso / PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Digite a chave mestra..."
                autoFocus
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Chave de acesso incorreta. Tentativa #{attempts}</span>
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            <span>Acessar Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-muted/30 p-3 text-center border border-border/40">
          <p className="text-[11px] text-muted-foreground">
            💡 Dica: A chave padrão de desenvolvimento é: <code className="font-mono font-bold text-foreground bg-muted px-1 py-0.5 rounded">{siteConfig.adminPin}</code> (configurável via <code className="font-mono text-[10px]">NEXT_PUBLIC_ADMIN_PIN</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
