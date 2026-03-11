'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const categories = ['All', 'Snacks', 'Meals', 'Drinks', 'Desserts', 'Others'];

const CategoryFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentCategory = searchParams.get('category') || 'All';

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);

    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = currentCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`cursor-pointer px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm transition-all border ${
              isActive ?
                'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-100 hover:bg-orange-50 hover:border-orange-200'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilters;
