'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, useCart } from '@/contexts/cartContext';
import {
  createOrderRequest,
  getActiveOrder,
  cancelOrder,
} from '@/lib/actions/order.actions';
import Link from 'next/link';
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaStore,
  FaReceipt,
  FaClock,
  FaCalendarAlt,
  FaSpinner,
  FaHourglassHalf,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalPrePay,
    totalItems,
    clearCart,
  } = useCart();

  // Step 1 & 2 State
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const platformFee = 0;
  const grandTotal = totalPrice + platformFee;
  const dueAtPickup = grandTotal - totalPrePay;

  // Check for existing active orders
  useEffect(() => {
    async function init() {
      const order = await getActiveOrder();
      if (order) setActiveOrder(order);
      setInitialCheckDone(true);
    }
    init();
  }, []);

  // Polling for status updates if we have a requested order
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeOrder && activeOrder.status === 'requested') {
      interval = setInterval(async () => {
        const order = await getActiveOrder();
        if (order && order.status !== 'requested') {
          setActiveOrder(order);
          // If approved, we might want to play a sound or alert
        } else if (!order) {
          // If order is null, Vandy might have rejected/deleted it
          setActiveOrder(null);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  const handleCheckAvailability = async () => {
    if (!pickupDate || !pickupTime) {
      alert('Please select both a date and time for pickup!');
      return;
    }

    setLoading(true);

    const orderData = {
      vandyId: cart[0].vandyId,
      vandyName: cart[0].vandyName,
      items: cart.map((item) => ({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      pickupDate,
      pickupTime,
      totalPrice,
      totalPrePay,
      grandTotal,
      dueAtPickup,
    };

    const result = await createOrderRequest(orderData);

    if (result.success) {
      // Fetch the order back to set active state
      const order = await getActiveOrder();
      setActiveOrder(order);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleCancelRequest = async () => {
    if (!activeOrder) return;
    if (!confirm('Are you sure you want to cancel this request?')) return;

    setLoading(true);
    const result = await cancelOrder(activeOrder._id);
    if (result.success) {
      setActiveOrder(null);
    } else {
      alert('Failed to cancel order.');
    }
    setLoading(false);
  };

  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-600" size={30} />
      </div>
    );
  }

  if (cart.length === 0 && !activeOrder) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FaReceipt size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter mb-2">
          Your plate is empty
        </h1>
        <Link
          href="/cravings"
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm mt-4"
        >
          Explore Marketplace
        </Link>
      </section>
    );
  }

  const vandyName = activeOrder?.vandyName || cart[0]?.vandyName;

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/cravings"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-600 uppercase transition-colors"
        >
          <FaArrowLeft /> Keep Browsing
        </Link>
        {!activeOrder && (
          <button
            onClick={clearCart}
            className="text-[10px] font-black text-red-400 uppercase tracking-widest"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <FaStore size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Ordering from
              </p>
              <h2 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
                {vandyName}
              </h2>
            </div>
          </div>

          {!activeOrder ?
            <div className="space-y-4">
              {cart.map((item: CartItem) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center font-black text-orange-200 text-xs uppercase italic text-center p-2">
                    {item.category}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-orange-600 font-bold text-sm">
                      {item.price}৳
                    </p>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="p-2"
                    >
                      <FaMinus size={8} />
                    </button>
                    <span className="w-4 text-center font-black text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="p-2"
                    >
                      <FaPlus size={8} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          : <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 text-center shadow-sm">
              {activeOrder.status === 'requested' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <FaHourglassHalf size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase text-gray-900">
                      Waiting for Vandy
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 italic leading-relaxed">
                      We've notified {vandyName}. They are checking if they can
                      fulfill your pre-order for {activeOrder.pickupDate} at{' '}
                      {activeOrder.pickupTime}.
                    </p>
                  </div>
                  <button
                    onClick={handleCancelRequest}
                    disabled={loading}
                    className="text-red-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-600 underline disabled:opacity-50"
                  >
                    Cancel Request
                  </button>
                </div>
              )}

              {activeOrder.status === 'approved' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-100">
                    <FaCheckCircle size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase text-gray-900">
                      Request Approved!
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 font-medium">
                      {vandyName} has accepted your order. Please pay the
                      pre-payment amount below to confirm your plate.
                    </p>
                  </div>
                  {/* Step 3 (Payment) UI will go here next */}
                  <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">
                      Pre-Payment Required
                    </p>
                    <p className="text-4xl font-black text-gray-900">
                      {activeOrder.totalPrePay}৳
                    </p>
                  </div>
                </div>
              )}
            </div>
          }
        </div>

        {/* 2. Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b pb-4">
              Bill Summary
            </h2>

            {!activeOrder ?
              <>
                <div className="mb-8 space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Pickup Schedule
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <FaCalendarAlt
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                        size={14}
                      />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                    <div className="relative">
                      <FaClock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                        size={14}
                      />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="text-gray-900 font-bold">
                      {totalPrice}৳
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Platform Fee</span>
                    <span className="text-gray-900 font-bold">
                      {platformFee}৳
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Pre Pay Amount</span>
                    <span className="text-gray-900 font-bold">
                      {totalPrePay}৳
                    </span>
                  </div>
                  <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between gap-x-2">
                    <span className="text-lg font-black text-gray-900 uppercase italic">
                      To Pay When Pick
                    </span>
                    <span className="text-2xl font-black text-orange-600">
                      {dueAtPickup}৳
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckAvailability}
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-black text-white font-black uppercase text-lg shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  {loading ?
                    <FaSpinner className="animate-spin" />
                  : 'Check Availability'}
                </button>
              </>
            : <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Bill Amount
                    </span>
                    <span className="font-black text-gray-900">
                      {activeOrder.grandTotal}৳
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-orange-600">
                    <span className="text-xs font-bold uppercase">
                      Pre-pay Now
                    </span>
                    <span className="font-black">
                      {activeOrder.totalPrePay}৳
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  <FaExclamationCircle /> Status updates automatically
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
