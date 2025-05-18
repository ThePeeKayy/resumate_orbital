'use client'

import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import biglogo from '../../../public/logolong.png'
import smalllogo from '../../../public/logoshort.png'
import { useAuth } from '../Context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Practice', href: '/practice/setup', current: false },
  { name: 'Answers', href: '/answers', current: false },
  { name: 'Jobs', href: '/jobs', current: false },
  { name: 'Profile', href: '/profile', current: false },
]

export default function Nav() {
    const { currentUser, logout } = useAuth();
    const router = useRouter()
    
    function classNames(...classes : any) {
        return classes.filter(Boolean).join(' ')
    }
    
    const pathname = usePathname()
    
    const getPagePath = (string: string): string => {
        if (!string || string.length < 2) return '';
        const newstring = string.slice(1);
        const index = newstring.indexOf('/');
        return index === -1 ? newstring : newstring.slice(0, index);
    }

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Don't show navigation items on login/register pages
    const isAuthPage = pathname === '/login' || pathname === '/register';

    return(
        // Added h-16 to fix the navbar height and make it consistent
        <nav className="h-16">
            <div className="flex space-x-4 bg-[#1d1b1b] p-4 justify-between h-full items-center">
                <div className="max-w-[90%] flex flex-row items-center">
                    <Link href="/">
                        <Image src={smalllogo} width={80} height={50} className="my-1 md:hidden block" alt="Logo" />
                        <Image src={biglogo} width={270} height={50} className="hidden md:block" alt="Logo" />
                    </Link>
                    {currentUser && !isAuthPage && (
                        <div className="flex flex-row space-x-4 p-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        getPagePath(pathname) === getPagePath(item.href)
                                            ? 'bg-gray-600 text-gray-300'
                                            : 'text-gray-500 hover:bg-gray-600 hover:text-gray-300',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Only show auth buttons on certain pages */}
                {!isAuthPage && (
                    <div className="flex items-center">
                        {currentUser ? (
                            <button
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                className="bg-gradient-to-r from-gray-100 to-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-full hover:from-gray-200 hover:to-gray-500 transition-all duration-200 transform hover:scale-105"
                                onClick={() => router.push('/login')}
                            >
                                Login
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}