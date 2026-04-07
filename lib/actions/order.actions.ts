'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import Order from '../models/order.model';
import { revalidatePath } from 'next/cache';

//  Create the initial Order Request (foodie)
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

// Check Order Status (foodie)
export async function getOrderStatus(orderId: string) {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId).lean();
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    return null;
  }
}

// Get active order for current user (foodie)
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

// Cancel Order (foodie)
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

// Fetch all orders (Vandy)
export async function getVandyOrders() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    // Fetch orders where vandyId matches the logged-in user
    // Sorted by requested orders first, then by date
    const orders = await Order.find({ vandyId: userId })
      .sort({ status: -1, createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error('Error fetching vandy orders:', error);
    return [];
  }
}

// Update Order Status (vandy)
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    // Security check: ensure the order belongs to this Vandy
    const order = await Order.findOneAndUpdate(
      { _id: orderId, vandyId: userId },
      { status: newStatus },
      { new: true },
    );

    if (!order) throw new Error('Order not found or unauthorized');

    revalidatePath('/vandy-dashboard/orders');
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false };
  }
}

// Delete/Reject Request (If Vandy rejects, we remove it from db)
export async function rejectOrderRequest(orderId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();
    await Order.findOneAndDelete({ _id: orderId, vandyId: userId });

    revalidatePath('/vandy-dashboard/orders');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// submit trxid (foodie)
export async function submitOrderPayment(orderId: string, trxId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await connectToDatabase();

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, foodieId: userId },
      {
        status: 'paid',
        paymentDetails: {
          trxId: trxId,
          method: 'bKash',
          paidAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedOrder) throw new Error('Order not found');

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error submitting payment:', error);
    return { success: false };
  }
}
