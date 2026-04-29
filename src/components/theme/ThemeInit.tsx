"use client";

import { useEffect } from "react";
import { initTheme } from "@/src/lib/theme/theme";

export function ThemeInit() {
  useEffect(() => {
    initTheme();
  }, []);

  return null;
}
