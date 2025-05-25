// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./ui/NavBar/Nav";
import { AuthProvider } from "./ui/Context/AuthContext";
import ToastProvider from "./ui/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "resuMate - Interview & Job AI Assistant",
  description: "Prepare for interviews with AI-powered practice sessions, track job applications, and get personalized feedback to improve your interview skills.",
  keywords: ["interview preparation", "job search", "AI assistant", "career development", "interview practice"],
  authors: [{ name: "resuMate Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Additional meta tags for better mobile experience */}
        <meta name="theme-color" content="#374151" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="resuMate" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/geist-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-gray-700 min-h-screen">
        <AuthProvider>
          <ToastProvider />
          
          {/* App structure with proper layout */}
          <div className="min-h-screen flex flex-col">
            {/* Fixed navbar container */}
            <div className="fixed top-0 left-0 right-0 z-50 w-full">
              <Nav />
            </div>
            
            {/* Main content area with proper spacing */}
            <main className="flex-1 pt-16">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}