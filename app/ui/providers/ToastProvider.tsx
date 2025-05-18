'use client'

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#00D260',
                        secondary: '#FFFAEE',
                    },
                },
                error: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#FF4B4B',
                        secondary: '#FFFAEE',
                    },
                },
            }}
        />
    );
}