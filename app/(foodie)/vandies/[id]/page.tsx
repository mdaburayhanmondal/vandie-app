import AddToCartButton from '@/components/AddToCartBtn';
import { getVandyDetails } from '@/lib/actions/store.actions';
import { IItem } from '@/lib/models/item.model';
import Link from 'next/link';
import React from 'react';
import {
  FaMapMarkerAlt,
  FaChevronLeft,
  FaStar,
  FaQuoteLeft,
  FaCalendarDay,
} from 'react-icons/fa';

const VandyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const data = await getVandyDetails(id);

  if (!data || !data.vandy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-black text-gray-400 italic uppercase">
          Vandy not found!
        </h1>
        <Link
          href="/vandies"
          className="mt-4 text-orange-600 font-bold uppercase text-xs tracking-widest hover:underline"
        >
          ← Back to directory
        </Link>
      </div>
    );
  }

  const { vandy, items, reviews } = data;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 pb-32">
      {/* 1. Vandy Header Card */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] mb-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-bl-full -mr-16 -mt-16 opacity-50" />

        <Link
          href="/vandies"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-orange-600 mb-8 uppercase tracking-widest transition-colors relative z-10"
        >
          <FaChevronLeft /> Back to directory
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl font-black italic text-gray-900 tracking-tighter uppercase leading-none">
                {vandy.storeName}
              </h1>
              {vandy.averageRating > 0 && (
                <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-2xl shadow-xl shadow-orange-100">
                  <FaStar className="text-orange-500" size={16} />
                  <span className="font-black text-lg">
                    {vandy.averageRating}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter border-l border-gray-800 pl-2">
                    {vandy.totalReviews} Reviews
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-500 max-w-2xl text-lg italic leading-relaxed">
              {vandy.bio ||
                "This artisan is busy perfecting their craft and hasn't written a bio yet."}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                <FaMapMarkerAlt className="text-orange-600" /> {vandy.location}
              </div>
              <span
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                  vandy.isLive ?
                    'bg-green-50 text-green-700 border-green-100'
                  : 'bg-red-50 text-red-400 border-red-100'
                }`}
              >
                {vandy.isLive ? '● Live Now' : '○ Currently Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter shrink-0">
          On the Menu
        </h2>
        <div className="h-0.5 flex-1 bg-gray-100 rounded-full" />
      </div>

      {items.length === 0 ?
        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold italic">
            This Vandy hasn't listed any items today.
          </p>
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {items.map((item: IItem) => {
            const enrichedItem = {
              ...item,
              storeName: vandy.storeName,
              isVandyLive: vandy.isLive,
            };

            return (
              <div
                key={item._id?.toString()}
                className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
              >
                <Link
                  href={`/cravings/${item._id}`}
                  className="h-44 bg-orange-50 flex items-center justify-center overflow-hidden"
                >
                  <span className="text-orange-200 font-black text-4xl opacity-40 italic uppercase group-hover:scale-110 transition-transform">
                    {item.category}
                  </span>
                </Link>

                <div className="p-8 flex-1 flex flex-col">
                  <Link href={`/cravings/${item._id}`} className="block mb-3">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-gray-500 text-xs italic line-clamp-2 mb-8 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-1">
                        Price
                      </span>
                      <span className="text-2xl font-black text-gray-900 leading-none">
                        <small className="text-sm font-bold mr-0.5 text-orange-600 italic">
                          ৳
                        </small>
                        {item.price}
                      </span>
                    </div>

                    {vandy.isLive && item.isAvailable ?
                      <AddToCartButton item={enrichedItem as any} />
                    : <button
                        disabled
                        className="bg-gray-100 text-gray-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase cursor-not-allowed tracking-widest"
                      >
                        {!vandy.isLive ? 'Offline' : 'Sold Out'}
                      </button>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }

      {/* Reviews Section */}
      <div className="mt-20">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter shrink-0">
            Wall of Love
          </h2>
          <div className="h-0.5 flex-1 bg-gray-100 rounded-full" />
        </div>

        {!reviews || reviews.length === 0 ?
          <div className="bg-gray-50 p-16 rounded-[3rem] text-center border border-gray-100">
            <p className="text-gray-400 font-bold italic uppercase tracking-widest text-sm">
              No reviews yet. Be the first to try their food!
            </p>
          </div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm relative group hover:border-orange-200 transition-all"
              >
                <FaQuoteLeft
                  className="absolute top-8 right-8 text-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  size={40}
                />

                <div className="flex items-center gap-1 text-orange-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={
                        i < review.review.rating ?
                          'fill-current'
                        : 'text-gray-100'
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-700 font-medium text-lg italic mb-8 leading-relaxed relative z-10">
                  "{review.review.comment || 'Amazing food and great service!'}"
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xs uppercase">
                      F
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-900 tracking-widest">
                        Verified Foodie
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                        <FaCalendarDay />{' '}
                        {new Date(review.review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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

export default VandyDetailsPage;
