import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { TreePine, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen bg-emerald-300'>
      <main className='flex-grow flex flex-col items-center justify-center px-4 py-16'>
        <div className='w-full max-w-md mx-auto flex flex-col items-center'>
          <div className='bg-white rounded-full p-4 shadow-md mb-6'>
            <TreePine size={40} className='text-emerald-600' />
          </div>

          {/* Title */}
          <section className='mb-12 text-center'>
            <h1 className='text-5xl font-bold text-white mb-2'>Pohon Link</h1>
            <p className='text-white text-lg'>
              Connect with us across platforms 🌳
            </p>
          </section>

          {/* Links */}
          <div className='w-full space-y-4'>
            <SignedOut>
              <SignInButton>
                <button className='font-semibold text-gray-600 block bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white w-full text-center'>
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                className='font-semibold text-gray-600 block bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white w-full text-center'
                href='/dashboard'
              >
                Go to Dashboard
              </Link>
              <SignOutButton>
                <button className='font-semibold text-gray-600 block bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white w-full text-center'>
                  Sign out
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-4 text-center text-white'>
        <p>&copy; 2024 Pohon Link. All rights reserved.</p>
      </footer>
    </div>
  );
}
