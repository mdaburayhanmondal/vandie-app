import CategoryFilters from '@/components/CategoryFilters';
import SearchInput from '@/components/SearchInput';
import { getAvailableItems } from '@/lib/actions/item.actions';
import Link from 'next/link';

import { FaStore, FaMapMarkerAlt } from 'react-icons/fa';

const CravingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search: string; category: string }>;
}) => {
  const searchParamsObj = await searchParams;
  const searchQuery = searchParamsObj.search || '';
  const categoryQuery = searchParamsObj.category || 'All';
  const items = await getAvailableItems(searchQuery, categoryQuery);

  return (
    <section className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Hero & Search Header */}
      <div className="bg-orange-600 text-white pt-16 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
            DISCOVER YOUR CRAVINGS
          </h1>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Find the best street food from the most talented nomadic artisans in
            your neighborhood.
          </p>

          {/* Search Bar Visual Placeholder */}
          <SearchInput />
        </div>
      </div>

      {/* 2. Main Marketplace Feed */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        {/* Category Quick-Filters Visual */}
        <CategoryFilters />

        {items.length === 0 ?
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-400">
              No cravings available right now.
            </h2>
            <p className="text-gray-400 mt-2">
              Check back later when our Vandies are live!
            </p>
          </div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Visual Placeholder for Food Image */}
                <div className="h-48 bg-orange-100 relative overflow-hidden flex items-center justify-center">
                  <span className="text-orange-300 font-black text-5xl opacity-30 italic">
                    VANDIE
                  </span>
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-orange-600 shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Store Link */}
                  <Link
                    href={`/vandies/${item.ownerId}`}
                    className="flex items-center gap-x-2 text-xs font-bold text-orange-600 mb-2 w-fit"
                  >
                    <FaStore size={12} />
                    <span className="uppercase tracking-tighter hover:underline">
                      {item.storeName}
                    </span>
                    {item.isVandyLive ?
                      <span className="text-[10px] bg-green-100 text-green-600 px-1 rounded ml-1">
                        Live
                      </span>
                    : <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded ml-1">
                        OFFLINE
                      </span>
                    }
                  </Link>

                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1 italic">
                    {item.description ||
                      'Freshly prepared by our artisan chef.'}
                  </p>

                  <div className="flex items-center gap-x-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <FaMapMarkerAlt size={10} />
                    <span>{item.location}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                    <span className="text-2xl font-black text-gray-900">
                      <small className="text-sm font-bold mr-1 italic">৳</small>
                      {item.price}
                    </span>
                    <button
                      disabled={!item.isVandyLive}
                      className={`px-4 py-2 rounded-2xl text-xs font-black uppercase transition-all shadow-md ${
                        item.isVandyLive ?
                          'bg-black text-white hover:bg-orange-600 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {item.isVandyLive ? 'Add to Plate' : 'Closed'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </section>
  );
};

export default CravingsPage;
