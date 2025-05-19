// app/dashboard/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../ui/Context/AuthContext';
import { getUserProfile, getAnswers, getJobs } from '../Services/firebase/firestore';
import { UserProfile, Answer, Job } from '../types';
import toast from 'react-hot-toast';
import { getCardClasses } from '../ui/styles/theme';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [recentAnswers, setRecentAnswers] = useState<Answer[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
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

                // Fetch recent answers
                const allAnswers = await getAnswers(currentUser.uid);
                setRecentAnswers(allAnswers.slice(0, 5)); // Get 5 most recent

                // Fetch jobs
                const userJobs = await getJobs(currentUser.uid);
                setJobs(userJobs);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser, router]);

    // Get job name by ID
    const getJobName = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        return job ? `${job.title} at ${job.company}` : 'Unknown Job';
    };

    // Get category badge color
    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'Motivational':
                return 'bg-green-100 text-green-800';
            case 'Behavioral':
                return 'bg-blue-100 text-blue-800';
            case 'Technical':
                return 'bg-purple-100 text-purple-800';
            case 'Personality':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-700 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Welcome, {profile?.name}!</h1>
                    <p className="mt-1 text-gray-300">Your interview preparation dashboard</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Quick actions card - with blue accent */}
                    <div className={`${getCardClasses()} hover:border-blue-500/40 transition-all duration-200`}>
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
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

                    {/* Recent answers card */}
                    <div className={`${getCardClasses()} hover:border-purple-500/40 transition-all duration-200`}>
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-medium text-white">Recent Answers</h2>
                                <p className="mt-1 text-sm text-gray-400">Your latest practice responses</p>
                            </div>
                            <button
                                onClick={() => router.push('/answers')}
                                className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                            >
                                View all
                                <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="border-t border-gray-600 px-4 py-5 sm:p-0">
                            {recentAnswers.length === 0 ? (
                                <div className="px-4 py-5 sm:px-6 text-center">
                                    <p className="text-sm text-gray-400">You haven't saved any answers yet.</p>
                                    <button
                                        onClick={() => router.push('/practice/setup')}
                                        className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                                    >
                                        Start practicing
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-600">
                                    {recentAnswers.map((answer) => (
                                        <li key={answer.id} className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center mb-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(answer.category)}`}>
                                                    {answer.category}
                                                </span>
                                                {answer.jobId && (
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        {getJobName(answer.jobId)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-white truncate">{answer.questionText}</p>
                                            <p className="mt-1 text-sm text-gray-400 line-clamp-2">{answer.answerText}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Job applications card */}
                    <div className={`${getCardClasses()} hover:border-green-500/40 transition-all duration-200`}>
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-medium text-white">Job Applications</h2>
                                <p className="mt-1 text-sm text-gray-400">Track your job search progress</p>
                            </div>
                            <button
                                onClick={() => router.push('/jobs')}
                                className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                            >
                                View all
                                <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="border-t border-gray-600 px-4 py-5 sm:p-0">
                            {jobs.length === 0 ? (
                                <div className="px-4 py-5 sm:px-6 text-center">
                                    <p className="text-sm text-gray-400">You haven't added any jobs yet.</p>
                                    <button
                                        onClick={() => router.push('/jobs/new')}
                                        className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                    >
                                        Add job
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-600">
                                    {jobs.slice(0, 5).map((job) => (
                                        <li key={job.id} className="px-4 py-4 sm:px-6">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{job.title}</p>
                                                    <p className="text-sm text-gray-400">{job.company}</p>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    job.status === 'Drafted' ? 'bg-blue-100 text-blue-800' :
                                                    job.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                    job.status === 'Interviewing' ? 'bg-purple-100 text-purple-800' :
                                                    job.status === 'Offer' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats card */}
                <div className={`mt-8 ${getCardClasses()}`}>
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-white mb-4">Your Progress</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-900/20 border border-blue-600/30 overflow-hidden shadow rounded-lg hover:border-blue-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-blue-200 truncate">Total Answers</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">{recentAnswers.length}</dd>
                                </div>
                            </div>
                            <div className="bg-purple-900/20 border border-purple-600/30 overflow-hidden shadow rounded-lg hover:border-purple-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-purple-200 truncate">Jobs Tracked</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">{jobs.length}</dd>
                                </div>
                            </div>
                            <div className="bg-indigo-900/20 border border-indigo-600/30 overflow-hidden shadow rounded-lg hover:border-indigo-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-indigo-200 truncate">Job Interviews</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">
                                        {jobs.filter(job => job.status === 'Interviewing').length}
                                    </dd>
                                </div>
                            </div>
                            <div className="bg-green-900/20 border border-green-600/30 overflow-hidden shadow rounded-lg hover:border-green-600/50 transition-all duration-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-green-200 truncate">Job Offers</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">
                                        {jobs.filter(job => job.status === 'Offer').length}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}