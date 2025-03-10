import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserProfile } from '@/types';

interface ProfileFormProps {
  initialData?: Partial<UserProfile>;
  onSubmit: (data: {
    title: string;
    customUrl: string;
    bio: string | null;
    theme: 'light' | 'dark';
  }) => Promise<void>;
  isSubmitting: boolean;
  checkCustomUrlAvailability: (url: string) => Promise<boolean>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  checkCustomUrlAvailability,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [customUrl, setCustomUrl] = useState(initialData?.customUrl || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [errors, setErrors] = useState<{
    title?: string;
    customUrl?: string;
    bio?: string;
  }>({});
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(initialData?.theme === 'dark');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCustomUrl(initialData.customUrl || '');
      setBio(initialData.bio || '');
      setIsDarkMode(initialData.theme === 'dark');
    }
  }, [initialData]);

  const validateCustomUrl = async (url: string) => {
    if (!url.trim()) {
      setErrors((prev) => ({ ...prev, customUrl: 'Custom URL is required' }));
      return false;
    }

    // Check if URL contains only alphanumeric characters, hyphens, and underscores
    if (!/^[a-zA-Z0-9-_]+$/.test(url)) {
      setErrors((prev) => ({
        ...prev,
        customUrl:
          'Custom URL can only contain letters, numbers, hyphens, and underscores',
      }));
      return false;
    }

    // Check if URL is available (only if it's different from the initial URL)
    if (url !== initialData?.customUrl) {
      setIsCheckingUrl(true);
      try {
        const isAvailable = await checkCustomUrlAvailability(url);
        if (!isAvailable) {
          setErrors((prev) => ({
            ...prev,
            customUrl: 'This URL is already taken',
          }));
          setIsCheckingUrl(false);
          return false;
        }
      } catch (error) {
        console.error('Error checking URL availability:', error);
        setErrors((prev) => ({
          ...prev,
          customUrl: 'Error checking URL availability',
        }));
        setIsCheckingUrl(false);
        return false;
      }
      setIsCheckingUrl(false);
    }

    setErrors((prev) => ({ ...prev, customUrl: undefined }));
    return true;
  };

  const validateForm = async () => {
    const newErrors: { title?: string; customUrl?: string; bio?: string } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    const isCustomUrlValid = await validateCustomUrl(customUrl);
    if (!isCustomUrlValid) {
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) return;

    await onSubmit({
      title,
      customUrl,
      bio: bio.trim() ? bio : null,
      theme: isDarkMode ? 'dark' : 'light',
    });
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setCustomUrl(value);
    setErrors((prev) => ({ ...prev, customUrl: undefined }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id='title'
        label='Page Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='My Link Page'
        error={errors.title}
        disabled={isSubmitting}
      />

      <div className='mb-4'>
        <Input
          id='customUrl'
          label='Custom URL'
          value={customUrl}
          onChange={handleCustomUrlChange}
          placeholder='myusername'
          error={errors.customUrl}
          disabled={isSubmitting || isCheckingUrl}
        />
        <p className='text-xs text-gray-500 mt-1'>
          Your page will be available at: yourdomain.com/
          {customUrl || 'yourname'}
        </p>
      </div>

      <div className='mb-4'>
        <label
          htmlFor='bio'
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          Bio (optional)
        </label>
        <textarea
          id='bio'
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder='A short description about you or your page'
          className='px-3 py-2 bg-white dark:bg-gray-800 border shadow-sm border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1'
          rows={3}
          disabled={isSubmitting}
        />
        {errors.bio && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.bio}
          </p>
        )}
      </div>

      <div className='mb-6'>
        <div className='flex items-center'>
          <Switch
            checked={isDarkMode}
            onChange={setIsDarkMode}
            className={`${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className='sr-only'>Use dark theme</span>
            <span
              className={`${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform`}
            />
          </Switch>
          <span className='ml-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
            Dark Mode
          </span>
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          isLoading={isSubmitting}
          disabled={isSubmitting || isCheckingUrl}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
