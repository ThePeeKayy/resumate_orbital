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
      <PageWrapper className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.name || 'User'}!</h1>
          <p className="mt-1 text-gray-500">Your interview preparation dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick actions card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/practice/setup')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Practice Session
                </button>
                <button
                  onClick={() => router.push('/jobs/new')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add New Job
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Coming soon cards */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Answers</h2>
              <p className="mt-1 text-sm text-gray-500">Your latest practice responses</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-sm text-gray-500">You haven't saved any answers yet.</p>
                <button
                  onClick={() => router.push('/practice/setup')}
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start practicing
                </button>
              </div>
            </div>
          </div>
          
          {/* Job applications card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Job Applications</h2>
              <p className="mt-1 text-sm text-gray-500">Track your job search progress</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-sm text-gray-500">You haven't added any jobs yet.</p>
                <button
                  onClick={() => router.push('/jobs/new')}
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add job
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats card */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Answers</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Jobs Tracked</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Job Interviews</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Job Offers</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}