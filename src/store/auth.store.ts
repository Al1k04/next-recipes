import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { create } from "zustand";

type SessionStatus = ReturnType<typeof useSession>["status"];

interface AuthState {
  isAuth: boolean;
  status: SessionStatus;
  session: Session | null;
  setAuthState: (status: SessionStatus, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  status: "unauthenticated",
  session: null,
  setAuthState: (status: SessionStatus, session: Session | null) =>
    set({
      isAuth: status === "authenticated",
      status,
      session,
    }),
}));
