"use client";

import React from "react";
import { RequireAuth } from "@/src/components/auth/RequireAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
