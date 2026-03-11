'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search')?.toString() || '',
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }

      replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, pathname, replace]);

  return (
    <div className="max-w-xl mx-auto relative group">
      <input
        type="text"
        placeholder="Search for Singara, Burgers, or Chai..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all text-lg border border-gray-100"
      />
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors size-5 group-focus-within:text-orange-500" />
    </div>
  );
};

export default SearchInput;
