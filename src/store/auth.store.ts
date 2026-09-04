import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

const ONBOARDING_COMPLETED_KEY = "tracker_onboarding_completed";

const PENDING_VERIFICATION_EMAIL_KEY = "tracker_pending_verification_email";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  pendingVerificationEmail: string | null;

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

  resendOtp: (
    email: string,
    purpose: "signup" | "forgot-password",
  ) => Promise<void>;

  forgotPassword: (
    email: string,
  ) => Promise<void>;

  updatePassword: (
    password: string,
  ) => Promise<void>;

  signOut: () => Promise<void>;

  updateProfile: (input: {
    firstName: string;
    lastName: string;
    phone: string;
    currency: string;
    avatarUrl?: string | null;
  }) => Promise<void>;
}



export const useAuthStore = create<AuthState>(
  (set) => ({
    user: null,
    session: null,
    loading: false,
    initialized: false,
    pendingVerificationEmail: null,

    initialize: async () => {
      try {
        const [
          sessionResult,
          pendingEmail,
        ] = await Promise.all([
          supabase.auth.getSession(),
          AsyncStorage.getItem(
            PENDING_VERIFICATION_EMAIL_KEY,
          ),
        ]);
    
        const session =
          sessionResult.data.session;
    
        const isVerified =
          Boolean(
            session?.user?.email_confirmed_at,
          );
    
        /*
         * If a verified session exists, an old pending
         * verification value must no longer control
         * navigation.
         */
        if (isVerified && pendingEmail) {
          await AsyncStorage.removeItem(
            PENDING_VERIFICATION_EMAIL_KEY,
          );
        }
    
        set({
          session,
          user: session?.user ?? null,
          pendingVerificationEmail:
            isVerified
              ? null
              : pendingEmail ?? null,
          initialized: true,
        });
    
        supabase.auth.onAuthStateChange(
          (_event, updatedSession) => {
            set({
              session: updatedSession,
              user:
                updatedSession?.user ?? null,
            });
          },
        );
      } catch (error) {
        console.error(
          "Failed to initialize authentication:",
          error,
        );
    
        set({
          initialized: true,
        });
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
        const normalizedEmail =
          email.trim().toLowerCase();

        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,

          options: {
            data: {
              first_name:
                firstName.trim(),
              last_name:
                lastName.trim(),
              phone: phone.trim(),
              currency: "NGN",
            },
          },
        });

        if (error) {
          throw error;
        }

        /*
         * Store the email locally so that if the
         * app is closed before verification, we can
         * send the user back to OTP verification.
         */
        await AsyncStorage.setItem(
          PENDING_VERIFICATION_EMAIL_KEY,
          normalizedEmail,
        );

        set({
          user: data.user,
          session: data.session,
          pendingVerificationEmail:
            normalizedEmail,
        });
      } finally {
        set({ loading: false });
      }
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
        } =
          await supabase.auth.signInWithPassword({
            email: email
              .trim()
              .toLowerCase(),
            password,
          });

        if (error) {
          throw error;
        }

        /*
        * The user has successfully signed in.
        * Mark onboarding as completed so old and
        * new users are not shown onboarding again.
        */
        await AsyncStorage.setItem(
          ONBOARDING_COMPLETED_KEY,
          "true",
        );

        await AsyncStorage.removeItem(
          PENDING_VERIFICATION_EMAIL_KEY,
        );

        set({
          user: data.user,
          session: data.session,
          pendingVerificationEmail: null,
        });
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
        } =
          await supabase.auth.verifyOtp({
            email: email
              .trim()
              .toLowerCase(),
            token: token.trim(),
            type,
          });

        if (error) {
          throw error;
        }

        /*
        * A successful signup verification means the
        * user has completed the initial account flow.
        */
        if (purpose === "signup") {
          await Promise.all([
            AsyncStorage.removeItem(
              PENDING_VERIFICATION_EMAIL_KEY,
            ),
            AsyncStorage.setItem(
              ONBOARDING_COMPLETED_KEY,
              "true",
            ),
          ]);
        }

        set({
          user: data.user,
          session: data.session,
          pendingVerificationEmail:
            purpose === "signup"
              ? null
              : email
                  .trim()
                  .toLowerCase(),
        });
      } finally {
        set({ loading: false });
      }
    },

    resendOtp: async (
      email,
      purpose,
    ) => {
      set({ loading: true });

      try {
        const normalizedEmail =
          email.trim().toLowerCase();

        if (purpose === "signup") {
          const { error } =
            await supabase.auth.resend({
              type: "signup",
              email: normalizedEmail,
            });

          if (error) {
            throw error;
          }

          await AsyncStorage.setItem(
            PENDING_VERIFICATION_EMAIL_KEY,
            normalizedEmail,
          );

          set({
            pendingVerificationEmail:
              normalizedEmail,
          });

          return;
        }

        const { error } =
          await supabase.auth.resetPasswordForEmail(
            normalizedEmail,
          );

        if (error) {
          throw error;
        }
      } finally {
        set({ loading: false });
      }
    },

    forgotPassword: async (
      email,
    ) => {
      set({ loading: true });

      try {
        const { error } =
          await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
          );

        if (error) {
          throw error;
        }
      } finally {
        set({ loading: false });
      }
    },

    updatePassword: async (
      password,
    ) => {
      set({ loading: true });

      try {
        const { error } =
          await supabase.auth.updateUser({
            password,
          });

        if (error) {
          throw error;
        }
      } finally {
        set({ loading: false });
      }
    },


    updateProfile: async ({
      firstName,
      lastName,
      phone,
      currency,
      avatarUrl,
    }) => {
      set({
        loading: true,
      });
    
      try {
        const {
          data,
          error,
        } = await supabase.auth.updateUser({
          data: {
            first_name:
              firstName.trim(),
    
            last_name:
              lastName.trim(),
    
            phone:
              phone.trim(),
    
            currency:
              currency
                .trim()
                .toUpperCase(),
    
            ...(avatarUrl !== undefined
              ? {
                  avatar_url:
                    avatarUrl,
                }
              : {}),
          },
        });
    
        if (error) {
          throw error;
        }
    
        /*
         * Immediately update Zustand with the
         * latest Supabase user.
         */
    
        set({
          user: data.user,
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    signOut: async () => {
      set({ loading: true });

      try {
        const { error } =
          await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        set({
          user: null,
          session: null,
        });
      } finally {
        set({ loading: false });
      }
    },
  }),
);