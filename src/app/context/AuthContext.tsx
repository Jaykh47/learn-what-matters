'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase'; // Or use '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore';

// Define the shape of our user profile data from Firestore
interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'author';
}

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null; // CHANGED: Added userProfile state
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true });

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // CHANGED: Added state for profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // CHANGED: Fetch user profile from Firestore if user is logged in
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, userProfile, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};