'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaStore, FaMapMarkerAlt, FaBan, FaStar } from 'react-icons/fa';
import AddToCartButton from './AddToCartBtn';

interface FoodieItemCardProps {
  item: {
    _id: string;
    name: string;
    price: number;
    prePayAmount: number;
    category: string;
    image?: string;
    description?: string;
    location?: string;
    ownerId: string;
    storeName: string;
    isVandyLive: boolean;
    isAvailable: boolean;
    averageRating?: number;
    totalReviews?: number;
  };
}

export default function FoodieItemCard({ item }: FoodieItemCardProps) {
  const itemId = item._id?.toString();
  const vandyId = item.ownerId?.toString();

  const isSoldOut = !item.isAvailable;
  const isOffline = !item.isVandyLive;
  const canOrder = !isOffline && !isSoldOut;

  const rating = item.averageRating || 0;
  const reviews = item.totalReviews || 0;

  return (
    <div
      className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden flex flex-col h-full group relative ${
        canOrder ?
          'border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1'
        : 'border-dashed border-gray-200 opacity-80'
      }`}
    >
      {/* 1. Image Area / Actual Item Image */}
      <Link
        href={`/cravings/${itemId}`}
        className="h-48 bg-orange-100 relative overflow-hidden flex items-center justify-center"
      >
        {item.image ?
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
        : <span className="text-orange-300 font-black text-5xl opacity-30 italic uppercase transition-transform duration-500 select-none">
            {item.category}
          </span>
        }

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-orange-600 shadow-sm uppercase tracking-widest border border-orange-50">
            {item.category}
          </span>

          {reviews > 0 ?
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-white flex items-center gap-1 shadow-lg border border-white/10">
              <FaStar className="text-orange-500" size={10} />
              <span className="text-[10px] font-black">{rating}</span>
            </div>
          : <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest">
              New Vandy
            </span>
          }
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-xl tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* 2. Content */}
      <div className="p-6 flex-1 flex flex-col relative">
        <div className="absolute -top-4 left-6 z-50">
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
            <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter">
              {item.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs italic line-clamp-2 leading-relaxed">
            {item.description || 'Artisan preparation with local flavors.'}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-x-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <FaMapMarkerAlt size={10} className="text-orange-600/50" />
            <span>{item.location}</span>
          </div>
          {reviews > 0 && (
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
              {reviews} Reviews
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-gray-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mb-1">
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
