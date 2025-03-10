import React from 'react';
import { Link } from '../types';
import {
  PencilIcon,
  TrashIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (linkId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
  isDragging = false,
  dragHandleProps,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 mb-3 ${
        isDragging
          ? 'shadow-lg border-blue-300 dark:border-blue-500'
          : 'shadow-sm'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
            {link.title}
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
            {link.url}
          </p>
        </div>
        <div className='flex items-center space-x-2 ml-4'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onEdit(link)}
            aria-label='Edit link'
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='danger'
            size='sm'
            onClick={() => onDelete(link.id)}
            aria-label='Delete link'
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className='cursor-move p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <ArrowsUpDownIcon className='h-5 w-5 text-gray-400 dark:text-gray-500' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
