import React, { useState, useEffect } from 'react';
import { Link } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LinkFormProps {
  initialData?: Partial<Link>;
  onSubmit: (data: { title: string; url: string }) => Promise<void>;
  isSubmitting: boolean;
}

export const LinkForm: React.FC<LinkFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUrl(initialData.url || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { title?: string; url?: string } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
      isValid = false;
    } else {
      try {
        // Check if URL is valid by creating a URL object
        new URL(url.startsWith('http') ? url : `https://${url}`);
      } catch (e) {
        newErrors.url = 'Please enter a valid URL';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Ensure URL has protocol
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    await onSubmit({ title, url: formattedUrl });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 dark:text-gray-200'>
      <Input
        id='title'
        label='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Link Title'
        error={errors.title}
        disabled={isSubmitting}
        className='dark:bg-gray-800 dark:border-gray-700'
      />

      <Input
        id='url'
        label='URL'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder='https://example.com'
        error={errors.url}
        disabled={isSubmitting}
        className='dark:bg-gray-800 dark:border-gray-700'
      />

      <div className='flex justify-end mt-4'>
        <Button
          type='submit'
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className='dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white'
        >
          {initialData?.id ? 'Update Link' : 'Add Link'}
        </Button>
      </div>
    </form>
  );
};
