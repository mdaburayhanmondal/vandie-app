'use client';

import { useState } from 'react';
import { toggleLiveStatus } from '@/lib/actions/store.actions';
import { FaPowerOff } from 'react-icons/fa';

interface ToggleProps {
  status: boolean;
  storeId: string;
}

const LiveStatusToggle = ({ status, storeId }: ToggleProps) => {
  const [isLive, setIsLive] = useState(status);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);

    const previousState = isLive;
    setIsLive(!previousState);

    const result = await toggleLiveStatus(storeId, previousState);

    if (!result.success) {
      setIsLive(previousState);
      alert('Failed to update status. Try again.');
    }

    setIsPending(false);
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm w-fit">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Store Status
        </span>
        <span
          className={`text-sm font-bold ${isLive ? 'text-green-600' : 'text-red-500'}`}
        >
          {isLive ? '● ONLINE' : '○ OFFLINE'}
        </span>
      </div>

      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${
          isLive ? 'bg-green-500' : 'bg-gray-300'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
            isLive ? 'translate-x-9' : 'translate-x-1'
          } flex items-center justify-center shadow-sm`}
        >
          <FaPowerOff
            size={20}
            className={`${isLive ? 'text-green-500' : 'text-gray-300'} translate-y-0.5 translate-x-0.5`}
          />
        </span>
      </button>
    </div>
  );
};

export default LiveStatusToggle;
