import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ThemeProvider } from '@/lib/ThemeProvider';
import {
  SignedOut,
  SignedIn,
  UserButton,
  SignUpButton,
  SignInButton,
} from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Geist, Geist_Mono } from 'next/font/google';
import { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pohon Link',
  description: 'Manage your links in one place',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors'>
            <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
              {/* Main content */}
              <div className='flex-1 dark:bg-gray-900'>
                <header className='flex justify-between items-center p-4 gap-4 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center'></div>
                  <div className='flex items-center gap-4'>
                    <ThemeToggle />
                    <SignedOut>
                      <SignInButton />
                      <SignUpButton />
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </header>
                <main className='py-6 px-4 sm:px-6 md:px-8 md:py-8 dark:text-gray-100'>
                  {children}
                </main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
