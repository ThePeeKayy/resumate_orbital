// app/dashboard/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../ui/Context/AuthContext';
import { getUserProfile } from '../Services/firebase/firestore';
import { UserProfile } from '../types';
import toast from 'react-hot-toast';
import PageWrapper from '../ui/components/PageWrapper';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);

                // Fetch user profile
                const userProfile = await getUserProfile(currentUser.uid);
                setProfile(userProfile);

                // Check if profile is complete, if not redirect to profile setup
                if (!userProfile) {
                    toast('Please complete your profile before proceeding');
                    router.push('/profile/setup');
                    return;
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser, router]);

    if (loading) {
        return (
            <PageWrapper background="dark" className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper background="dark" className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Welcome, {profile?.name || 'User'}!</h1>
                    <p className="mt-1 text-gray-300">Your interview preparation dashboard</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Quick actions card - with blue accent */}
                    <div className="bg-gray-800 border border-blue-500/20 shadow-lg overflow-hidden sm:rounded-lg hover:border-blue-500/40 transition-all duration-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="ml-3 text-lg font-medium text-white">Quick Actions</h2>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/practice/setup')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    Start Practice Session
                                </button>
                                <button
                                    onClick={() => router.push('/jobs/new')}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                                >
                                    Add New Job
                                </button>
                                <button
                                    onClick={() => router.push('/profile')}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent answers card - with purple accent */}
                    <div className="bg-gray-800 border border-purple-500/20 shadow-lg overflow-hidden sm:rounded-lg hover:border-purple-500/40 transition-all duration-200">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h2 className="text-lg font-medium text-white">Recent Answers</h2>
                                    <p className="text-sm text-gray-400">Your latest practice responses</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-600 px-4 py-5 sm:p-0">
                            <div className="px-4 py-5 sm:px-6 text-center">
                                <p className="text-sm text-gray-400">You haven't saved any answers yet.</p>
                                <button
                                    onClick={() => router.push('/practice/setup')}
                                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                                >
                                    Start practicing
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job applications card - with green accent */}
                    <div className="bg-gray-800 border border-green-500/20 shadow-lg overflow-hidden sm:rounded-lg hover:border-green-500/40 transition-all duration-200">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h2 className="text-lg font-medium text-white">Job Applications</h2>
                                    <p className="text-sm text-gray-400">Track your job search progress</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-600 px-4 py-5 sm:p-0">
                            <div className="px-4 py-5 sm:px-6 text-center">
                                <p className="text-sm text-gray-400">You haven't added any jobs yet.</p>
                                <button
                                    onClick={() => router.push('/jobs/new')}
                                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                >
                                    Add job
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats card - with gradient border */}
                <div className="mt-8 bg-gray-800 border border-gray-600 shadow-lg overflow-hidden sm:rounded-lg relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 rounded-lg"></div>
                    <div className="relative px-4 py-5 sm:p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="ml-3 text-lg font-medium text-white">Your Progress</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-900/20 border border-blue-600/30 overflow-hidden shadow rounded-lg hover:border-blue-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-blue-200 truncate">Total Answers</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">0</dd>
                                </div>
                            </div>
                            <div className="bg-purple-900/20 border border-purple-600/30 overflow-hidden shadow rounded-lg hover:border-purple-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-purple-200 truncate">Jobs Tracked</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">0</dd>
                                </div>
                            </div>
                            <div className="bg-indigo-900/20 border border-indigo-600/30 overflow-hidden shadow rounded-lg hover:border-indigo-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-indigo-200 truncate">Job Interviews</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">0</dd>
                                </div>
                            </div>
                            <div className="bg-green-900/20 border border-green-600/30 overflow-hidden shadow rounded-lg hover:border-green-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-green-200 truncate">Job Offers</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">0</dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}