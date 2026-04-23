import { getVandies } from '@/lib/actions/store.actions';
import { IStore } from '@/lib/models/store.model';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaStore,
  FaMapMarkerAlt,
  FaChevronRight,
  FaStar,
} from 'react-icons/fa';

const VandiesPage = async () => {
  const vandies = await getVandies();

  return (
    <section className="max-w-7xl mx-auto p-6 min-h-screen pb-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 uppercase">
          Meet the Vandies
        </h1>
        <p className="text-gray-500 mt-2 font-medium italic">
          Explore the local artisans bringing flavor to your streets.
        </p>
        <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {vandies && vandies.length > 0 ?
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {vandies.map((vandie: IStore) => {
            const hasReviews = (vandie.totalReviews || 0) > 0;

            return (
              <li key={vandie._id?.toString()} className="group">
                <Link
                  href={`/vandies/${vandie.ownerId}`}
                  className="flex flex-col h-full bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all duration-500"
                >
                  {/* 1. Image Area / Banner Preview */}
                  <div className="h-48 bg-orange-50 relative overflow-hidden flex items-center justify-center">
                    {vandie.coverImage ?
                      <Image
                        src={vandie.coverImage}
                        alt={vandie.storeName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                      />
                    : <div className="flex flex-col items-center gap-2 opacity-20">
                        <FaStore size={40} className="text-orange-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                          No Banner
                        </span>
                      </div>
                    }

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      {vandie.isLive && (
                        <span className="bg-green-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          Live Now
                        </span>
                      )}

                      {hasReviews && (
                        <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm border border-orange-50">
                          <FaStar className="text-orange-500" size={12} />
                          <span className="text-xs font-black text-gray-900">
                            {vandie.averageRating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h2 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter">
                      {vandie.storeName}
                    </h2>

                    <p className="text-gray-500 text-sm italic line-clamp-2 mb-8 flex-1 leading-relaxed">
                      {vandie.bio ||
                        'Supporting local street food culture through artisan craft.'}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <FaMapMarkerAlt size={12} className="text-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {vandie.location}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <FaChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      : <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <p className="text-gray-300 font-black italic text-2xl uppercase tracking-tighter">
            No Vandies Online
          </p>
          <Link
            href="/become-vandy"
            className="mt-4 text-orange-600 font-black text-xs uppercase tracking-widest hover:underline"
          >
            Be the first to join the movement →
          </Link>
        </div>
      }
    </section>
  );
};

export default VandiesPage;
