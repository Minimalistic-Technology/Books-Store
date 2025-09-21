// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { useAtom } from "jotai";
// import { useRouter } from "next/navigation";
// import { roleAtom, tokenAtom } from "../store/auth";

// export default function AdminProtected({ children }: { children: ReactNode }) {
//   const [token, setToken] = useAtom(tokenAtom);
//   const [role, setRole] = useAtom(roleAtom);
//   const [hydrated, setHydrated] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedRole = localStorage.getItem("role");

//     if (savedToken) setToken(savedToken);
//     if (savedRole) setRole(savedRole);

//     setHydrated(true);
//   }, [setToken, setRole]);

//   useEffect(() => {
//     if (!hydrated) return;

//     if (!token || role !== "Admin") {
//       router.replace("/admin-login");
//     }
//   }, [hydrated, token, role, router]);

//   if (!hydrated) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }

//   return <>{children}</>;
// }

// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function AdminProtected({ children }: { children: ReactNode }) {
//   const [checking, setChecking] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/profile", {
//           withCredentials: true,
//         });

//         if (res.data.role !== "Admin") {
//           router.replace("/admin-login");
//         }
//       } catch (err) {
//         if (err instanceof Error) console.log(err);
//         router.replace("/admin-login");
//       } finally {
//         setChecking(false);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   if (checking) {
//     return null;
//   }
//   // if (checking) {
//   //   return (
//   //     <div className="flex items-center justify-center h-screen">
//   //       Loading...
//   //     </div>
//   //   );
//   // }

//   return <>{children}</>;
// }

"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { roleAtom } from "../store/auth";
import { useAtom } from "jotai";

export default function AdminProtected({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
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
            setRoleAtomValue(res.data.user.role);
            setAuthorized(true);
          } else {
            router.replace("/admin-login");
          }
        } catch (err) {
          if (err instanceof Error) console.log(err);
          router.replace("/admin-login");
        } finally {
          setChecking(false);
        }
      } else {
        setAuthorized(true);
        setChecking(false);
      }
    };

    checkAuth();
  }, [router, roleAtomValue]);

  if (checking) return null;
  if (!authorized) return null;

  return <>{children}</>;
}
