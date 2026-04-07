'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, useCart } from '@/contexts/cartContext';
import {
  createOrderRequest,
  getActiveOrder,
  cancelOrder,
  submitOrderPayment,
} from '@/lib/actions/order.actions';
import { useRouter } from 'next/navigation';
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
  FaWallet,
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

  const router = useRouter();
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const platformFee = cart.length > 0 ? 5 : 0;
  const grandTotal = totalPrice + platformFee;
  const dueAtPickup = grandTotal - totalPrePay;

  useEffect(() => {
    async function init() {
      const order = await getActiveOrder();
      if (order) setActiveOrder(order);
      setInitialCheckDone(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (
      activeOrder &&
      ['preparing', 'ready', 'completed'].includes(activeOrder.status)
    ) {
      router.push(`/orders/${activeOrder._id}`);
    }
  }, [activeOrder, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      activeOrder &&
      ['requested', 'approved', 'paid'].includes(activeOrder.status)
    ) {
      interval = setInterval(async () => {
        const order = await getActiveOrder();
        if (order) {
          setActiveOrder(order);
        } else {
          setActiveOrder(null);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  const handleCheckAvailability = async () => {
    if (!pickupDate || !pickupTime) return alert('Select date and time!');
    setLoading(true);

    const formattedItems = cart.map((item: CartItem) => ({
      itemId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const result = await createOrderRequest({
      vandyId: cart[0].vandyId,
      vandyName: cart[0].vandyName,
      items: formattedItems, // Send the mapped items
      pickupDate,
      pickupTime,
      totalPrice,
      totalPrePay,
      grandTotal,
      dueAtPickup,
    });

    if (result.success) {
      const order = await getActiveOrder();
      setActiveOrder(order);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handlePaymentSubmit = async () => {
    if (trxId.length < 8) return alert('Invalid TrxID');
    setLoading(true);
    const result = await submitOrderPayment(activeOrder._id, trxId);
    if (result.success) {
      clearCart();
      const updated = await getActiveOrder();
      setActiveOrder(updated);
    }
    setLoading(false);
  };

  if (!initialCheckDone)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-600" size={30} />
      </div>
    );

  if (
    activeOrder &&
    ['preparing', 'ready', 'completed'].includes(activeOrder.status)
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <FaSpinner className="animate-spin text-orange-600" size={40} />
        <p className="font-black italic uppercase tracking-tighter">
          Moving to kitchen...
        </p>
      </div>
    );
  }

  if (cart.length === 0 && !activeOrder) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
          Your plate is empty
        </h1>
        <Link
          href="/cravings"
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-sm"
        >
          Explore Marketplace
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/cravings"
          className="text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Cravings
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
                {activeOrder?.vandyName || cart[0]?.vandyName}
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
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-orange-600 font-bold text-sm">
                      {item.price}৳
                    </p>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 gap-2 border">
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
                    className="p-2 text-gray-300 hover:text-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          : <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 text-center shadow-sm">
              {activeOrder.status === 'requested' && (
                <div className="space-y-6">
                  <FaHourglassHalf
                    size={40}
                    className="text-orange-600 mx-auto animate-pulse"
                  />
                  <h3 className="text-2xl font-black italic uppercase text-gray-900">
                    Waiting for Vandy
                  </h3>
                  <p className="text-gray-500 text-sm italic">
                    Request sent for {activeOrder.pickupDate} at{' '}
                    {activeOrder.pickupTime}.
                  </p>
                  <button
                    onClick={() =>
                      cancelOrder(activeOrder._id).then(() =>
                        setActiveOrder(null),
                      )
                    }
                    className="text-red-400 font-bold uppercase text-[10px] underline"
                  >
                    Cancel Request
                  </button>
                </div>
              )}

              {activeOrder.status === 'approved' && (
                <div className="space-y-6">
                  <FaCheckCircle size={40} className="text-green-500 mx-auto" />
                  <h3 className="text-2xl font-black italic uppercase text-gray-900">
                    Approved!
                  </h3>
                  <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl space-y-4">
                    <p className="text-3xl font-black text-gray-900">
                      {activeOrder.totalPrePay}৳
                    </p>
                    <input
                      type="text"
                      placeholder="Enter bKash TrxID"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      className="w-full px-4 py-4 bg-white border-2 border-orange-200 rounded-2xl font-black text-center focus:ring-4 focus:ring-orange-100 outline-none uppercase"
                    />
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={loading}
                      className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase shadow-xl"
                    >
                      {loading ? 'Submitting...' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>
              )}

              {activeOrder.status === 'paid' && (
                <div className="space-y-6">
                  <FaWallet
                    size={40}
                    className="text-blue-500 mx-auto animate-bounce"
                  />
                  <h3 className="text-2xl font-black italic uppercase text-gray-900">
                    Verifying TrxID
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Vandy is checking TrxID:{' '}
                    <span className="font-bold">
                      {activeOrder.paymentDetails?.trxId}
                    </span>
                  </p>
                </div>
              )}
            </div>
          }
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 border-b pb-4">
              Bill Summary
            </h2>

            {!activeOrder ?
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Pickup Schedule
                  </p>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-4 border-t pt-4">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span>{totalPrice}৳</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Pre-pay</span>
                    <span className="text-orange-600">{totalPrePay}৳</span>
                  </div>
                  <div className="pt-2 border-t-2 border-dashed flex justify-between items-center">
                    <span className="text-sm font-black uppercase italic">
                      At Pickup
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {dueAtPickup + platformFee}৳
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckAvailability}
                  disabled={loading}
                  className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase shadow-lg hover:bg-orange-600 transition-all"
                >
                  {loading ? 'Checking...' : 'Check Availability'}
                </button>
              </div>
            : <div className="text-center py-6">
                <FaHourglassHalf
                  className="mx-auto text-gray-200 mb-4"
                  size={30}
                />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Order in Progress
                </p>
                <p className="text-xs font-bold text-gray-900 mt-1">
                  Review live updates in the left panel
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
