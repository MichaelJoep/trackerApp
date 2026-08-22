import { create } from "zustand";
import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;

  initialize: () => Promise<void>;

  signIn: (
    email: string,
    password: string,
  ) => Promise<void>;

  signUp: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;

  verifyOtp: (
    email: string,
    token: string,
    purpose: "signup" | "forgot-password",
  ) => Promise<void>;

  updatePassword: (
    password: string,
  ) => Promise<void>;

  forgotPassword: (
    email: string,
  ) => Promise<void>;

  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(
  (set) => ({
    user: null,
    session: null,
    loading: false,

    initialize: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
      });

      supabase.auth.onAuthStateChange(
        (_event, session) => {
          set({
            session,
            user: session?.user ?? null,
          });
        },
      );
    },

    signIn: async (
      email,
      password,
    ) => {
      set({ loading: true });

      try {
        const {
          data,
          error,
        } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        set({
          user: data.user,
          session: data.session,
        });
      } finally {
        set({ loading: false });
      }
    },

    signUp: async ({
      firstName,
      lastName,
      email,
      phone,
      password,
    }) => {
      set({ loading: true });

      try {
        const {
          error,
        } = await supabase.auth.signUp({
          email,
          password,

          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone,
              currency: "NGN",
            },
          },
        });

        if (error) {
          throw error;
        }
      } finally {
        set({ loading: false });
      }
    },

    verifyOtp: async (
      email,
      token,
      purpose,
    ) => {
      set({ loading: true });

      try {
        const type =
          purpose === "signup"
            ? "email"
            : "recovery";

        const {
          data,
          error,
        } = await supabase.auth.verifyOtp({
          email,
          token,
          type,
        });

        if (error) {
          throw error;
        }

        set({
          user: data.user,
          session: data.session,
        });
      } finally {
        set({ loading: false });
      }
    },

    updatePassword: async (password) => {
        set({ loading: true });
      
        try {
          const {
            error,
          } = await supabase.auth.updateUser({
            password,
          });
      
          if (error) {
            throw error;
          }
        } finally {
          set({ loading: false });
        }
      },
      
    forgotPassword: async (email) => {
        set({ loading: true });
      
        try {
          const {
            error,
          } = await supabase.auth.resetPasswordForEmail(
            email,
          );
      
          if (error) {
            throw error;
          }
        } finally {
          set({ loading: false });
        }
      },

    signOut: async () => {
      await supabase.auth.signOut();

      set({
        user: null,
        session: null,
      });
    },
  }),
);