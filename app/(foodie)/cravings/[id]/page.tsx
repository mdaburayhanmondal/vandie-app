import { getItemDetails } from '@/lib/actions/item.actions';
import Link from 'next/link';
import { FaMapMarkerAlt, FaArrowLeft, FaClock } from 'react-icons/fa';
import { notFound } from 'next/navigation';

const ItemDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getItemDetails(id);
  if (!data || !data.item) {
    return notFound();
  }

  const { item, ownerInfo } = data;

  return (
    <section className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Header Navigation */}
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/cravings"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors mb-6"
        >
          <FaArrowLeft /> Back to Cravings
        </Link>

        {/* 2. Main Item Card */}
        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Image Placeholder */}
            <div className="h-80 md:h-auto bg-orange-100 flex items-center justify-center relative">
              <span className="text-orange-300 font-black text-5xl opacity-30 italic uppercase">
                {item.category}
              </span>
              <div className="absolute top-6 left-6 bg-white px-4 py-1 rounded-full shadow-sm">
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-8 md:p-12 flex flex-col">
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
                {item.name}
              </h1>

              <p className="text-gray-500 text-lg italic mb-8 leading-relaxed">
                "
                {item.description ||
                  'A unique artisan creation made with fresh local ingredients.'}
                "
              </p>

              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Price
                  </span>
                  <span className="text-4xl font-black text-gray-900">
                    {item.price}৳
                  </span>
                </div>

                {item.isAvailable ?
                  <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase">
                      Available Now
                    </span>
                  </div>
                : <span className="bg-red-50 text-red-500 px-4 py-2 rounded-2xl text-xs font-black uppercase">
                    Sold Out
                  </span>
                }
              </div>

              <button
                disabled={!ownerInfo.isLive || !item.isAvailable}
                className="w-full py-5 rounded-2xl bg-black text-white font-black text-lg uppercase shadow-xl hover:bg-orange-600 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                {ownerInfo.isLive ? 'Add to Plate' : 'Vandy is Offline'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. The "Vandy Bridge" - Links to the Seller */}
        <div className="mt-8">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
            Meet the artisan
          </h2>
          <Link
            href={`/vandies/${item.ownerId}`}
            className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {ownerInfo.storeName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                  {ownerInfo.storeName}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                    <FaMapMarkerAlt /> {ownerInfo.location}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                    <FaClock /> 10 AM - 9 PM
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-300 group-hover:text-orange-600 transform group-hover:translate-x-1 transition-all">
              <FaArrowLeft className="rotate-180" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ItemDetailsPage;
