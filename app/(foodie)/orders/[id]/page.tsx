'use client';

import React, { useState, useEffect } from 'react';
import { getOrderStatus } from '@/lib/actions/order.actions';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaUtensils,
  FaStore,
  FaChevronLeft,
  FaCheckDouble,
  FaSpinner,
  FaExclamationTriangle,
  FaHeart,
} from 'react-icons/fa';
import { useParams } from 'next/navigation';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderStatus(id);
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-600" size={30} />
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold italic text-gray-400">
        Order not found.
      </div>
    );

  const steps = [
    {
      id: 'paid',
      label: 'Payment Verified',
      desc: 'Vandy confirmed your payment',
    },
    {
      id: 'preparing',
      label: 'In the Kitchen',
      desc: 'Your food is being prepared',
    },
    {
      id: 'ready',
      label: 'Ready for Pickup',
      desc: 'Grab your plate at the cart!',
    },
    {
      id: 'completed',
      label: 'Order Finished',
      desc: 'Hope you enjoyed the meal!',
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);
  const isCompleted = order.status === 'completed';

  return (
    <section className="max-w-3xl mx-auto p-6 min-h-screen pb-20">
      <Link
        href="/cravings"
        className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors mb-8"
      >
        <FaChevronLeft /> Back to Discovery
      </Link>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div
          className={`p-10 text-white relative transition-colors duration-500 ${
            isCompleted ? 'bg-black'
            : order.status === 'ready' ? 'bg-green-600'
            : 'bg-orange-600'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10" />
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <FaStore className="text-white" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                {isCompleted ? 'THANK YOU' : 'LIVE STATUS'}
              </p>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                {order.vandyName}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Timeline Column */}
            <div className="flex-1 space-y-10 relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

              {steps.map((step, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isFuture = idx > currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`relative flex gap-8 items-start transition-all duration-500 ${isFuture ? 'opacity-30' : 'opacity-100'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-sm transition-all duration-700 ${
                        isPast || (isCurrent && isCompleted) ?
                          'bg-green-500 text-white'
                        : isCurrent ?
                          'bg-orange-600 text-white scale-110 shadow-lg'
                        : 'bg-white border-2 border-gray-100 text-gray-300'
                      }`}
                    >
                      {isPast || (isCurrent && isCompleted) ?
                        <FaCheckCircle size={18} />
                      : isCurrent && step.id === 'preparing' ?
                        <FaUtensils size={18} className="animate-pulse" />
                      : isCurrent && step.id === 'ready' ?
                        <FaCheckDouble size={18} className="animate-bounce" />
                      : <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>

                    <div className="flex-1 pt-1">
                      <h3
                        className={`font-black uppercase text-sm italic tracking-tight ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}
                      >
                        {step.label}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Details Card */}
            <div className="w-full md:w-64 space-y-4">
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center border-b pb-3">
                  {isCompleted ? 'Order Summary' : 'Final Payment'}
                </h4>
                <div className="space-y-4">
                  <div className="flex flex-col text-center">
                    <span className="text-[10px] font-black uppercase text-orange-500">
                      Scheduled Time
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      {order.pickupTime}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-200">
                    <div
                      className={`flex justify-between items-center p-3 rounded-xl shadow-sm border ${isCompleted ? 'bg-green-50 border-green-100' : 'bg-white border-orange-100'}`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {isCompleted ? 'Total Paid' : 'Cash Due'}
                      </span>
                      <span
                        className={`text-xl font-black ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}
                      >
                        {isCompleted ?
                          `${order.grandTotal}৳`
                        : `${order.dueAtPickup}৳`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isCompleted ?
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                  <FaHeart className="text-orange-500" size={20} />
                  <p className="text-[10px] font-black text-orange-700 uppercase tracking-tighter">
                    Don't forget to review {order.vandyName}!
                  </p>
                </div>
              : order.status === 'ready' ?
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-start gap-3">
                  <FaExclamationTriangle
                    className="text-green-600 mt-1"
                    size={14}
                  />
                  <p className="text-[10px] font-bold text-green-700 uppercase leading-tight">
                    Show TrxID <strong>{order.paymentDetails?.trxId}</strong> to
                    the Vandy at pickup.
                  </p>
                </div>
              : <div className="p-4 rounded-2xl bg-gray-50 text-[10px] font-black text-gray-400 uppercase text-center border border-gray-100 italic">
                  Status updates automatically
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
