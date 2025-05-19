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
  title: "resuMate",
  description: "Interview and Job AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider />
          {/* Fixed navbar container */}
          <div className="fixed top-0 left-0 right-0 z-50 w-full">
            <Nav />
          </div>
          {/* Main content area with proper spacing */}
          <main className="min-h-screen-safe">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}