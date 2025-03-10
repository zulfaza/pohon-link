import { Link, UserProfile } from '@/types';
import {
  createUserProfile,
  getUserProfileByUserId,
  getUserProfileByCustomUrl,
  updateUserProfile,
  createLink,
  getLinksByUserId,
  updateLink,
  deleteLink,
  reorderLinks,
} from './actions';

// User Profile API
export const userProfileApi = {
  create: async (userId: string, customUrl: string, title: string) => {
    return createUserProfile(userId, customUrl, title);
  },

  getByUserId: async (userId: string) => {
    return getUserProfileByUserId(userId);
  },

  getByCustomUrl: async (customUrl: string) => {
    return getUserProfileByCustomUrl(customUrl);
  },

  update: async (
    profileId: string,
    data: Partial<
      Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    >
  ) => {
    return updateUserProfile(profileId, data);
  },
};

// Links API
export const linksApi = {
  create: async (userId: string, title: string, url: string) => {
    return createLink(userId, title, url);
  },

  getByUserId: async (userId: string) => {
    return getLinksByUserId(userId);
  },

  update: async (
    linkId: string,
    data: Partial<Omit<Link, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    return updateLink(linkId, data);
  },

  delete: async (linkId: string) => {
    return deleteLink(linkId);
  },

  reorder: async (links: { id: string; order: number }[]) => {
    return reorderLinks(links);
  },
};
