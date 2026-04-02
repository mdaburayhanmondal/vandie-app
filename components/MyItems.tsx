import { deleteItem } from '@/lib/actions/item.actions';
import { IItem } from '@/lib/models/item.model';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface MyItemsProps {
  items: IItem[];
}

const MyItems = ({ items }: MyItemsProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-semibold text-gray-500">
          No items found in your menu.
        </h1>
        <Link
          href="/vandy-dashboard/add-item"
          className="bg-green-600 text-white px-4 py-2 rounded-md transition-transform hover:scale-105"
        >
          + Add Your First Item
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto p-6 max-w-7xl flex flex-col items-center gap-y-8">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center max-w-3xl">
        <h1 className="text-3xl font-bold italic border-b-4 border-green-500">
          My Menu Items
        </h1>
        <Link
          href="/vandy-dashboard/add-item"
          className="text-green-600 hover:underline font-medium cursor-pointer"
        >
          + Add New
        </Link>
      </div>

      {/* Items List */}
      <ul className="w-full mx-auto max-w-3xl flex flex-col gap-y-3">
        {items.map((item: IItem, index: number) => {
          return (
            <li
              key={item._id as string}
              className="w-full grid grid-cols-[3fr_1fr_1fr_2fr_1fr] gap-2 items-center p-4 bg-white shadow-sm border rounded-lg hover:shadow-md transition-shadow"
            >
              {/* Name & Index */}
              <div className="flex gap-x-4 items-center">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                  {index + 1}
                </span>
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {item.name}
                </h2>
              </div>

              {/* Category */}
              <span className="text-[10px] uppercase font-bold text-gray-500 px-2 py-1 bg-blue-50 rounded-full text-center w-fit">
                {item.category}
              </span>

              {/* Price */}
              <p className="font-bold text-green-700">{item.price}৳</p>

              {/* Availability Status */}
              <div className="flex items-center gap-x-2">
                <div
                  className={`size-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <p className="text-sm">
                  {item.isAvailable ? 'Available' : 'Sold Out'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-x-4 justify-self-end">
                <Link
                  href={`/vandy-dashboard/edit-item/${item._id}`}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FaEdit size={18} />
                </Link>

                <form
                  action={async () => {
                    'use server';
                    await deleteItem(item._id as string);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <FaTrash size={18} />
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default MyItems;
