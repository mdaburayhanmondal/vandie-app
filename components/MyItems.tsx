'use client';

import { useState } from 'react';
import { toggleItemAvailability, deleteItem } from '@/lib/actions/item.actions';
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaPlus,
} from 'react-icons/fa';
import Link from 'next/link';

interface Item {
  _id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export default function MyItems({ items: initialItems }: { items: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Toggle availability
  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    setProcessingId(itemId);
    const result = await toggleItemAvailability(itemId, currentStatus);

    if (result.success) {
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, isAvailable: !currentStatus } : item,
        ),
      );
    } else {
      alert('Failed to update availability.');
    }
    setProcessingId(null);
  };

  // Delete item handler
  const handleDelete = async (itemId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this item? This cannot be undone.',
      )
    )
      return;

    setProcessingId(itemId);
    const result = await deleteItem(itemId);

    if (result.success) {
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } else {
      alert('Failed to delete item.');
    }
    setProcessingId(null);
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-10 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <FaPlus size={30} />
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">
            Your menu is empty
          </h3>
          <p className="text-gray-400 text-sm italic mt-1">
            Start adding your delicious cravings to get discovered.
          </p>
        </div>
        <Link
          href="/vandy-dashboard/add-item"
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-orange-600 transition-all shadow-xl active:scale-95"
        >
          + Add Your First Item
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
            <FaUtensilsIcon />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">
              My Menu
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {items.length} Items Listed
            </p>
          </div>
        </div>

        <Link
          href="/vandy-dashboard/add-item"
          className="text-orange-600 font-black uppercase text-[10px] tracking-[0.2em] border-2 border-orange-100 px-6 py-2 rounded-full hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all"
        >
          + Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className={`group bg-white border-2 rounded-[2.5rem] p-6 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              item.isAvailable ?
                'border-gray-50 shadow-sm hover:shadow-xl hover:border-orange-50'
              : 'border-dashed border-gray-200 opacity-60'
            }`}
          >
            {/* Info Section */}
            <div className="flex items-center gap-5">
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl italic uppercase ${
                  item.isAvailable ?
                    'bg-orange-50 text-orange-600'
                  : 'bg-gray-100 text-gray-400'
                }`}
              >
                {item.category.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-black text-xl text-gray-900 leading-none">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-black px-3 py-1 bg-gray-50 text-gray-400 rounded-full uppercase tracking-tighter border border-gray-100">
                    {item.category}
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                  <span className="text-sm font-bold text-orange-600 mr-1 italic">
                    ৳
                  </span>
                  {item.price}
                </p>
              </div>
            </div>

            {/* Controls Section */}
            <div className="flex items-center gap-3 ml-auto md:ml-0">
              {/* Availability Toggle */}
              <button
                onClick={() => handleToggle(item._id, item.isAvailable)}
                disabled={processingId === item._id}
                className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  item.isAvailable ?
                    'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {processingId === item._id ?
                  <FaSpinner className="animate-spin" />
                : item.isAvailable ?
                  <>
                    <FaCheckCircle size={14} /> Available
                  </>
                : <>
                    <FaTimesCircle size={14} /> Sold Out
                  </>
                }
              </button>

              {/* Edit Button */}
              <Link
                href={`/vandy-dashboard/edit-item/${item._id}`}
                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-blue-600 hover:bg-blue-50 transition-all hover:scale-110 shadow-sm"
              >
                <FaEdit size={18} />
              </Link>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item._id)}
                disabled={processingId === item._id}
                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-600 hover:bg-red-50 transition-all hover:scale-110 shadow-sm disabled:opacity-30"
              >
                {processingId === item._id ?
                  <FaSpinner className="animate-spin" />
                : <FaTrash size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Internal SVG Icon
function FaUtensilsIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 448 512"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V320 160 32c0-17.7-14.3-32-32-32zM64 0C46.3 0 32 14.3 32 32V202.9c0 32.8 19.7 62.6 50 74.8l22 8.8V480c0 17.7 14.3 32 32 32s32-14.3 32-32V286.5l22-8.8c30.3-12.2 50-42 50-74.8V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V176c0 8.8-7.2 16-16 16s-16-7.2-16-16V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V176c0 8.8-7.2 16-16 16s-16-7.2-16-16V32C96 14.3 81.7 0 64 0z"></path>
    </svg>
  );
}
