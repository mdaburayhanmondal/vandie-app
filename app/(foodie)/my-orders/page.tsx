'use client';

import React, { useState, useEffect } from 'react';
import { getUserOrderHistory } from '@/lib/actions/order.actions';
import Link from 'next/link';
import {
  FaChevronRight,
  FaBoxOpen,
  FaUtensils,
  FaCheckCircle,
  FaHistory,
  FaStar,
  FaSpinner,
} from 'react-icons/fa';
import ReviewModal from '@/components/ReviewModal';

export default function OrdersIndexPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getUserOrderHistory();
      setOrders(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const activeOrders = orders.filter((o: any) =>
    ['requested', 'approved', 'paid', 'preparing', 'ready'].includes(o.status),
  );
  const pastOrders = orders.filter((o: any) =>
    ['completed', 'rejected'].includes(o.status),
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-600" size={30} />
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto p-6 min-h-screen pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
          My Cravings
        </h1>
        <p className="text-gray-500 font-medium italic">
          Track your current plates and revisit your favorites.
        </p>
      </header>

      {/* ACTIVE ORDERS SECTION */}
      <div className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 mb-6 flex items-center gap-2">
          <FaUtensils className="animate-bounce" /> Active Orders (
          {activeOrders.length})
        </h2>

        {activeOrders.length === 0 ?
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-4xl p-10 text-center">
            <p className="text-gray-400 font-bold italic">
              No active orders. Hungry?
            </p>
            <Link
              href="/cravings"
              className="text-orange-600 text-xs font-black uppercase mt-2 inline-block hover:underline"
            >
              Explore Marketplace
            </Link>
          </div>
        : <div className="space-y-4">
            {activeOrders.map((order: any) => (
              <Link
                key={order._id}
                href={
                  ['requested', 'approved', 'paid'].includes(order.status) ?
                    '/cart'
                  : `/orders/${order._id}`
                }
                className="block bg-white border-2 border-orange-100 p-6 rounded-4xl shadow-xl shadow-orange-50/50 hover:border-orange-400 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      {order.status}
                    </span>
                    <h3 className="text-xl font-black italic text-gray-900 uppercase tracking-tighter">
                      {order.vandyName}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      {order.pickupDate} @ {order.pickupTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 leading-none">
                        {order.grandTotal}৳
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Total Bill
                      </p>
                    </div>
                    <FaChevronRight className="text-orange-200 group-hover:text-orange-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }
      </div>

      {/* PAST ORDERS SECTION */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
          <FaHistory /> Order History
        </h2>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          {pastOrders.length === 0 ?
            <div className="p-10 text-center text-gray-300 italic font-bold">
              You haven't completed any orders yet.
            </div>
          : <div className="divide-y divide-gray-50">
              {pastOrders.map((order: any) => {
                const hasReview = order.review?.rating;

                return (
                  <div
                    key={order._id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.status === 'completed' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}
                      >
                        {order.status === 'completed' ?
                          <FaCheckCircle size={20} />
                        : <FaBoxOpen size={20} />}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 uppercase italic tracking-tighter">
                          {order.vandyName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            {order.pickupDate}
                          </p>
                          {hasReview && (
                            <div className="flex items-center gap-0.5 text-orange-500">
                              <FaStar size={8} />
                              <span className="text-[9px] font-black">
                                {order.review.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <p className="font-black text-gray-900">
                          {order.grandTotal}৳
                        </p>
                        <Link
                          href={`/orders/${order._id}`}
                          className="text-[10px] font-black text-gray-400 uppercase hover:text-orange-600 transition-colors"
                        >
                          Details
                        </Link>
                      </div>

                      {/* Rate Meal */}
                      {order.status === 'completed' && !hasReview && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-orange-600 transition-all active:scale-95"
                        >
                          Rate Meal
                        </button>
                      )}

                      {hasReview && (
                        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter border border-green-100">
                          Reviewed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>

      {/* REVIEW MODAL OVERLAY */}
      {selectedOrder && (
        <ReviewModal
          orderId={selectedOrder._id}
          vandyName={selectedOrder.vandyName}
          onClose={() => {
            setSelectedOrder(null);
            // Refresh local state after review
            getUserOrderHistory().then(setOrders);
          }}
        />
      )}
    </section>
  );
}
