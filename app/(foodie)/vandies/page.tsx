import { getVandies } from '@/lib/actions/store.actions';
import { IStore } from '@/lib/models/store.model';
import Link from 'next/link';
import { FaStore, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const VandiesPage = async () => {
  const vandies = await getVandies();
  return (
    <section className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase">
          Meet the Vandies
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Explore the local artisans bringing flavor to your streets.
        </p>
        <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {vandies && vandies.length > 0 ?
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vandies.map((vandie: IStore) => {
            return (
              <li key={vandie._id?.toString()} className="group">
                <Link
                  href={`/vandies/${vandie.ownerId}`}
                  className="flex flex-col h-full bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <FaStore size={24} />
                    </div>
                    {vandie.isLive ?
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                        Live Now
                      </span>
                    : <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                        Ofline
                      </span>
                    }
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {vandie.storeName}
                  </h2>

                  <p className="text-gray-500 text-sm italic line-clamp-2 mb-6 flex-1">
                    {vandie.bio || 'Supporting local street food culture.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <FaMapMarkerAlt size={12} />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        {vandie.location}
                      </span>
                    </div>
                    <div className="text-orange-600">
                      <FaChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      : <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold italic text-xl">
            No Vandies have joined the movement yet.
          </p>
          <Link
            href="/become-vandy"
            className="mt-4 text-orange-600 font-bold hover:underline"
          >
            Be the first to join →
          </Link>
        </div>
      }
    </section>
  );
};

export default VandiesPage;
