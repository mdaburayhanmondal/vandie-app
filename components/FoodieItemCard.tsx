'use client';

import Link from 'next/link';
import { FaStore, FaMapMarkerAlt, FaBan } from 'react-icons/fa';
import AddToCartButton from './AddToCartBtn';

interface FoodieItemCardProps {
  item: {
    _id: string;
    name: string;
    price: number;
    prePayAmount: number;
    category: string;
    description?: string;
    location?: string;
    ownerId: string;
    storeName: string;
    isVandyLive: boolean;
    isAvailable: boolean;
  };
}

export default function FoodieItemCard({ item }: FoodieItemCardProps) {
  const itemId = item._id?.toString();
  const vandyId = item.ownerId?.toString();

  const isSoldOut = !item.isAvailable;
  const isOffline = !item.isVandyLive;
  const canOrder = !isOffline && !isSoldOut;

  return (
    <div
      className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden flex flex-col h-full group relative ${
        canOrder ?
          'border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1'
        : 'border-dashed border-gray-200 opacity-80'
      }`}
    >
      {/* 1. Image / Category Backdrop */}
      <Link
        href={`/cravings/${itemId}`}
        className="h-48 bg-orange-100 relative overflow-hidden flex items-center justify-center"
      >
        <span className="text-orange-300 font-black text-5xl opacity-30 italic uppercase group-hover:scale-110 transition-transform duration-500">
          {item.category}
        </span>

        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-orange-600 shadow-sm uppercase tracking-widest">
          {item.category}
        </span>

        {/* Status Overlays */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-xl tracking-widest">
              Sold Out
            </span>
          </div>
        )}
        {!isSoldOut && isOffline && (
          <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-xl tracking-widest">
              Vandy Resting
            </span>
          </div>
        )}
      </Link>

      {/* 2. Content Area */}
      <div className="p-6 flex-1 flex flex-col relative">
        {/* Store Attribution */}
        <div className="absolute -top-4 left-6 z-10">
          <Link
            href={`/vandies/${vandyId}`}
            className="flex items-center gap-x-2 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all group/store"
          >
            <FaStore className="text-orange-600" size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-700 group-hover/store:text-orange-600">
              {item.storeName}
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-400' : 'bg-green-500 animate-pulse'}`}
            />
          </Link>
        </div>

        <div className="mt-4 mb-4 flex-1">
          <Link href={`/cravings/${itemId}`}>
            <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs italic line-clamp-2 leading-relaxed">
            {item.description ||
              'A unique artisan creation made with fresh local ingredients.'}
          </p>
        </div>

        <div className="flex items-center gap-x-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
          <FaMapMarkerAlt size={10} className="text-orange-600/50" />
          <span>{item.location}</span>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex justify-between items-center pt-5 border-t border-gray-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              Price
            </span>
            <span className="text-2xl font-black text-gray-900 leading-none">
              <small className="text-sm font-bold mr-0.5 italic text-orange-600">
                ৳
              </small>
              {item.price}
            </span>
          </div>

          {canOrder ?
            <AddToCartButton
              item={{
                _id: item._id,
                name: item.name,
                price: item.price,
                prePayAmount: item.prePayAmount,
                category: item.category,
                ownerId: item.ownerId,
                storeName: item.storeName,
              }}
            />
          : <button
              disabled
              className="bg-gray-100 text-gray-400 px-6 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest cursor-not-allowed flex items-center gap-2"
            >
              <FaBan size={12} /> {isOffline ? 'Offline' : 'Sold Out'}
            </button>
          }
        </div>
      </div>
    </div>
  );
}
