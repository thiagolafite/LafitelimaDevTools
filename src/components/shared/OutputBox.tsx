"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OutputBoxProps {
  value: string;
  label?: string;
  placeholder?: string;
  className?: string;
  isMono?: boolean;
  rows?: number;
  readOnly?: boolean;
  actions?: React.ReactNode;
}

export function OutputBox({
  value,
  label,
  placeholder = "Output will appear here...",
  className,
  isMono = true,
  rows = 8,
  readOnly = true,
  actions,
}: OutputBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className={cn("relative flex flex-col rounded-lg border border-border bg-card", className)}>
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div className="flex items-center gap-2">
            {actions}
            {value && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          value={value}
          placeholder={placeholder}
          rows={rows}
          readOnly={readOnly}
          className={cn(
            "w-full resize-y bg-transparent p-4 text-sm text-foreground focus:outline-none focus:ring-0",
            isMono && "font-mono font-normal tracking-tight leading-relaxed",
            !label && "pt-8"
          )}
        />
        {!label && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur hover:bg-muted hover:text-foreground transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
