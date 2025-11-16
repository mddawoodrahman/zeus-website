import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  Session,
  AuthError as SupabaseAuthError,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: SupabaseAuthError | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: SupabaseAuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string,
  ) => Promise<{ error: SupabaseAuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data?.user) {
        toast.success(
          "Account created successfully! Please check your email to verify your account.",
        );
      }

      return { error: null };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign up";
      toast.error(message);
      return {
        error: {
          message,
          name: "SignUpError",
          status: 500,
        } as SupabaseAuthError,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data?.user) {
        toast.success("Welcome back!");
      }

      return { error: null };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign in";
      toast.error(message);
      return {
        error: {
          message,
          name: "SignInError",
          status: 500,
        } as SupabaseAuthError,
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed out successfully");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign out";
      toast.error(message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success("Password reset email sent! Please check your inbox.");
      return { error: null };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      return {
        error: {
          message,
          name: "ResetPasswordError",
          status: 500,
        } as SupabaseAuthError,
      };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
