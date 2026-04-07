'use client';

import React, { useState } from 'react'; // Added useState
import { CartItem, useCart } from '@/contexts/cartContext';
import Link from 'next/link';
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaStore,
  FaReceipt,
  FaClock, // Added icon
  FaCalendarAlt, // Added icon
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

  // Step 1: State for Pickup Details
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const deliveryFee = cart.length > 0 ? 30 : 0;
  const grandTotal = totalPrice - totalPrePay;

  if (cart.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FaReceipt size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter mb-2">
          Your plate is empty
        </h1>
        <p className="text-gray-500 mb-8 max-w-xs italic">
          Looks like you haven't discovered your cravings yet. Let's find
          something delicious!
        </p>
        <Link
          href="/cravings"
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-orange-600 transition-all shadow-xl active:scale-95"
        >
          Explore Marketplace
        </Link>
      </section>
    );
  }

  const vandyName = cart[0].vandyName;

  // Handler for the next step (logic will be added in Step 2)
  const handleCheckAvailability = () => {
    if (!pickupDate || !pickupTime) {
      alert('Please select both a date and time for pickup!');
      return;
    }
    console.log('Requesting availability for:', { pickupDate, pickupTime });
    // This is where we will call the Server Action to create the Order record
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 min-h-screen">
      {/* ... Header and Item List remain the same ... */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/cravings"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
        >
          <FaArrowLeft /> Keep Browsing
        </Link>
        <button
          onClick={clearCart}
          className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* ... Item List Content ... */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <FaStore size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
                Ordering from
              </p>
              <h2 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
                {vandyName}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {cart.map((item: CartItem) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group"
              >
                <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center font-black text-orange-200 text-xs uppercase italic text-center p-2">
                  {item.category}
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-lg leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-orange-600 font-bold text-sm">
                    {item.price}৳
                  </p>
                </div>

                <div className="flex items-center bg-gray-50 rounded-2xl p-1 gap-2 border border-gray-100">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="w-6 text-center font-black text-gray-900 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b pb-4">
              Bill Summary
            </h2>

            {/* Step 1 UI: Pickup Time Section */}
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
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>

                <div className="relative">
                  <FaClock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                    size={14}
                  />
                  <input
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-gray-900 font-bold">{totalPrice}৳</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Pre Pay Amount</span>
                <span className="text-gray-900 font-bold">{totalPrePay}৳</span>
              </div>

              {totalPrePay > 0 ?
                <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between gap-x-2">
                  <span className="text-lg font-black text-gray-900 uppercase italic">
                    To Pay When Pick
                  </span>
                  <span className="text-2xl font-black text-orange-600">
                    {grandTotal}৳
                  </span>
                </div>
              : <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between gap-x-2">
                  <span className="text-lg font-black text-gray-900 uppercase italic">
                    Pay When Pick
                  </span>
                  {/* Since grandTotal is totalPrice - totalPrePay, and totalPrePay is 0, it works fine */}
                  <span className="text-2xl font-black text-orange-600">
                    {grandTotal}৳
                  </span>
                </div>
              }
            </div>

            <button
              onClick={handleCheckAvailability}
              className="w-full py-5 rounded-2xl bg-black text-white font-black uppercase text-lg shadow-xl hover:bg-orange-600 transition-all active:scale-[0.98] shadow-orange-100 cursor-pointer"
            >
              Check Availability
            </button>

            <p className="text-[10px] text-gray-400 font-bold text-center mt-4 uppercase tracking-widest">
              Pre Pay via bKash
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
