import React from 'react';
import { notFound } from 'next/navigation';
import { getUserProfileByCustomUrl, getLinksByUserId } from '@/lib/firestore';
import { Metadata } from 'next';

interface LinkPageProps {
  params: {
    customUrl: string;
  };
}

export async function generateMetadata({
  params,
}: LinkPageProps): Promise<Metadata> {
  const { customUrl } = params;
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

  const isDarkMode = profile.theme === 'dark';

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
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.title}
                className='w-full h-full rounded-full object-cover'
              />
            ) : (
              <span className='text-3xl font-bold'>
                {profile.title.charAt(0)}
              </span>
            )}
          </div>
          <h1 className='text-2xl font-bold text-center'>{profile.title}</h1>
          {profile.bio && (
            <p
              className={`text-center mt-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {profile.bio}
            </p>
          )}
        </div>

        <div className='space-y-3'>
          {links.length === 0 ? (
            <div className='text-center py-8'>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                No links available.
              </p>
            </div>
          ) : (
            links.map((link) => (
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
