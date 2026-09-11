import React from "react";
import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>

      <span className="rounded-full bg-muted px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
        Erro 404 • Page Not Found
      </span>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
        Página não encontrada
      </h1>

      <p className="max-w-md text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">
        A ferramenta ou página que você procurou não existe, foi movida ou o link informado está incorreto.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/pt"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="h-4 w-4" />
          <span>Voltar para o Início</span>
        </Link>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground shadow-xs hover:bg-muted/60 transition-all"
        >
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span>English Version</span>
        </Link>
      </div>
    </div>
  );
}
