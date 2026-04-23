'use client';

import { IStore } from '@/lib/models/store.model';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaStore,
  FaCheck,
  FaTimes,
  FaIdCard,
  FaSpinner,
} from 'react-icons/fa';
import { useState } from 'react';

interface VandyApplicationCardProps {
  application: IStore;
  approveAction: (id: string) => Promise<any>;
  rejectAction: (id: string) => Promise<any>;
}

export default function VandyApplicationCard({
  application,
  approveAction,
  rejectAction,
}: VandyApplicationCardProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (actionType: 'approve' | 'reject') => {
    setLoading(actionType);
    const id = application._id as string;

    try {
      if (actionType === 'approve') {
        await approveAction(id);
      } else {
        await rejectAction(id);
      }
    } catch (err) {
      console.error(err);
      alert('Action failed. Check console.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
      {/* 1. The Verification Image (Crucial for the Warden) */}
      <div className="h-56 bg-orange-50 relative overflow-hidden flex items-center justify-center">
        {application.coverImage ?
          <Image
            src={application.coverImage}
            alt="Cart Verification"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            unoptimized
          />
        : <div className="flex flex-col items-center gap-2 opacity-20">
            <FaIdCard size={40} className="text-orange-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              No Image Provided
            </span>
          </div>
        }

        <div className="absolute top-4 left-4">
          <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
            Live Cart Photo
          </span>
        </div>
      </div>

      {/* 2. Application Content */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FaStore className="text-orange-600" size={14} />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            #{application._id?.toString().slice(-8).toUpperCase()}
          </span>
        </div>

        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
          {application.storeName}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 mb-6">
          <FaMapMarkerAlt size={12} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {application.location}
          </span>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl mb-8 flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <FaIdCard size={10} /> Artisan Bio
          </p>
          <p className="text-xs italic text-gray-600 leading-relaxed line-clamp-4 font-medium">
            "{application.bio}"
          </p>
        </div>

        {/* 3. Decision Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => handleAction('approve')}
            disabled={!!loading}
            className="flex-1 bg-black text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95"
          >
            {loading === 'approve' ?
              <FaSpinner className="animate-spin" />
            : <>
                <FaCheck /> Approve
              </>
            }
          </button>

          <button
            onClick={() => handleAction('reject')}
            disabled={!!loading}
            className="flex-1 border-2 border-gray-100 text-gray-400 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading === 'reject' ?
              <FaSpinner className="animate-spin" />
            : <>
                <FaTimes /> Reject
              </>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
