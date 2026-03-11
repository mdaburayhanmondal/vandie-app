import AddToCartButton from '@/components/AddToCartBtn';
import { getVandyDetails } from '@/lib/actions/store.actions';
import { IItem } from '@/lib/models/item.model';
import Link from 'next/link';
import { FaStore, FaMapMarkerAlt, FaChevronLeft } from 'react-icons/fa';

const VandyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data = await getVandyDetails(id);

  if (!data || !data.vandy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-black text-gray-400 italic">
          Vandy not found!
        </h1>
        <Link href="/vandies" className="mt-4 text-orange-600 font-bold">
          ← Back to directory
        </Link>
      </div>
    );
  }

  const { vandy, items } = data;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* 1. Vandy Header Card */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] mb-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 opacity-50" />

        <Link
          href="/vandies"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-600 mb-6 uppercase tracking-widest transition-colors"
        >
          <FaChevronLeft /> Back to directory
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black italic text-gray-900 tracking-tighter uppercase mb-3">
              {vandy.storeName}
            </h1>
            <p className="text-gray-500 max-w-xl text-lg italic leading-relaxed">
              {vandy.bio ||
                "This artisan is busy perfecting their craft and hasn't written a bio yet."}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <FaMapMarkerAlt className="text-orange-600" /> {vandy.location}
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  vandy.isLive ?
                    'bg-green-100 text-green-700'
                  : 'bg-red-50 text-red-400'
                }`}
              >
                {vandy.isLive ? '● Live Now' : '○ Currently Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
          On the Menu
        </h2>
        <div className="h-1 flex-1 bg-gray-100 rounded-full" />
      </div>

      {items.length === 0 ?
        <div className="py-20 text-center bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold italic">
            This Vandy hasn't listed any items today.
          </p>
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: IItem) => {
            const enrichedItem = {
              ...item,
              storeName: vandy.storeName,
              isVandyLive: vandy.isLive,
            };

            return (
              <div
                key={item._id?.toString()}
                className="group bg-white border border-gray-100 rounded-4xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
              >
                <Link
                  href={`/cravings/${item._id}`}
                  className="h-40 bg-orange-50 flex items-center justify-center overflow-hidden"
                >
                  <span className="text-orange-200 font-black text-3xl opacity-40 italic uppercase group-hover:scale-110 transition-transform">
                    {item.category}
                  </span>
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <Link href={`/cravings/${item._id}`} className="block mb-2">
                    <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-gray-500 text-xs italic line-clamp-2 mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Price
                      </span>
                      <span className="text-2xl font-black text-gray-900">
                        {item.price}৳
                      </span>
                    </div>

                    {vandy.isLive && item.isAvailable ?
                      <AddToCartButton item={enrichedItem as any} />
                    : <button
                        disabled
                        className="bg-gray-100 text-gray-400 px-5 py-2 rounded-2xl text-[10px] font-black uppercase cursor-not-allowed"
                      >
                        {!vandy.isLive ? 'Vandy Offline' : 'Sold Out'}
                      </button>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
    </section>
  );
};

export default VandyDetailsPage;
