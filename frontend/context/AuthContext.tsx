"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  token: string;
} | null;

type AuthContextType = {
  user: User;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser({ token });
    }
  }, []);

  function login(token: string) {
    localStorage.setItem("token", token);
    setUser({ token });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}