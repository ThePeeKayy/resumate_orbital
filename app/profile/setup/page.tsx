'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 pt-20">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Complete Your Profile
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Help us understand your background to provide tailored interview questions.
                    </p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <div className="text-center">
                        <div className="text-6xl text-gray-400 mb-4">🚧</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Setup Coming Soon</h2>
                        <p className="text-gray-600 mb-6">
                            We're working on an amazing profile setup experience with AI-powered resume parsing and enhancement.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}