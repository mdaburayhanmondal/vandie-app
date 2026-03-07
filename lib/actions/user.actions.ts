'use server';

import { currentUser } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import User from '../models/user.model';

export async function syncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    await connectToDatabase();
    const existingUser = await User.findOne({ clerkId: clerkUser.id }).lean();
    if (existingUser) {
      return JSON.parse(JSON.stringify(existingUser));
    }

    const newUser = await User.create({
      clerkId: clerkUser.id,
      username: clerkUser.username || '',
      name:
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        clerkUser.username ||
        'Foodie',
      email: clerkUser.emailAddresses[0].emailAddress,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    console.error(err);
    throw new Error('Failed to sync user');
  }
}
