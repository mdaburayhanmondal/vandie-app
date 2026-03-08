import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Store from '../models/store.model';
import { redirect } from 'next/navigation';

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
