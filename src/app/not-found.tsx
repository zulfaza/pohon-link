import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-16'>
      <div className='text-center max-w-md'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          Page Not Found
        </h2>
        <p className='text-gray-600 mb-8'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link href='/'>
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
