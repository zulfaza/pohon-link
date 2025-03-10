import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Link as LinkType, UserProfile } from '@/types';
import Image from 'next/image';

interface PreviewLinksViewProps {
  links: LinkType[];
  profile: UserProfile | null;
  isLoading: boolean;
}

export function PreviewLinksView({
  links,
  profile,
  isLoading,
}: PreviewLinksViewProps) {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          Profile Not Found
        </h2>
        <p className='text-gray-500 dark:text-gray-300 mb-6'>
          Please set up your profile first before previewing your link page.
        </p>
        <Link href='/dashboard/profile'>
          <Button>Set Up Profile</Button>
        </Link>
      </div>
    );
  }

  const previewUrl = `/${profile.customUrl}`;

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
      <div className='flex justify-between items-center p-4 border-b dark:border-gray-700'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
          Preview
        </h2>
        <Link href={previewUrl} target='_blank' rel='noopener noreferrer'>
          <Button variant='outline' size='sm'>
            <ArrowTopRightOnSquareIcon className='h-4 w-4 mr-2' />
            Open Live
          </Button>
        </Link>
      </div>

      <div className='p-6 border-b dark:border-gray-700'>
        <div className='flex flex-col items-center'>
          <div className='w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400'>
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.title}
                className='w-full h-full rounded-full object-cover'
                width={80}
                height={80}
              />
            ) : (
              <span className='text-2xl font-bold'>
                {profile.title.charAt(0)}
              </span>
            )}
          </div>
          <h2 className='text-xl font-bold text-center dark:text-white'>
            {profile.title}
          </h2>
          {profile.bio && (
            <p className='text-gray-600 dark:text-gray-300 text-center mt-2 max-w-md'>
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <div className='p-6 max-h-[50vh] overflow-y-auto'>
        {links.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500 dark:text-gray-400 mb-4'>
              You haven&apos;t added any links yet.
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className='block w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-center font-medium transition-colors dark:text-white'
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
