"use client";

import { BellIcon, Menu } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";

interface topBarProps {
  openMenu: boolean;
  setOpenMenu: (value: boolean) => void;
}

export function Topbar({ openMenu, setOpenMenu }: topBarProps) {
  return (
    <div className="topbar">
      <button
        type="button"
        aria-label="Open menu"
        className="icon-btn"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <Menu className="w-4 h-4" />
      </button>

      <span className="topbar-brand">DevFlow</span>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Open notifications"
          className="icon-btn relative"
        >
          <BellIcon className="w-4 h-4" />
          <span className="notif-dot" />
        </button>

        <div className="avatar">U</div>
      </div>
    </div>
  );
}
