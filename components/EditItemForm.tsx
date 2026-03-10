'use client';

import { updateItem } from '@/lib/actions/item.actions';
import { IItem } from '@/lib/models/item.model';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EditItemForm = ({ item }: { item: IItem }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError('');

    const result = await updateItem(item._id as string, formData);

    if (result.success) {
      router.push('/vandy-dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Update failed');
      setLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-y-4 bg-white p-6 rounded-lg border shadow-sm"
    >
      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}

      <div className="flex flex-col gap-y-1">
        <label className="text-sm font-semibold">Item Name</label>
        <input
          name="name"
          defaultValue={item.name}
          className="border p-2 rounded outline-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-semibold">Price</label>
          <input
            type="number"
            name="price"
            defaultValue={item.price}
            className="border p-2 rounded outline-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-semibold">Category</label>
          <select
            name="category"
            defaultValue={item.category}
            className="border p-2 rounded outline-blue-500"
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
        <label className="text-sm font-semibold">Description</label>
        <textarea
          name="description"
          defaultValue={item.description}
          className="border p-2 rounded h-24 resize-none outline-blue-500"
        />
      </div>

      <div className="flex items-center gap-x-2 py-2">
        <input
          type="checkbox"
          name="isAvailable"
          id="isAvailable"
          defaultChecked={item.isAvailable}
          className="size-4"
        />
        <label htmlFor="isAvailable" className="text-sm font-medium">
          Available for customers
        </label>
      </div>

      <div className="flex flex-col gap-y-1">
        <label className="text-sm font-semibold">Image URL</label>
        <input
          name="image"
          defaultValue={item.image}
          className="border p-2 rounded outline-blue-500"
        />
      </div>

      <div className="flex gap-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border py-2 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? 'Saving...' : 'Update Item'}
        </button>
      </div>
    </form>
  );
};

export default EditItemForm;
