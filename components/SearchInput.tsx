'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [term, setTerm] = useState(
    searchParams.get('search')?.toString() || '',
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="max-w-xl mx-auto relative group flex items-center"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search for Singara, Burgers, or Chai..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full pl-12 pr-16 py-4 rounded-full text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all text-lg border border-gray-100"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors size-5 group-focus-within:text-orange-500" />
      </div>

      <button
        type="submit"
        className="absolute right-2 bg-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-black transition-colors shadow-lg active:scale-95 cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
