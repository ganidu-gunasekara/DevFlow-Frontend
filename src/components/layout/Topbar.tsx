"use client";

import { BellIcon, Menu } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import { useState } from "react";
import { SideBar } from "./sidebar";
import { boolean } from "zod";

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

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Open notifications"
          className="icon-btn"
        >
          <BellIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
