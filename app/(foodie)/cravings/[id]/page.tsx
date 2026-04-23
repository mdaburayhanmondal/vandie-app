import { getItemDetails } from '@/lib/actions/item.actions';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaArrowLeft, FaClock } from 'react-icons/fa';
import { notFound } from 'next/navigation';

const ItemDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (id.startsWith('user_')) {
    return notFound();
  }

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
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors mb-6 uppercase tracking-widest"
        >
          <FaArrowLeft /> Back to Cravings
        </Link>

        {/* 2. Main Item Card */}
        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Actual Image Display */}
            <div className="h-80 md:h-auto bg-orange-50 flex items-center justify-center relative">
              {item.image ?
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              : <span className="text-orange-300 font-black text-5xl opacity-30 italic uppercase">
                  {item.category}
                </span>
              }
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full shadow-sm border border-orange-50 z-10">
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-8 md:p-12 flex flex-col">
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4 uppercase italic tracking-tighter">
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
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">
                    Price
                  </span>
                  <span className="text-4xl font-black text-gray-900 leading-none">
                    <small className="text-sm italic text-orange-600 mr-0.5">
                      ৳
                    </small>
                    {item.price}
                  </span>
                </div>

                {item.isAvailable ?
                  <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-2xl border border-green-100 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Available Now
                    </span>
                  </div>
                : <span className="bg-red-50 text-red-500 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                    Sold Out
                  </span>
                }
              </div>

              <button
                disabled={!ownerInfo.isLive || !item.isAvailable}
                className="w-full py-5 rounded-2xl bg-black text-white font-black text-lg uppercase shadow-xl hover:bg-orange-600 transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none tracking-widest"
              >
                {ownerInfo.isLive ? 'Add to Plate' : 'Vandy is Offline'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. The "Vandy Bridge" */}
        <div className="mt-8">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">
            Meet the artisan
          </h2>
          <Link
            href={`/vandies/${item.ownerId}`}
            className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform">
                {ownerInfo.storeName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter">
                  {ownerInfo.storeName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    <FaMapMarkerAlt className="text-orange-500" />{' '}
                    {ownerInfo.location}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    <FaClock className="text-orange-500" /> 10 AM - 9 PM
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-200 group-hover:text-orange-600 transform group-hover:translate-x-1 transition-all pr-4">
              <FaArrowLeft className="rotate-180" size={20} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ItemDetailsPage;
