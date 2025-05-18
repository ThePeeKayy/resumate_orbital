'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';
import { getUserProfile } from '../../Services/firebase/firestore';
import toast from 'react-hot-toast';

interface ProfileCheckProps {
    children: React.ReactNode;
}

export default function ProfileCheck({ children }: ProfileCheckProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            if (!currentUser) return;

            try {
                const profile = await getUserProfile(currentUser.uid);
                setHasProfile(!!profile);
            } catch (error) {
                console.error('Error checking profile:', error);
                setHasProfile(false);
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    // Redirect to profile setup if user doesn't have a profile
    if (hasProfile === false) {
        toast('Please complete your profile before accessing this feature');
        router.push('/profile/setup');
        return null;
    }

    return <>{children}</>;
}