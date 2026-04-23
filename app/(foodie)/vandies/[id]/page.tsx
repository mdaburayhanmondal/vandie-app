import AddToCartButton from '@/components/AddToCartBtn';
import { getVandyDetails } from '@/lib/actions/store.actions';
import { IItem } from '@/lib/models/item.model';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import {
  FaMapMarkerAlt,
  FaChevronLeft,
  FaStar,
  FaQuoteLeft,
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
        <h1 className="text-2xl font-black text-gray-400 italic uppercase tracking-tighter">
          Vandy not found!
        </h1>
        <Link
          href="/vandies"
          className="mt-4 text-orange-600 font-black uppercase text-xs tracking-widest hover:underline"
        >
          ← Back to directory
        </Link>
      </div>
    );
  }

  const { vandy, items, reviews } = data;

  return (
    <section className="min-h-screen bg-gray-50">
      {/* 1. Hero Cover Banner Section */}
      <div className="h-64 md:h-96 w-full relative bg-orange-600">
        {vandy.coverImage && (
          <Image
            src={vandy.coverImage}
            alt={vandy.storeName}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8">
          <Link
            href="/vandies"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            <FaChevronLeft /> Back
          </Link>
        </div>

        {/* Floating Profile Info in Banner */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none">
                  {vandy.storeName}
                </h1>
                {vandy.averageRating > 0 && (
                  <div className="hidden md:flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-2xl shadow-xl">
                    <FaStar size={16} />
                    <span className="font-black text-lg">
                      {vandy.averageRating}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <FaMapMarkerAlt className="text-orange-500" />{' '}
                  {vandy.location}
                </div>
                <span
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm ${
                    vandy.isLive ?
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  {vandy.isLive ? '● Live Now' : '○ Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Bio & Reviews */}
          <div className="lg:col-span-1 space-y-12">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b pb-3">
                The Artisan's Story
              </h3>
              <p className="text-gray-600 font-medium italic leading-relaxed">
                {vandy.bio ||
                  'Crafting unique street flavors for the community.'}
              </p>
            </div>

            {/* Top Review Preview */}
            {reviews?.length > 0 && (
              <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <FaQuoteLeft
                  className="absolute top-6 right-6 text-white/10"
                  size={40}
                />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">
                  Latest Feedback
                </h3>
                <p className="text-lg font-black italic leading-tight mb-8">
                  "{reviews[0].review.comment}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={10}
                        className={
                          i < reviews[0].review.rating ?
                            'fill-current'
                          : 'text-gray-800'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">
                    {new Date(reviews[0].review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Menu Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter shrink-0">
                Fresh from the Cart
              </h2>
              <div className="h-0.5 flex-1 bg-gray-100 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item: IItem) => (
                <div
                  key={item._id?.toString()}
                  className="bg-white border border-gray-100 rounded-4xl p-6 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-24 w-24 bg-orange-50 rounded-2xl flex items-center justify-center overflow-hidden">
                      <span className="text-orange-200 font-black text-3xl opacity-40 italic uppercase">
                        {item.category.slice(0, 2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                      <p className="text-2xl font-black text-gray-900 mt-2">
                        {item.price}৳
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors mb-2 italic">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-xs italic line-clamp-2 mb-6">
                    {item.description}
                  </p>

                  <AddToCartButton
                    className="w-full bg-black text-white py-4 rounded-xl text-xs font-black uppercase hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:bg-gray-100"
                    item={
                      {
                        ...item,
                        storeName: vandy.storeName,
                        isVandyLive: vandy.isLive,
                        ownerId: vandy.ownerId,
                      } as any
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VandyDetailsPage;
