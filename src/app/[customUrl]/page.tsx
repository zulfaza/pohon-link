import React from 'react';
import { notFound } from 'next/navigation';
import { getUserProfileByCustomUrl, getLinksByUserId } from '@/lib/actions';
import { Metadata } from 'next';
import { Link, UserProfile } from '@/types';
import Image from 'next/image';

// Helper function to parse dates from ISO strings
const parseDates = (obj: unknown): unknown => {
  if (!obj) return obj;

  if (
    typeof obj === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)
  ) {
    return new Date(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => parseDates(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = parseDates(value);
    }
    return result;
  }

  return obj;
};

interface LinkPageProps {
  params: Promise<{
    customUrl: string;
  }>;
}

export async function generateMetadata({
  params,
}: LinkPageProps): Promise<Metadata> {
  const { customUrl } = await params;
  const profile = await getUserProfileByCustomUrl(customUrl);

  if (!profile) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: profile.title,
    description: profile.bio || `${profile.title}'s links`,
  };
}

export default async function LinkPage({ params }: LinkPageProps) {
  const { customUrl } = await params;
  const profile = await getUserProfileByCustomUrl(customUrl);

  if (!profile) {
    notFound();
  }

  const links = await getLinksByUserId(profile.userId);

  // Parse dates from ISO strings
  const parsedProfile = parseDates(profile) as UserProfile;
  const parsedLinks = parseDates(links) as Link[];

  const isDarkMode = parsedProfile.theme === 'dark';

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className='max-w-md mx-auto px-4 py-16'>
        <div className='flex flex-col items-center mb-8'>
          <div
            className={`w-24 h-24 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            } rounded-full mb-4 flex items-center justify-center ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            {parsedProfile.avatarUrl ? (
              <Image
                width={80}
                height={80}
                src={parsedProfile.avatarUrl}
                alt={parsedProfile.title}
                className='w-full h-full rounded-full object-cover'
              />
            ) : (
              <span className='text-3xl font-bold'>
                {parsedProfile.title.charAt(0)}
              </span>
            )}
          </div>
          <h1 className='text-2xl font-bold text-center'>
            {parsedProfile.title}
          </h1>
          {parsedProfile.bio && (
            <p
              className={`text-center mt-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {parsedProfile.bio}
            </p>
          )}
        </div>

        <div className='space-y-3'>
          {parsedLinks.length === 0 ? (
            <div className='text-center py-8'>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                No links available.
              </p>
            </div>
          ) : (
            parsedLinks.map((link: Link) => (
              <a
                key={link.id}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className={`block w-full p-4 rounded-lg text-center font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {link.title}
              </a>
            ))
          )}
        </div>

        <div className='mt-12 text-center'>
          <p
            className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            Powered by Pohon Link
          </p>
        </div>
      </div>
    </div>
  );
}
