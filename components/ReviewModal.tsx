'use client';

import { submitOrderReview } from '@/lib/actions/order.actions';
import { useState } from 'react';
import { FaStar, FaSpinner, FaPaperPlane } from 'react-icons/fa';

export default function ReviewModal({ orderId, vandyName, onClose }: any) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return alert('Please select a rating!');
    setLoading(true);
    const res = await submitOrderReview(orderId, rating, comment);
    if (res.success) {
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="text-center">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
            How was it?
          </h3>
          <p className="text-gray-400 text-sm font-medium italic mb-8 uppercase tracking-widest">
            Reviewing {vandyName}
          </p>

          {/* Star Selection */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <FaStar
                  size={40}
                  className={`transition-colors duration-200 ${
                    star <= (hover || rating) ?
                      'text-orange-500'
                    : 'text-gray-100'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment Box */}
          <textarea
            placeholder="Tell us about the taste, portion, or the Vandy's vibe..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 p-6 bg-gray-50 border-2 border-gray-100 rounded-4xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all italic mb-6 resize-none"
          />

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-sm shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
            >
              {loading ?
                <FaSpinner className="animate-spin" />
              : <>
                  <FaPaperPlane /> Send Review
                </>
              }
            </button>
            <button
              onClick={onClose}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
