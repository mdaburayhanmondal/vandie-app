'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Order from '../models/order.model';
import { revalidatePath } from 'next/cache';

//  Create the initial Order Request (Customer Side)

export async function createOrderRequest(orderData: any) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    // Ensure we don't have multiple active orders for the same user
    const existingOrder = await Order.findOne({
      foodieId: userId,
      status: { $in: ['requested', 'approved', 'paid', 'preparing', 'ready'] },
    });

    if (existingOrder) {
      throw new Error(
        'You already have an active order request. Please complete or cancel it first.',
      );
    }

    const newOrder = await Order.create({
      foodieId: userId,
      ...orderData,
      status: 'requested',
    });

    return { success: true, orderId: newOrder._id.toString() };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'Failed to send request to Vandy.',
    };
  }
}

/**
 * Check Order Status (Customer Polling)
 */
export async function getOrderStatus(orderId: string) {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId).lean();
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    return null;
  }
}

/**
 * Get active order for current user
 */
export async function getActiveOrder() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectToDatabase();
    const order = await Order.findOne({
      foodieId: userId,
      status: { $in: ['requested', 'approved', 'paid', 'preparing', 'ready'] },
    })
      .sort({ createdAt: -1 })
      .lean();

    return order ? JSON.parse(JSON.stringify(order)) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Cancel Order
 */
export async function cancelOrder(orderId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();
    await Order.findOneAndDelete({ _id: orderId, foodieId: userId });

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
