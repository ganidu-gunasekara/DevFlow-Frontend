"use client";

import React, { useState } from "react";
import { RequireAuth } from "@/src/components/auth/RequireAuth";
import { Topbar } from "@/src/components/layout/Topbar";
import { SideBar } from "@/src/components/layout/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <RequireAuth>
      <div className="flex flex-col h-screen overflow-hidden">
        <Topbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <div className="flex flex-row flex-1 min-h-0">
          {openMenu && <SideBar />}
          {children}
        </div>
      </div>
    </RequireAuth>
  );
}
