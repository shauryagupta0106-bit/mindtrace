import React, { createContext, useContext, useMemo, useState } from "react";
import { localAuth, type LocalUser } from "@/lib/local-auth";

type LocalAuthContextValue = {
  user: LocalUser | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => LocalUser;
  signUp: (email: string, password: string, firstName?: string) => LocalUser;
  signOut: () => void;
};

const LocalAuthContext = createContext<LocalAuthContextValue | null>(null);

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(() => localAuth.getUser());

  const value = useMemo<LocalAuthContextValue>(
    () => ({
      user,
      isSignedIn: Boolean(user),
      signIn: (email: string, password: string) => {
        const next = localAuth.signIn(email, password);
        setUser(next);
        return next;
      },
      signUp: (email: string, password: string, firstName?: string) => {
        const next = localAuth.signUp(email, password, firstName);
        setUser(next);
        return next;
      },
      signOut: () => {
        localAuth.signOut();
        setUser(null);
      },
    }),
    [user]
  );

  return <LocalAuthContext.Provider value={value}>{children}</LocalAuthContext.Provider>;
}

export function useLocalAuthContext() {
  const context = useContext(LocalAuthContext);
  if (!context) {
    return {
      user: localAuth.getUser(),
      isSignedIn: localAuth.isSignedIn(),
      signIn: localAuth.signIn,
      signUp: localAuth.signUp,
      signOut: localAuth.signOut,
    };
  }
  return context;
}
