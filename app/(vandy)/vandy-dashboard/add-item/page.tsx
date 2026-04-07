'use client';

import { addItem } from '@/lib/actions/item.actions';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AddItemPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  async function clientAction(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await addItem(formData);

    if (result?.success) {
      setMessage({
        type: 'success',
        text: 'Item added successfully! Redirecting...',
      });
      setTimeout(() => {
        router.push('/vandy-dashboard');
      }, 2000);
    } else {
      setMessage({
        type: 'error',
        text: result?.error || 'Failed to add item.',
      });
      setLoading(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto flex flex-col justify-center items-center gap-y-6 p-6 min-h-screen">
      <div className="w-full flex justify-start">
        <Link
          href="/vandy-dashboard"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold italic tracking-wider text-green-700">
        Add New Menu Item
      </h1>

      {message && (
        <div
          className={`w-full p-3 rounded-md text-center border ${
            message.type === 'success' ?
              'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        action={clientAction}
        className="w-full flex flex-col gap-y-5 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Special Beef Burger"
            required
            className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-gray-700">
              Price (BDT)
            </label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              required
              className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              required
              className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none bg-white"
            >
              <option value="Snacks">Snacks</option>
              <option value="Meals">Meals</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            className="resize-none border border-gray-300 w-full p-3 rounded-md h-28 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Describe your delicious food..."
            maxLength={150}
          ></textarea>
        </div>

        <div className="flex w-full justify-between">
          <div className="flex items-center gap-x-3 bg-gray-50 p-3 rounded-md">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              defaultChecked
              className="w-5 h-5 accent-green-600"
            />
            <label
              htmlFor="isAvailable"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Item is currently available for order
            </label>
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-gray-700">
              Pre Pay Amount
            </label>
            <input
              type="text"
              name="prePayAmount"
              className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-medium text-gray-700">
            Image URL (Optional)
          </label>
          <input
            type="text"
            name="image"
            placeholder="https://example.com/image.jpg"
            className="border border-gray-300 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md font-bold text-white transition-all ${
            loading ?
              'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
          }`}
        >
          {loading ? 'Saving Item...' : 'Add Item to Menu'}
        </button>
      </form>
    </section>
  );
};

export default AddItemPage;
