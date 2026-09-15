import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Role } from "@/types";

export interface AuthState {
  user: User | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
};

function sanitizeUser(user: any): User | null {
  if (!user) return null;
  try {
    return JSON.parse(JSON.stringify(user));
  } catch {
    return user;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string | null }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    setSession: (
      state,
      action: PayloadAction<{
        user: User;
        token?: string | null;
      }>
    ) => {
      const sanitizedUser = sanitizeUser(action.payload.user);
      state.user = sanitizedUser;
      state.role = (sanitizedUser?.role as Role) || "PATIENT";
      state.token = action.payload.token ?? state.token;
      state.isAuthenticated = !!sanitizedUser;
      state.isInitialized = true;
    },
    setUserProfile: (state, action: PayloadAction<User>) => {
      const sanitizedUser = sanitizeUser(action.payload);
      state.user = sanitizedUser;
      state.role = (sanitizedUser?.role as Role) || state.role || "PATIENT";
    },
    clearAuth: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const {
  setToken,
  setSession,
  setUserProfile,
  clearAuth,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentRole = (state: { auth: AuthState }) => state.auth.role;
export const selectIsAuthInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
