'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Item, { IItem } from '../models/item.model';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';
import Store from '../models/store.model';

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
    const prePayAmount = formData.get('prePayAmount') as string;
    const imageUrl = formData.get('image') as string;
    const isAvailable = !!formData.get('isAvailable');

    if (!name || isNaN(price) || !category || !prePayAmount) {
      throw new Error('Please provide a valid name, price, and category.');
    }

    const newItem = await Item.create({
      ownerId: userId,
      name,
      price,
      category,
      description,
      prePayAmount,
      isAvailable,
      image: imageUrl,
    });

    revalidatePath('/vandy-dashboard');

    return { success: true };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Error adding item:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function getMyItems() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized!');

  try {
    await connectToDatabase();
    const items = await Item.find({ ownerId: userId }).sort({ name: 1 }).lean();

    return JSON.parse(JSON.stringify(items)) as IItem[];
  } catch (err) {
    console.error('Fetch Items Error:', err);
    return [];
  }
}

export async function getItemById(itemId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectToDatabase();
    const item = await Item.findOne({ _id: itemId, ownerId: userId }).lean();

    return item ? JSON.parse(JSON.stringify(item)) : null;
  } catch (err) {
    console.error('Fetch Item Error:', err);
    return null;
  }
}

export async function updateItem(itemId: string, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('image') as string;
    const isAvailable = !!formData.get('isAvailable');

    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, ownerId: userId },
      {
        name,
        price,
        category,
        description,
        image: imageUrl,
        isAvailable,
      },
      { new: true },
    );
    if (!updatedItem) throw new Error('Item not found or unauthorized');

    revalidatePath('/vandy-dashboard');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return { success: false, error: msg };
  }
}

export async function deleteItem(itemId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('You must be logged in to delete items.');

    await connectToDatabase();

    const deletedItem = await Item.findOneAndDelete({
      _id: itemId,
      ownerId: userId,
    });
    if (!deletedItem) {
      throw new Error(
        'Item not found or you do not have permission to delete it.',
      );
    }

    revalidatePath('/vandy-dashboard');
    return { success: true };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to delete item';

    console.error('Error deleting item:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function getAvailableItems(
  searchQuery: string,
  categoryQuery: string,
) {
  try {
    await connectToDatabase();

    const filter: any = { isAvailable: true };
    if (categoryQuery !== 'All') filter.category = categoryQuery;
    if (searchQuery) filter.name = { $regex: searchQuery, $options: 'i' };

    /**
     * Aggregation Pipeline:
     * 1. Filter items
     * 2. Look up the Store (Vandy) details for each item
     * 3. Merge the averageRating and totalReviews into the item object
     */
    const items = await Item.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'stores', // The collection name in MongoDB
          localField: 'ownerId', // clerkId in Item
          foreignField: 'ownerId', // ownerId in Store
          as: 'vandyDetails',
        },
      },
      { $unwind: '$vandyDetails' },
      {
        $addFields: {
          averageRating: '$vandyDetails.averageRating',
          totalReviews: '$vandyDetails.totalReviews',
          storeName: '$vandyDetails.storeName',
          isVandyLive: '$vandyDetails.isLive',
          location: '$vandyDetails.location',
        },
      },
    ]);

    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error('Fetch Items Error:', error);
    return [];
  }
}

export async function getItemDetails(itemId: string) {
  try {
    await connectToDatabase();
    const item = await Item.findOne({ _id: itemId }).lean();
    if (!item) {
      return null;
    }
    const ownerInfo = await Store.findOne({ ownerId: item.ownerId }).lean();
    return JSON.parse(JSON.stringify({ item, ownerInfo }));
  } catch (err) {
    console.error('Fetch Item Error:', err);
    return null;
  }
}

export async function toggleItemAvailability(
  itemId: string,
  currentStatus: boolean,
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, ownerId: userId },
      { isAvailable: !currentStatus },
      { new: true },
    );

    if (!updatedItem) throw new Error('Item not found or unauthorized');

    revalidatePath('/vandy-dashboard');
    return { success: true, isAvailable: updatedItem.isAvailable };
  } catch (error) {
    console.error('Toggle Error:', error);
    return { success: false };
  }
}
