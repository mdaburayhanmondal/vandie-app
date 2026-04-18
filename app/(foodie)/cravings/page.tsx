import CategoryFilters from '@/components/CategoryFilters';
import SearchInput from '@/components/SearchInput';
import FoodieItemCard from '@/components/FoodieItemCard';
import { getAvailableItems } from '@/lib/actions/item.actions';

const CravingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) => {
  const searchParamsObj = (await searchParams) || {};
  const searchQuery = searchParamsObj.search || '';
  const categoryQuery = searchParamsObj.category || 'All';

  const items = await getAvailableItems(searchQuery, categoryQuery);

  return (
    <section className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Hero Section */}
      <div className="bg-orange-600 text-white pt-16 pb-24 px-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-20 -mt-20 blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">
            DISCOVER YOUR CRAVINGS
          </h1>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto font-medium italic">
            Artisan street food, curated for your neighborhood.
          </p>

          <SearchInput />
        </div>
      </div>

      {/* 2. Marketplace Feed */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        {/* Category Buttons */}
        <div className="mb-8">
          <CategoryFilters />
        </div>

        {items.length === 0 ?
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-300">
              No {categoryQuery !== 'All' ? categoryQuery : ''} Cravings Found
            </h2>
            <p className="text-gray-400 mt-2 font-medium">
              Try a different category or search term!
            </p>
          </div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item: any) => (
              <FoodieItemCard key={item._id.toString()} item={item} />
            ))}
          </div>
        }
      </div>
    </section>
  );
};

export default CravingsPage;
