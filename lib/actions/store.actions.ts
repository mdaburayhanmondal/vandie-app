import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Store from '../models/store.model';
import { redirect } from 'next/navigation';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';

export async function createStore(formData: FormData) {
  'use server';
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('You must be logged in to apply.');
    }

    const storeName = formData.get('storeName') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;

    await connectToDatabase();
    const existingStore = await Store.findOne({ ownerId: userId }).lean();
    if (existingStore) {
      throw new Error(
        'You already have an active store or pending application.',
      );
    }

    await Store.create({
      ownerId: userId,
      storeName,
      bio,
      location,
      applicationStatus: 'pending',
      isLive: false,
    });
  } catch (err) {
    console.error('Error creating store:', err);
  }
  redirect('/');
}

export async function fetchVandyApplications() {
  await connectToDatabase();
  const vandyApplications = await Store.find({
    applicationStatus: 'pending',
  }).lean();

  if (!vandyApplications) {
    return null;
  }
  return JSON.parse(JSON.stringify(vandyApplications));
}

export async function approveApplication(storeId: string) {
  'use server';
  try {
    await connectToDatabase();
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { applicationStatus: 'approved' },
      { new: true },
    ).lean();
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: updatedStore.ownerId },
      { role: 'vandy' },
    );
    revalidatePath('/admin-dashboard');
  } catch (err) {
    console.error(err);
    throw new Error('Failed to approve');
  }
}

export async function rejectApplication(storeId: string) {
  'use server';
  await connectToDatabase();

  const updatedStore = await Store.findByIdAndUpdate(
    storeId,
    { applicationStatus: 'rejected' },
    { new: true },
  ).lean();
  revalidatePath('/admin-dashboard');
}

export async function getVandies() {
  try {
    await connectToDatabase();
    const vandies = await Store.find({ applicationStatus: 'approved' })
      .sort({ storeName: 1 })
      .lean();
    if (vandies.length <= 0) {
      return null;
    }
    return JSON.parse(JSON.stringify(vandies));
  } catch (err) {
    console.error(err);
    throw new Error('Failed to load vandies');
  }
}
