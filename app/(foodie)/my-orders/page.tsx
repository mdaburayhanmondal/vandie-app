import { getUserOrderHistory } from '@/lib/actions/order.actions';
import Link from 'next/link';
import {
  FaChevronRight,
  FaBoxOpen,
  FaUtensils,
  FaCheckCircle,
  FaHistory,
} from 'react-icons/fa';

export default async function OrdersIndexPage() {
  const orders = await getUserOrderHistory();

  const activeOrders = orders.filter((o: any) =>
    ['requested', 'approved', 'paid', 'preparing', 'ready'].includes(o.status),
  );
  const pastOrders = orders.filter((o: any) =>
    ['completed', 'rejected'].includes(o.status),
  );

  return (
    <section className="max-w-4xl mx-auto p-6 min-h-screen">
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
                  (
                    order.status === 'requested' ||
                    order.status === 'approved' ||
                    order.status === 'paid'
                  ) ?
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
        <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden shadow-sm">
          {pastOrders.length === 0 ?
            <div className="p-10 text-center text-gray-300 italic font-bold">
              You haven't completed any orders yet.
            </div>
          : <div className="divide-y divide-gray-50">
              {pastOrders.map((order: any) => (
                <div
                  key={order._id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {order.pickupDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">
                      {order.grandTotal}৳
                    </p>
                    <Link
                      href={`/orders/${order._id}`}
                      className="text-[10px] font-black text-orange-600 uppercase hover:underline"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </section>
  );
}
