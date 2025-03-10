import React from 'react';
import ProfileForm from '../ProfileForm';
import { UserProfile } from '@/types';

interface ProfileViewProps {
  profile: UserProfile | null;
  handleProfileSubmit: (data: {
    title: string;
    customUrl: string;
    bio: string | null;
    theme: 'light' | 'dark';
  }) => Promise<void>;
  isProfileFormSubmitting: boolean;
  checkCustomUrlAvailability: (url: string) => Promise<boolean>;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  handleProfileSubmit,
  isProfileFormSubmitting,
  checkCustomUrlAvailability,
}) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
        Profile Settings
      </h2>
      <ProfileForm
        initialData={profile || undefined}
        onSubmit={handleProfileSubmit}
        isSubmitting={isProfileFormSubmitting}
        checkCustomUrlAvailability={checkCustomUrlAvailability}
      />
    </div>
  );
};

export default ProfileView;
