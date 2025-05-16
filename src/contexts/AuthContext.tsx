
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Profile, withTimeout } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AuthError, Session } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authActionInProgress, setAuthActionInProgress] = useState(false);
  const { toast } = useToast();

  // Initial session check
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await withTimeout(supabase.auth.getSession());
        
        if (error) {
          throw error;
        }
        
        if (session) {
          setSession(session);
          await fetchUserProfile(session);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof AuthError) {
          console.error('Error fetching session:', error.message);
        } else {
          console.error('Error or timeout fetching session:', error);
        }
        setUser(null);
        setLoading(false);
      }
    };
    getSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);
      setSession(session);
      
      if (session) {
        try {
          await fetchUserProfile(session);
        } catch (error) {
          console.error('Error during auth state change:', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the profiles table
  const fetchUserProfile = async (session: Session) => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
      );

      if (error) {
        throw error;
      }

      if (data) {
        // Check if this is the admin email and ensure admin role is set
        if (session.user.email?.toLowerCase() === 'admin@cyberlawshub.com' && data.role !== 'admin') {
          // Update the admin role in the database
          await withTimeout(
            supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', session.user.id)
          );
          
          // Set user with admin role
          setUser({ ...data, role: 'admin' } as Profile);
        } else {
          setUser(data as Profile);
        }
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(session.user.id, session.user.email || '');
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      toast({
        title: "Profile Error",
        description: "There was a problem loading your profile. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false); // Ensure loading is always set to false after fetch attempt
    }
  };

  // Create a new profile record
  const createUserProfile = async (userId: string, email: string) => {
    try {
      const username = email.split('@')[0];
      // Set admin role if the email matches the admin email
      const isAdmin = email.toLowerCase() === 'admin@cyberlawshub.com';
      
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .insert({
            id: userId,
            username: username,
            full_name: isAdmin ? 'System Administrator' : '',
            bio: isAdmin ? 'System administrator for Cyber Law Hub' : '',
            avatar_url: '',
            role: isAdmin ? 'admin' : 'user'
          })
          .select()
          .single()
      );

      if (error) {
        throw error;
      }

      if (data) {
        setUser(data as Profile);
      }
    } catch (error: any) {
      console.error('Error creating user profile:', error.message);
      toast({
        title: "Profile Error",
        description: "There was a problem creating your profile. Please try again or refresh the page.",
        variant: "destructive"
      });
    }
  };

  // Auth functions
  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    try {
      if (authActionInProgress) return;
      setAuthActionInProgress(true);
      setLoading(true);
      
      const { data, error } = await withTimeout(supabase.auth.signUp({ email, password }));
      
      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data.user) {
        // Check if this is the admin account
        const isAdmin = email.toLowerCase() === 'admin@cyberlawshub.com';
        
        // Create profile with user-provided details
        await withTimeout(
          supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: username,
              full_name: fullName,
              bio: isAdmin ? 'System administrator for Cyber Law Hub' : '',
              avatar_url: '',
              role: isAdmin ? 'admin' : 'user'
            })
        );

        toast({
          title: "Success!",
          description: "Your account has been created.",
        });
      }
    } catch (error: any) {
      console.error('Error during sign up:', error.message);
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during sign up. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setAuthActionInProgress(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (authActionInProgress) return;
      setAuthActionInProgress(true);
      setLoading(true);
      
      const { error, data } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password })
      );
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // Fetch user profile to get role information
      if (data.user) {
        const isAdmin = email.toLowerCase() === 'admin@cyberlawshub.com';
        
        const { data: profileData, error: profileError } = await withTimeout(
          supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
        );
          
        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          
          // If no profile exists, create one with appropriate role
          await createUserProfile(data.user.id, email);
        } else if (profileData) {
          // Update admin status if needed
          if (isAdmin && profileData.role !== 'admin') {
            await withTimeout(
              supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', data.user.id)
            );
              
            // Update local user state
            setUser({ ...profileData, role: 'admin' });
          } else {
            setUser(profileData as Profile);
          }
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Error during sign in:', error.message);
      toast({
        title: "Sign In Failed",
        description: error.message || "An error occurred during sign in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setAuthActionInProgress(false);
    }
  };

  const signOut = async () => {
    try {
      if (authActionInProgress) return;
      setAuthActionInProgress(true);
      setLoading(true);
      
      // Clear user state first to prevent UI issues
      setUser(null);
      
      const { error } = await withTimeout(supabase.auth.signOut());
      
      if (error) {
        throw error;
      }
      
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You have been logged out.",
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setAuthActionInProgress(false);
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    try {
      if (!session?.user || authActionInProgress) return;

      setAuthActionInProgress(true);
      
      // Create a dedicated variable for profile update loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          setAuthActionInProgress(false);
          reject(new Error('Profile update timed out'));
        }, 8000); // 8 second timeout
      });
      
      const updatePromise = supabase
        .from('profiles')
        .update(profile)
        .eq('id', session.user.id);
      
      // Race the promises to ensure we don't get stuck
      const { error } = await Promise.race([updatePromise, timeoutPromise]) as any;

      if (error) {
        throw error;
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast({
        title: "Error updating profile",
        description: error.message || "Profile update failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAuthActionInProgress(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
