import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/firebaseService';
import { User, UserProfile, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sign up function
  const signUp = async (email: string, password: string, displayName = ''): Promise<UserCredential> => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name if provided
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Create initial user profile
      await userService.createOrUpdateProfile({
        email: result.user.email || '',
        displayName: displayName || result.user.email || '',
        createdAt: new Date(),
      });

      return result;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out function
  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    try {
      setError(null);
      await userService.createOrUpdateProfile(profileData);

      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const user: User | null = firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      } : null;

      setUser(user);

      if (user) {
        // Load user profile when authenticated
        try {
          const profile = await userService.getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setError('Failed to load user profile');
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Listen for profile changes when user is authenticated
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (user) {
      unsubscribe = userService.onProfileChange((profile: UserProfile | null) => {
        setUserProfile(profile);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    logout,
    resetPassword,
    updateUserProfile,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
