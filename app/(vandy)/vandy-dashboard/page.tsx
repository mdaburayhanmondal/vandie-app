import { getMyItems } from '@/lib/actions/item.actions';
import { IItem } from '@/lib/models/item.model';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

const VandyDashboard = async () => {
  const items = await getMyItems();

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-semibold text-gray-500">
          No items found in your menu.
        </h1>
        <Link
          href="/vandy-dashboard/add-item"
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          + Add Your First Item
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto p-6 max-w-7xl flex flex-col items-center gap-y-8">
      <div className="w-full flex justify-between items-center max-w-3xl">
        <h1 className="text-3xl font-bold italic border-b-4 border-green-500">
          My Menu Items
        </h1>
        <Link
          href="/vandy-dashboard/add-item"
          className="text-green-600 hover:underline font-medium"
        >
          + Add New
        </Link>
      </div>

      <ul className="w-full mx-auto max-w-3xl flex flex-col gap-y-3">
        {items.map((item: IItem, index: number) => (
          <li
            key={item._id}
            className="w-full grid grid-cols-[3fr_1fr_1fr_2fr_1fr] items-center p-4 bg-white shadow-sm border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex gap-x-4 items-center">
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                {index + 1}
              </span>
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
            </div>

            <span className="text-sm text-gray-500 px-2 py-1 bg-blue-50 rounded-full text-center w-fit">
              {item.category}
            </span>

            <p className="font-bold text-green-700">{item.price}৳</p>

            <div className="flex items-center gap-x-2">
              <div
                className={`size-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <p className="text-sm">
                {item.isAvailable ? 'Available' : 'Sold Out'}
              </p>
            </div>

            <Link
              href={`/vandy-dashboard/edit-item/${item._id}`}
              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors justify-self-end"
            >
              <FaEdit size={20} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VandyDashboard;
