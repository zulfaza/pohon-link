import React from 'react';
import { Button } from '@/components/ui/Button';
import { LinkCard } from '@/components/LinkCard';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link as LinkType } from '@/types';

interface ManageLinksViewProps {
  links: LinkType[];
  isLoading: boolean;
  onAddLink: () => void;
  onEditLink: (link: LinkType) => void;
  onDeleteLink: (linkId: string) => void;
}

export function ManageLinksView({
  links,
  isLoading,
  onAddLink,
  onEditLink,
  onDeleteLink,
}: ManageLinksViewProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
          Manage Links
        </h2>
        <Button onClick={onAddLink}>
          <PlusIcon className='h-5 w-5 mr-2' />
          Add Link
        </Button>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 opacity-75'></div>
        </div>
      ) : links.length === 0 ? (
        <div className='bg-white dark:bg-gray-700 rounded-lg shadow-sm p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
            No links yet
          </h3>
          <p className='text-gray-500 dark:text-gray-300 mb-4'>
            Add your first link to start building your link page.
          </p>
          <Button onClick={onAddLink}>
            <PlusIcon className='h-5 w-5 mr-2' />
            Add Your First Link
          </Button>
        </div>
      ) : (
        <div className='space-y-3 max-h-[70vh] overflow-y-auto pr-2'>
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={onEditLink}
              onDelete={onDeleteLink}
            />
          ))}
        </div>
      )}
    </div>
  );
}
