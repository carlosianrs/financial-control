"use client"

import { deleteToken } from "@/auth/auth";
import { Loading } from "@/components/loading";
import { getUser, User } from "@/http/api/get-user";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

const UserContext = React.createContext<User | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User>();
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const res = await getUser();
        if (!res?.message) {
          setUser(res);
        } else {
          if (res.status == HttpStatusCode.Unauthorized) {
            toast.warning("Login expirado!", {
              description: "Necessário realizar login novamente",
            })

            await deleteToken();
            router.push("/auth/sign-in")
          } else {
            toast.error('Atenção', { description: res.message })
          }
        }

        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading />

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => React.useContext(UserContext);