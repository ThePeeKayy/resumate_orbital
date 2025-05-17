'use client'

import { usePathname } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import biglogo from '../../../public/logolong.png'
import smalllogo from '../../../public/logoshort.png'
import { useAuth } from '../Context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Interview', href: '/invterview', current: false },
  { name: 'Applications', href: '/applications', current: false },
]

export default function Nav() {
    const { currentUser, logout } = useAuth();
    const router = useRouter()
    function classNames(...classes : any) {
        return classes.filter(Boolean).join(' ')
    }
    const pathname = usePathname()
    const getPagePath = (string:String) : String=> {
    const newstring = string?.slice(1,-1)
    const index = newstring.indexOf('/')
    return newstring.slice(0, index)
  }

    return(
        <nav className="">
            <div className="flex space-x-4 bg-[#1d1b1b] p-4 justify-between">
                <div className="max-w-[90%] flex flex-row">
                    <Link href="/">
                    <Image src={smalllogo} width={80} height={50} className="my-1 md:hidden block" alt ="" />
                    <Image src={biglogo} width={270} height={50} className="hidden md:block" alt ="" />
                    </Link>
                    <div className="flex flex-row space-x-4 p-3">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                        getPagePath(pathname) == getPagePath(item.href)
                                        ? 'bg-gray-600 text-gray-300'
                                        : 'text-gray-500 hover:bg-gray-600 hover:text-gray-300',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )}
                        >
                            {item.name}
                        </a>
                    ))}
                    </div>
                    
                </div>
                {currentUser ? <button
                        key="sign-out"
                        className=""
                        onClick={async () => {
                    await logout();
                    router.push('/');
                    }}
                    >
                    Logout
                </button>:<button
                        key="sign-in"
                        className="gap-x-3 rounded-md text-sm font-semibold my-3 px-3 bg-white leading-6 hover:bg-gray-600 hover:text-gray-300 text-gray-600"
                        onClick={() => router.push('/login')}
                    >
                    Login
                </button>}
              </div>
        </nav>
    )
}