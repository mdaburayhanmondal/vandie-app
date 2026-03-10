'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Item from '../models/item.model';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';

export async function addItem(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized!');

    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });
    if (user?.role !== 'vandy') {
      throw new Error('Only Vandies can add menu items.');
    }

    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('image') as string;

    const isAvailable = !!formData.get('isAvailable');

    if (!name || isNaN(price) || !category) {
      throw new Error('Please provide a valid name, price, and category.');
    }

    await Item.create({
      ownerId: userId,
      name,
      price,
      category,
      description,
      isAvailable,
      image: imageUrl,
    });

    revalidatePath('/vandy-dashboard');

    return { success: true };
  } catch (err: any) {
    console.error('Error adding item:', err);
    return { success: false, error: err.message };
  }
}

export async function getMyItems() {
  const { userId } = await auth();

  try {
    await connectToDatabase();
    const items = await Item.find({ ownerId: userId }).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(items));
  } catch (err) {
    console.error(err);
  }
}
