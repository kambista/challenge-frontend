import { create } from "zustand";

type AuthState = {
  email: string;
  displayName: string;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
};

type AuthActions = {
  startSession: (email: string) => void;
  completeProfile: (displayName: string) => void;
  clearSession: () => void;
};

const INITIAL_AUTH_STATE: AuthState = {
  email: "",
  displayName: "",
  isAuthenticated: false,
  isProfileComplete: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => {
  function startSession(email: string) {
    set({
      email,
      displayName: "",
      isAuthenticated: true,
      isProfileComplete: false,
    });
  }

  function completeProfile(displayName: string) {
    set({ displayName, isProfileComplete: true });
  }

  function clearSession() {
    set(INITIAL_AUTH_STATE);
  }

  return { ...INITIAL_AUTH_STATE, startSession, completeProfile, clearSession };
});
