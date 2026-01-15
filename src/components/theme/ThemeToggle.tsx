"use client";

import { useEffect, useState } from "react";
import { getSavedTheme, toggleTheme } from "@/src/lib/theme/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getSavedTheme());
  }, []);

  return (
    <button
      type="button"
      onClick={() => setTheme(toggleTheme())}
      className="px-3 py-2 rounded border border-border bg-surface-2 text-text hover:opacity-90 transition"
    >
      {theme === "dark" ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    )}
    </button>
  );
}
