"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";

export function ClientToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Toaster position="bottom-right" richColors />;
}
