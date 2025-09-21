// hooks/useRedirectIfAdmin.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { roleAtom } from "../store/auth";
import { useAtom } from "jotai";

export const useRedirectIfAdmin = () => {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const [roleAtomValue, setRoleAtomValue] = useAtom(roleAtom);

  useEffect(() => {
    const checkAuth = async () => {
      if (!roleAtomValue) {
        try {
          const res = await axios.get(`${API_BASE_URL}/profile`, {
            withCredentials: true,
          });

          if (res.data.user.role === "Admin") {
            setRoleAtomValue(res.data.user.role)
            router.replace("/admin");
          }
        } catch {
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router,roleAtomValue]);

  return { checking };
};
