import {
  getVandyOrders,
  updateOrderStatus,
  rejectOrderRequest,
} from '@/lib/actions/order.actions';
import {
  FaClock,
  FaCheck,
  FaTimes,
  FaReceipt,
  FaUserCircle,
} from 'react-icons/fa';

export default async function VandyOrdersPage() {
  const orders = await getVandyOrders();

  // Filter orders into sections
  const requests = orders.filter((o: any) => o.status === 'requested');
  const activeOrders = orders.filter((o: any) =>
    ['approved', 'paid', 'preparing', 'ready'].includes(o.status),
  );

  return (
    <section className="max-w-5xl mx-auto p-6 space-y-10">
      <header>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">
          Order Management
        </h1>
        <p className="text-gray-500 text-sm">
          Review incoming requests and track active plates.
        </p>
      </header>

      {/* SECTION 1: INCOMING REQUESTS */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
          <FaReceipt /> Incoming Requests ({requests.length})
        </h2>

        {requests.length === 0 ?
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
            <p className="text-gray-400 font-bold italic">
              No new requests right now.
            </p>
          </div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((order: any) => (
              <div
                key={order._id}
                className="bg-white border-2 border-orange-100 rounded-[2rem] p-6 shadow-xl shadow-orange-50/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                    <FaClock className="text-orange-600" size={12} />
                    <span className="text-xs font-black text-orange-600">
                      {order.pickupDate} @ {order.pickupTime}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    #{order._id.slice(-6)}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-bold text-gray-800">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-400">
                        {item.price * item.quantity}৳
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t flex justify-between font-black text-gray-900">
                    <span>Total Bill:</span>
                    <span>{order.grandTotal}৳</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <form
                    action={async () => {
                      'use server';
                      await updateOrderStatus(order._id, 'approved');
                    }}
                    className="flex-1"
                  >
                    <button className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                      <FaCheck /> Accept
                    </button>
                  </form>
                  <form
                    action={async () => {
                      'use server';
                      await rejectOrderRequest(order._id);
                    }}
                    className="flex-1"
                  >
                    <button className="w-full border-2 border-gray-100 text-gray-400 py-3 rounded-xl font-black uppercase text-xs hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                      <FaTimes /> Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* SECTION 2: ACTIVE WORKFLOW */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
          Active Plates
        </h2>
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Pickup</th>
                <th className="px-6 py-4">Bill</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeOrders.map((order: any) => (
                <tr key={order._id} className="text-sm">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'paid' ?
                          'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {order.pickupTime}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black">{order.grandTotal}৳</span>
                      <span className="text-[9px] text-orange-500 font-bold uppercase">
                        Pre-pay: {order.totalPrePay}৳
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'approved' && (
                      <span className="text-[10px] italic text-gray-400">
                        Waiting for payment...
                      </span>
                    )}
                    {/* Next steps (Preparing, etc.) will be added here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeOrders.length === 0 && (
            <div className="p-10 text-center text-gray-300 italic text-sm">
              No active orders yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
