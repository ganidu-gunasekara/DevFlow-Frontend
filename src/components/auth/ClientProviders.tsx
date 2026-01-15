"use client";

import AuthBootstrap from "./AuthBootstrap";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthBootstrap />
      {children}
    </>
  );
}
