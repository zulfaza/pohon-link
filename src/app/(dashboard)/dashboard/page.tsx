'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LinkForm } from '@/components/LinkForm';
import { Link as LinkType, UserProfile } from '@/types';
import {
  createLink,
  getLinksByUserId,
  updateLink,
  deleteLink,
  reorderLinks,
  getUserProfileByUserId,
  getUserProfileByCustomUrl,
  updateUserProfile,
} from '@/lib/firestore';
import { ManageLinksView } from '@/components/dashboard/ManageLinksView';
import { PreviewLinksView } from '@/components/dashboard/PreviewLinksView';
import ProfileView from '@/components/dashboard/ProfileView';

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
        getLinksByUserId(user.id),
        getUserProfileByUserId(user.id),
      ]);

      setLinks(fetchedLinks);
      setProfile(userProfile);
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
      await createLink(user.id, data.title, data.url);
      await fetchData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLink = async (data: { title: string; url: string }) => {
    if (!currentLink) return;

    setIsSubmitting(true);
    try {
      await updateLink(currentLink.id, data);
      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!currentLink) return;

    setIsSubmitting(true);
    try {
      await deleteLink(currentLink.id);
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorderLinks = async (reorderedLinks: LinkType[]) => {
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      order: index,
    }));

    setLinks(updatedLinks);

    try {
      await reorderLinks(
        updatedLinks.map((link) => ({ id: link.id, order: link.order }))
      );
    } catch (error) {
      console.error('Error reordering links:', error);
      // Revert to original order if there's an error
      await fetchData();
    }
  };

  const handleProfileSubmit = async (data: {
    title: string;
    customUrl: string;
    bio: string | null;
    theme: 'light' | 'dark';
  }) => {
    if (!user || !profile) return;

    setIsProfileFormSubmitting(true);
    try {
      await updateUserProfile(profile.id, data);
      await fetchData();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsProfileFormSubmitting(false);
    }
  };

  const checkCustomUrlAvailability = async (url: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const existingProfile = await getUserProfileByCustomUrl(url);
      // URL is available if no profile exists with this URL or if it belongs to the current user
      return !existingProfile || existingProfile.userId === user.id;
    } catch (error) {
      console.error('Error checking URL availability:', error);
      return false;
    }
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
            Are you sure you want to delete "{currentLink?.title}"? This action
            cannot be undone.
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
