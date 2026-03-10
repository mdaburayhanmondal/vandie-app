import { getVandyDetails } from '@/lib/actions/store.actions';
import { IItem } from '@/lib/models/item.model';
import React from 'react';

const VandyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data = await getVandyDetails(id);
  const { vandy, items } = data;

  if (!vandy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Vandy not found!</h1>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="bg-green-50 p-6 rounded-2xl mb-8 border border-green-100">
        <h1 className="text-4xl font-bold italic text-green-900">
          {vandy.storeName}
        </h1>
        <p className="text-green-700 mt-2">{vandy.bio || 'No bio provided.'}</p>
        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${vandy.isLive ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {vandy.isLive ? '● Live Now' : '○ Closed'}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Menu</h2>

      {items.length === 0 ?
        <p className="text-gray-500">No items available yet.</p>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: IItem) => (
            <div
              key={item._id}
              className="border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <p className="text-gray-600 line-clamp-2 text-sm h-10">
                {item.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-green-600">
                  {item.price}৳
                </span>
                <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-semibold cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      }
    </section>
  );
};

export default VandyDetailsPage;
