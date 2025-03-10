'use server';

import {
  createUserProfile as createUserProfileFirestore,
  getUserProfileByUserId as getUserProfileByUserIdFirestore,
  getUserProfileByCustomUrl as getUserProfileByCustomUrlFirestore,
  updateUserProfile as updateUserProfileFirestore,
  createLink as createLinkFirestore,
  getLinksByUserId as getLinksByUserIdFirestore,
  updateLink as updateLinkFirestore,
  deleteLink as deleteLinkFirestore,
  reorderLinks as reorderLinksFirestore,
} from './firestore';
import { Link, UserProfile } from '../types';

// Helper function to serialize timestamps and other non-serializable objects
function serializeData<T>(data: T): unknown {
  if (!data) return data;

  // If it's a Date object, convert to ISO string
  if (data instanceof Date) {
    return data.toISOString();
  }

  // If it's an array, serialize each item
  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item));
  }

  // If it's an object, serialize each property
  if (typeof data === 'object' && data !== null) {
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeData(value);
    }
    return serialized;
  }

  // Return primitive values as is
  return data;
}

// User Profile Actions
export async function createUserProfile(
  userId: string,
  customUrl: string,
  title: string
) {
  const result = await createUserProfileFirestore(userId, customUrl, title);
  return serializeData(result) as UserProfile | null;
}

export async function getUserProfileByUserId(userId: string) {
  const result = await getUserProfileByUserIdFirestore(userId);
  return serializeData(result) as UserProfile | null;
}

export async function getUserProfileByCustomUrl(customUrl: string) {
  const result = await getUserProfileByCustomUrlFirestore(customUrl);
  return serializeData(result) as UserProfile | null;
}

export async function updateUserProfile(
  profileId: string,
  data: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
  return updateUserProfileFirestore(profileId, data);
}

// Link Actions
export async function createLink(userId: string, title: string, url: string) {
  const result = await createLinkFirestore(userId, title, url);
  return serializeData(result);
}

export async function getLinksByUserId(userId: string) {
  const result = await getLinksByUserIdFirestore(userId);
  return serializeData(result);
}

export async function updateLink(
  linkId: string,
  data: Partial<Omit<Link, 'id' | 'createdAt' | 'updatedAt'>>
) {
  return updateLinkFirestore(linkId, data);
}

export async function deleteLink(linkId: string) {
  return deleteLinkFirestore(linkId);
}

export async function reorderLinks(links: { id: string; order: number }[]) {
  return reorderLinksFirestore(links);
}
