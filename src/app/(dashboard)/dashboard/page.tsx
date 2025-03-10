'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LinkForm } from '@/components/LinkForm';
import { Link as LinkType, UserProfile } from '@/types';
import { userProfileApi, linksApi } from '@/lib/api';
import { ManageLinksView } from '@/components/dashboard/ManageLinksView';
import { PreviewLinksView } from '@/components/dashboard/PreviewLinksView';
import ProfileView from '@/components/dashboard/ProfileView';

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

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<LinkType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileFormSubmitting, setIsProfileFormSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);

  const fetchData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [fetchedLinks, userProfile] = await Promise.all([
        linksApi.getByUserId(user.id),
        userProfileApi.getByUserId(user.id),
      ]);

      // Parse dates from ISO strings
      setLinks(parseDates(fetchedLinks) as LinkType[]);
      setProfile(parseDates(userProfile) as UserProfile | null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async (data: { title: string; url: string }) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const newLink = await linksApi.create(user.id, data.title, data.url);
      setIsAddModalOpen(false);
      // Parse dates from the new link
      setLinks((prev) => [...prev, parseDates(newLink) as LinkType]);
    } catch (error) {
      console.error('Error adding link:', error);
      fetchData(); // Fallback to full refresh if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLink = async (data: { title: string; url: string }) => {
    if (!currentLink) return;

    setIsSubmitting(true);
    try {
      await linksApi.update(currentLink.id, data);
      setIsEditModalOpen(false);

      // Update the link in the state
      setLinks((prev) =>
        prev.map((link) =>
          link.id === currentLink.id
            ? (parseDates({
                ...link,
                ...data,
                updatedAt: new Date().toISOString(),
              }) as LinkType)
            : link
        )
      );
    } catch (error) {
      console.error('Error updating link:', error);
      fetchData(); // Fallback to full refresh if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!currentLink) return;

    setIsSubmitting(true);
    try {
      await linksApi.delete(currentLink.id);
      setIsDeleteModalOpen(false);

      // Remove the link from the state
      setLinks((prev) => prev.filter((link) => link.id !== currentLink.id));
    } catch (error) {
      console.error('Error deleting link:', error);
      fetchData(); // Fallback to full refresh if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (data: {
    title: string;
    customUrl: string;
    bio: string | null;
    theme: 'light' | 'dark' | 'system';
  }) => {
    if (!profile) return;

    setIsProfileFormSubmitting(true);
    try {
      await userProfileApi.update(profile.id, data);
      // Update the profile in the state
      setProfile(
        parseDates({
          ...profile,
          ...data,
          updatedAt: new Date().toISOString(),
        }) as UserProfile
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      fetchData(); // Fallback to full refresh if there's an error
    } finally {
      setIsProfileFormSubmitting(false);
    }
  };

  const checkCustomUrlAvailability = async (url: string): Promise<boolean> => {
    if (!profile || url === profile.customUrl) return true;

    const existingProfile = await userProfileApi.getByCustomUrl(url);
    return !existingProfile;
  };

  if (!isLoaded) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
        Your Link Page
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='lg:col-span-1'>
          <ProfileView
            profile={profile}
            handleProfileSubmit={handleProfileSubmit}
            isProfileFormSubmitting={isProfileFormSubmitting}
            checkCustomUrlAvailability={checkCustomUrlAvailability}
          />

          <ManageLinksView
            links={links}
            isLoading={isLoading}
            onAddLink={() => setIsAddModalOpen(true)}
            onEditLink={(link) => {
              setCurrentLink(link);
              setIsEditModalOpen(true);
            }}
            onDeleteLink={(linkId) => {
              const linkToDelete = links.find((l) => l.id === linkId);
              if (linkToDelete) {
                setCurrentLink(linkToDelete);
                setIsDeleteModalOpen(true);
              }
            }}
          />
        </div>
        <div className='lg:col-span-1'>
          <PreviewLinksView
            links={links}
            profile={profile}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Add Link Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Link'
      >
        <LinkForm onSubmit={handleAddLink} isSubmitting={isSubmitting} />
      </Modal>

      {/* Edit Link Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Link'
      >
        <LinkForm
          initialData={currentLink || undefined}
          onSubmit={handleEditLink}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Link'
        maxWidth='sm'
      >
        <div>
          <p className='mb-4'>
            Are you sure you want to delete &quot;{currentLink?.title}?&quot;
            This action cannot be undone.
          </p>
          <div className='flex justify-end space-x-3'>
            <Button
              variant='secondary'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              onClick={handleDeleteLink}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
