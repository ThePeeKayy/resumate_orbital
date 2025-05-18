'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '../../ui/components/PageWrapper';

export default function ProfileSetup() {
    const router = useRouter();

    return (
        <PageWrapper background="dark">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Complete Your Profile
                    </h1>
                    <p className="mt-3 text-xl text-gray-300">
                        Help us understand your background to provide tailored interview questions.
                    </p>
                </div>

                <div className="bg-gray-800 border border-gray-600 shadow-lg overflow-hidden sm:rounded-lg p-6">
                    <div className="text-center">
                        <div className="text-6xl text-gray-400 mb-4">🚧</div>
                        <h2 className="text-2xl font-semibold text-white mb-4">Profile Setup Coming Soon</h2>
                        <p className="text-gray-300 mb-6">
                            We're working on an amazing profile setup experience with AI-powered resume parsing and enhancement.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gradient-to-r from-gray-100 to-gray-400 hover:from-gray-200 hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}