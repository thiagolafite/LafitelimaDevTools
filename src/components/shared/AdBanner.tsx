"use client";

import React, { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export interface AdBannerProps {
  slot?: "top-leaderboard" | "in-content" | "sidebar" | "footer-banner";
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
  adClient?: string;
  adSlotId?: string;
}

export function AdBanner({
  slot = "in-content",
  format = "auto",
  className,
  adClient = siteConfig.adSenseClientId,
  adSlotId = "1234567890",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // Lazy load the ad only when it enters the viewport to protect Core Web Vitals (LCP / CLS)
  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Preload when 200px from viewport
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize AdSense push once element is visible
  useEffect(() => {
    if (isIntersecting && adClient && typeof window !== "undefined") {
      try {
        // @ts-expect-error - adsbygoogle is injected by external AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (e) {
        console.warn("AdSense push exception:", e);
      }
    }
  }, [isIntersecting, adClient]);

  // Dimension presets to avoid Cumulative Layout Shift (CLS)
  const slotStyles = {
    "top-leaderboard": "min-h-[90px] max-w-[728px]",
    "in-content": "min-h-[100px] sm:min-h-[120px] max-w-4xl",
    "sidebar": "min-h-[250px] max-w-[300px]",
    "footer-banner": "min-h-[90px] max-w-4xl",
  }[slot];

  return (
    <div
      ref={adRef}
      className={cn(
        "my-6 mx-auto w-full overflow-hidden rounded-xl border border-border/50 bg-card/60 p-2 text-center transition-all",
        slotStyles,
        className
      )}
      aria-label="Advertisement"
    >
      <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/30 mb-2">
        <span>Publicidade • Advertisement</span>
        <span>Ethical Tech Ads</span>
      </div>

      {/* When AdSense Client ID is provided and visible */}
      {adClient && isIntersecting ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={adSlotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        /* Clean placeholder to prevent layout shifts and display in dev */
        <div className="flex h-20 sm:h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 text-center">
          <div className="text-xs font-semibold text-muted-foreground">
            Espaço Publicitário Responsivo (Google AdSense / Carbon Ads)
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            Container otimizado com zero impacto no Core Web Vitals (CLS = 0)
          </p>
        </div>
      )}
    </div>
  );
}
