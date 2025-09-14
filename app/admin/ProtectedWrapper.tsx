


"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { roleAtom, tokenAtom } from "../store/auth";

export default function AdminProtected({ children }: { children: ReactNode }) {
  const [token, setToken] = useAtom(tokenAtom);
  const [role, setRole] = useAtom(roleAtom);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);

    setHydrated(true);
  }, [setToken, setRole]);

  
  useEffect(() => {
    if (!hydrated) return;

    if (!token || role !== "Admin") {
      router.replace("/admin-login");
    }
  }, [hydrated, token, role, router]);

  
  if (!hydrated) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
