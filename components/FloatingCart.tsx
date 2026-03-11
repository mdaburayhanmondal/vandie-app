'use client';

import Link from 'next/link';
import { FaUtensils, FaChevronRight } from 'react-icons/fa';
import { useCart } from '@/contexts/cartContext';

const FloatingCart = () => {
  const { totalItems, totalPrice, currentVandyId, cart } = useCart();

  // Don't show anything if the cart is empty
  if (totalItems === 0) return null;

  // We find the Vandy Name from the first item in the cart
  const vandyName = cart[0]?.vandyName || 'Vandy';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-90 w-full max-w-md px-4 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <Link
        href="/cart"
        className="flex items-center justify-between bg-black text-white p-4 rounded-4xl shadow-2xl hover:bg-orange-600 transition-all active:scale-95 group"
      >
        <div className="flex items-center gap-4">
          {/* Icon with Counter Badge */}
          <div className="relative bg-white/20 p-3 rounded-2xl">
            <FaUtensils className="text-white" size={20} />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
              {totalItems}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-300">
              Your Plate from {vandyName}
            </span>
            <span className="text-xl font-black">
              {totalPrice}৳{' '}
              <span className="text-xs font-medium text-gray-400 ml-1">
                Total
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <span className="text-xs font-black uppercase tracking-tighter group-hover:mr-1 transition-all">
            View Plate
          </span>
          <FaChevronRight size={14} className="text-orange-400" />
        </div>
      </Link>
    </div>
  );
};

export default FloatingCart;
