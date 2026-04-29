"use client";

const STORAGE_KEY = "theme";

export function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;

  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");

  localStorage.setItem(STORAGE_KEY, theme);
}

export function getSavedTheme(): "light" | "dark" {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
}

export function initTheme() {
  applyTheme(getSavedTheme());
}

export function toggleTheme(): "light" | "dark" {
  const isDark = document.documentElement.classList.contains("dark");
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  return next;
}
