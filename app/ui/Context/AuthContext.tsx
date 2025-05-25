// app/ui/Context/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    UserCredential
} from 'firebase/auth';
import { auth, db } from '../../Services/firebase/config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getUserProfile } from '../../Services/firebase/firestore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    profileComplete: boolean;
    profileLoading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    refreshProfileStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    // Check profile completion status
    const checkProfileCompletion = async (user: User) => {
        if (!user) {
            setProfileComplete(false);
            setProfileLoading(false);
            return;
        }

        try {
            const profile = await getUserProfile(user.uid);
            const isComplete = !!profile && !!profile.name && !!profile.email;
            setProfileComplete(isComplete);
        } catch (error) {
            console.error('Error checking profile completion:', error);
            setProfileComplete(false);
        } finally {
            setProfileLoading(false);
        }
    };

    // Refresh profile status (for use after profile creation/update)
    const refreshProfileStatus = async () => {
        if (currentUser) {
            await checkProfileCompletion(currentUser);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
            
            if (user) {
                setProfileLoading(true);
                await checkProfileCompletion(user);
            } else {
                setProfileComplete(false);
                setProfileLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const register = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create initial user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            createdAt: serverTimestamp(),
            isProfileComplete: false
        });

        // Profile is not complete for new users
        setProfileComplete(false);
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        setProfileComplete(false);
        setProfileLoading(false);
        return signOut(auth);
    };

    const resetPassword = (email: string) => {
        return sendPasswordResetEmail(auth, email);
    };

    const value = {
        currentUser,
        loading,
        profileComplete,
        profileLoading,
        register,
        login,
        logout,
        resetPassword,
        refreshProfileStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};