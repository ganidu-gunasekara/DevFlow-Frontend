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
      <div className="flex flex-col min-h-screen">
        <Topbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <div className="flex flex-row flex-1">
          {openMenu && <SideBar />}
          {children}
        </div>
      </div>
    </RequireAuth>
  );
}
