// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCookie } from "../utils/cookies";

type AuthContextType = {
  accountId: string | null;
  setAccountId: (id: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const cookieId = getCookie("accountId");
    setAccountId(cookieId);
  }, []);

  return (
    <AuthContext.Provider value={{ accountId, setAccountId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
