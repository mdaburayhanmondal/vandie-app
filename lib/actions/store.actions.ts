'use server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Store from '../models/store.model';
import { redirect } from 'next/navigation';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';
import Item from '../models/item.model';
import Order from '../models/order.model';

export async function createStore(formData: FormData) {
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

export async function getVandyDetails(vandyId: string) {
  try {
    await connectToDatabase();
    const vandy = await Store.findOne({ ownerId: vandyId }).lean();
    if (!vandy) return null;

    const items = await Item.find({ ownerId: vandyId })
      .sort({ category: 1 })
      .lean();

    // 5 most recent reviews
    const reviews = await Order.find({
      vandyId: vandyId,
      'review.rating': { $exists: true },
    })
      .sort({ 'review.createdAt': -1 })
      .limit(5)
      .lean();

    return JSON.parse(JSON.stringify({ vandy, items, reviews }));
  } catch (err) {
    console.error('Database Error:', err);
    return null;
  }
}

export async function toggleLiveStatus(
  storeId: string,
  currentStatus: boolean,
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    const updatedStore = await Store.findOneAndUpdate(
      { _id: storeId, ownerId: userId },
      { isLive: !currentStatus },
      { new: true },
    );

    if (!updatedStore) throw new Error('Store not found or unauthorized');

    revalidatePath('/vandy-dashboard');

    return { success: true, isLive: updatedStore.isLive };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

export async function updateStore(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    const storeName = formData.get('storeName') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    const coverImage = formData.get('coverImage') as string;

    const updatedStore = await Store.findOneAndUpdate(
      { ownerId: userId },
      {
        storeName,
        bio,
        location,
        coverImage,
      },
      { new: true },
    );

    if (!updatedStore) throw new Error('Store not found');

    revalidatePath('/vandy-dashboard');
    revalidatePath('/vandy-dashboard/settings');
    revalidatePath(`/vandies/${userId}`);

    return { success: true };
  } catch (error) {
    console.error('Update Store Error:', error);
    return { success: false, error: 'Failed to update profile details.' };
  }
}