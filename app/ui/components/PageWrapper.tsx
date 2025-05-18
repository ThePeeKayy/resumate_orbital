'use client'

import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    fullHeight?: boolean;
    className?: string;
    background?: 'gray' | 'white' | 'dark';
}

export default function PageWrapper({ 
    children, 
    fullHeight = false, 
    className = '',
    background = 'gray'
}: PageWrapperProps) {
    const backgroundClasses = {
        gray: 'bg-gray-100',
        white: 'bg-white',
        dark: 'bg-gray-700'
    };

    return (
        <div className={`
            ${fullHeight ? 'min-h-screen' : 'min-h-[calc(100vh-4rem)]'} 
            ${backgroundClasses[background]}
            pt-16 
            ${className}
        `}>
            {children}
        </div>
    );
}