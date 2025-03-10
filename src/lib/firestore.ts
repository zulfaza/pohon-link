import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Link, UserProfile } from '../types';

// Convert Firestore timestamp to Date
const convertTimestampToDate = (data: any) => {
  const result = { ...data };

  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
  });

  return result;
};

// User Profiles
export const createUserProfile = async (
  userId: string,
  customUrl: string,
  title: string
) => {
  const profileRef = doc(collection(db, 'profiles'));
  const profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
    userId,
    customUrl,
    title,
    theme: 'system',
  };

  await setDoc(profileRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: profileRef.id, ...profile };
};

export const getUserProfileByUserId = async (userId: string) => {
  const profilesRef = collection(db, 'profiles');
  const q = query(profilesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...convertTimestampToDate(doc.data()) } as UserProfile;
};

export const getUserProfileByCustomUrl = async (customUrl: string) => {
  const profilesRef = collection(db, 'profiles');
  const q = query(profilesRef, where('customUrl', '==', customUrl));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...convertTimestampToDate(doc.data()) } as UserProfile;
};

export const updateUserProfile = async (
  profileId: string,
  data: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
) => {
  const profileRef = doc(db, 'profiles', profileId);
  await updateDoc(profileRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Links
export const createLink = async (
  userId: string,
  title: string,
  url: string
) => {
  const linksRef = collection(db, 'links');
  const q = query(linksRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const order = querySnapshot.size; // New link will be at the end

  const linkRef = doc(collection(db, 'links'));
  const link = {
    userId,
    title,
    url,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(linkRef, link);

  return { id: linkRef.id, ...link };
};

export const getLinksByUserId = async (userId: string) => {
  const linksRef = collection(db, 'links');
  const q = query(linksRef, where('userId', '==', userId), orderBy('order'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestampToDate(doc.data()),
  })) as Link[];
};

export const updateLink = async (
  linkId: string,
  data: Partial<Omit<Link, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  const linkRef = doc(db, 'links', linkId);
  await updateDoc(linkRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteLink = async (linkId: string) => {
  const linkRef = doc(db, 'links', linkId);
  await deleteDoc(linkRef);
};

export const reorderLinks = async (links: { id: string; order: number }[]) => {
  const batch = writeBatch(db);

  links.forEach((link) => {
    const linkRef = doc(db, 'links', link.id);
    batch.update(linkRef, {
      order: link.order,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};
