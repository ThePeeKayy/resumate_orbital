'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../ui/Context/AuthContext';
import { getJobs } from '../Services/firebase/firestore';
import { Job, JobStatus } from '../types';
import toast from 'react-hot-toast';
import PrivateRoute from '../ui/components/PrivateRoute';
import ProfileCheck from '../ui/components/ProfileCheck';
import { getCardClasses } from '../ui/styles/theme';

interface JobItemProps {
    job: Job;
}

function JobItem({ job }: JobItemProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Drafted':
                return 'bg-blue-100 text-blue-800';
            case 'Submitted':
                return 'bg-yellow-100 text-yellow-800';
            case 'Interviewing':
                return 'bg-purple-100 text-purple-800';
            case 'Offer':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date: any) => {
        // Check if date is a Firebase timestamp (has seconds and nanoseconds)
        if (date && typeof date === 'object' && date.seconds !== undefined) {
            // Convert Firebase timestamp to JS Date
            return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
        
        // Try parsing as a regular date if it's a string or number
        if (date) {
            const jsDate = new Date(date);
            if (!isNaN(jsDate.getTime())) {
                return jsDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                });
            }
        }
        
        // Fallback if date is invalid
        return 'Date not available';
    };

    return (
        <Link
            href={`/jobs/${job.id}`}
            className="block hover:shadow-lg transition-shadow duration-200"
        >
            <div className={`${getCardClasses()} divide-y divide-gray-600 h-full hover:border-blue-500/40`}>
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-white truncate">{job.title}</h3>
                        <p className="mt-1 text-sm text-gray-300">{job.company}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                    </span>
                </div>
                <div className="px-4 py-4 sm:px-6">
                    <div className="text-sm text-gray-400 mb-2">
                        Added on {formatDate(job.createdAt)}
                    </div>
                    <div className="text-sm text-gray-300 line-clamp-3">
                        {job.description ? job.description.substring(0, 150) + (job.description.length > 150 ? '...' : '') : 'No description provided'}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function JobTracker() {
    const { currentUser } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<JobStatus | 'All'>('All');

    useEffect(() => {
        const fetchJobs = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const userJobs = await getJobs(currentUser.uid);
                setJobs(userJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast.error('Failed to load your jobs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [currentUser]);

    const filteredJobs = filter === 'All'
        ? jobs
        : jobs.filter(job => job.status === filter);

    const jobStatusCounts = jobs.reduce((counts, job) => {
        counts[job.status] = (counts[job.status] || 0) + 1;
        return counts;
    }, {} as Record<JobStatus, number>);

    const totalJobs = jobs.length;

    if (loading && jobs.length === 0) {
        return (
            <PrivateRoute>
                <ProfileCheck>
                    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
                    </div>
                </ProfileCheck>
            </PrivateRoute>
        );
    }

    return (
        <PrivateRoute>
            <ProfileCheck>
                <div className="min-h-screen bg-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white">Job Tracker</h1>
                            <Link
                                href="/jobs/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Add New Job
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className={`${getCardClasses()} mb-6`}>
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-lg font-medium text-white mb-4">Job Application Overview</h2>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="bg-gray-600 border border-gray-500 overflow-hidden shadow rounded-lg hover:border-gray-400 transition-all duration-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <dt className="text-sm font-medium text-gray-300 truncate">Total Jobs</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-white">{totalJobs}</dd>
                                        </div>
                                    </div>
                                    <div className="bg-blue-900/20 border border-blue-600/30 overflow-hidden shadow rounded-lg hover:border-blue-600/50 transition-all duration-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <dt className="text-sm font-medium text-blue-200 truncate">Drafted</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-white">{jobStatusCounts.Drafted || 0}</dd>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-900/20 border border-yellow-600/30 overflow-hidden shadow rounded-lg hover:border-yellow-600/50 transition-all duration-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <dt className="text-sm font-medium text-yellow-200 truncate">Submitted</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-white">{jobStatusCounts.Submitted || 0}</dd>
                                        </div>
                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-600/30 overflow-hidden shadow rounded-lg hover:border-purple-600/50 transition-all duration-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <dt className="text-sm font-medium text-purple-200 truncate">Interviewing</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-white">{jobStatusCounts.Interviewing || 0}</dd>
                                        </div>
                                    </div>
                                    <div className="bg-green-900/20 border border-green-600/30 overflow-hidden shadow rounded-lg hover:border-green-600/50 transition-all duration-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <dt className="text-sm font-medium text-green-200 truncate">Offers</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-white">{jobStatusCounts.Offer || 0}</dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className={`${getCardClasses()} mb-6`}>
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilter('All')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'All'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        All Jobs ({totalJobs})
                                    </button>
                                    <button
                                        onClick={() => setFilter('Drafted')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Drafted'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Drafted ({jobStatusCounts.Drafted || 0})
                                    </button>
                                    <button
                                        onClick={() => setFilter('Submitted')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Submitted'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Submitted ({jobStatusCounts.Submitted || 0})
                                    </button>
                                    <button
                                        onClick={() => setFilter('Interviewing')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Interviewing'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Interviewing ({jobStatusCounts.Interviewing || 0})
                                    </button>
                                    <button
                                        onClick={() => setFilter('Offer')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Offer'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Offers ({jobStatusCounts.Offer || 0})
                                    </button>
                                    <button
                                        onClick={() => setFilter('Rejected')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Rejected'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Rejected ({jobStatusCounts.Rejected || 0})
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Job list */}
                        {filteredJobs.length === 0 ? (
                            <div className={`${getCardClasses()} p-6 text-center`}>
                                <h3 className="text-lg font-medium text-white mb-2">No jobs found</h3>
                                {jobs.length > 0 ? (
                                    <p className="text-gray-400">
                                        No jobs match your current filter. Try selecting a different status filter.
                                    </p>
                                ) : (
                                    <p className="text-gray-400">
                                        You haven't added any jobs yet. Click the "Add New Job" button to get started.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredJobs.map((job) => (
                                    <JobItem key={job.id} job={job} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </ProfileCheck>
        </PrivateRoute>
    );
}