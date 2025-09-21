// import { API_BASE_URL } from "@/utils/api";
// import axios from "axios";
// import { useEffect, useState } from "react";

// const useCheckIsLoggedin = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [checking, setChecking] = useState(true);
//   useEffect(() => {
//     fetchLoggedInUser();
//   }, []);

//   const fetchLoggedInUser = async () => {
//     const loginRes = await axios.get(`${API_BASE_URL}/profile`, {
//       withCredentials: true,
//     });
//     if (loginRes.data.user.role === "User") {
//       setIsLoggedIn(true);
//       setChecking(false);
//     }
//   };
//   if(checking) return <div>Loading...</div>
//   if(!isLoggedIn) return null
// };
// export default useCheckIsLoggedin;

// hooks/useCheckIsLoggedIn.ts
"use client";

import { API_BASE_URL } from "@/utils/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { roleAtom } from "../store/auth";

export default function useCheckIsLoggedIn(isHeader: boolean) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const [roleAtomValue, setRoleAtomValue] = useAtom(roleAtom);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      if (!roleAtomValue) {
        try {
          const res = await axios.get(`${API_BASE_URL}/profile`, {
            withCredentials: true,
          });

          if (res.data.user?.role === "User") {
            setIsLoggedIn(true);
            setRoleAtomValue(res.data.user.role);
          } else {
            setIsLoggedIn(false);
            if (!isHeader) router.replace("/login");
          }
        } catch {
          setIsLoggedIn(false);
          if (!isHeader) router.replace("/login");
        } finally {
          setChecking(false);
        }
      } else {
        setIsLoggedIn(true);
        setChecking(false);
      }
    };

    fetchLoggedInUser();
    console.log(roleAtomValue)
  }, [router, roleAtomValue]);


  return { isLoggedIn, checking };
}
