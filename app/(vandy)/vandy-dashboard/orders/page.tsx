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
  FaUtensils,
  FaCheckDouble,
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">
            Order Management
          </h1>
          <p className="text-gray-500 text-sm italic">
            Review incoming requests and track active plates.
          </p>
        </div>
        <div className="bg-orange-100 px-6 py-2 rounded-2xl flex items-center gap-3 w-fit">
          <span className="text-orange-600 font-black text-2xl">
            {requests.length}
          </span>
          <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest leading-tight">
            New
            <br />
            Requests
          </span>
        </div>
      </header>

      {/* SECTION 1: INCOMING REQUESTS - These need manual Accept/Reject */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
          <FaReceipt /> Incoming Requests
        </h2>

        {requests.length === 0 ?
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center">
            <p className="text-gray-300 font-bold italic">
              No new requests at the moment.
            </p>
          </div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((order: any) => (
              <div
                key={order._id}
                className="bg-white border-2 border-orange-100 rounded-[2.5rem] p-6 shadow-xl shadow-orange-50/50 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                    <FaClock className="text-orange-600" size={12} />
                    <span className="text-xs font-black text-orange-600 lowercase">
                      {order.pickupDate} @ {order.pickupTime}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    #{order._id.slice(-6)}
                  </span>
                </div>

                <div className="space-y-2 mb-6 flex-1">
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
                  <div className="pt-3 mt-2 border-t border-dashed flex justify-between font-black text-gray-900">
                    <span className="uppercase text-xs tracking-tighter">
                      Total Bill:
                    </span>
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
                    <button className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2">
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
                    <button className="w-full border-2 border-gray-100 text-gray-400 py-3 rounded-xl font-black uppercase text-xs hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                      <FaTimes /> Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* SECTION 2: ACTIVE WORKFLOW - From Payment to Fulfillment */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <FaUtensils /> Active Workflow
        </h2>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Pickup</th>
                  <th className="px-8 py-4">Financials</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeOrders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="text-sm group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit shadow-sm ${
                            order.status === 'paid' ?
                              'bg-blue-100 text-blue-700'
                            : order.status === 'preparing' ?
                              'bg-orange-100 text-orange-700'
                            : order.status === 'ready' ?
                              'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.status === 'paid' && (
                          <span className="text-[10px] font-black text-orange-600 ml-1">
                            Trx: {order.paymentDetails?.trxId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900">
                          {order.pickupTime}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {order.pickupDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900">
                          {order.grandTotal}৳
                        </span>
                        <span className="text-[9px] text-orange-500 font-bold uppercase tracking-tighter">
                          Pre-pay: {order.totalPrePay}৳
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {order.status === 'approved' && (
                          <span className="text-[10px] italic text-gray-400 font-medium">
                            Waiting for Foodie to pay...
                          </span>
                        )}

                        {order.status === 'paid' && (
                          <div className="flex gap-2">
                            <form
                              action={async () => {
                                'use server';
                                await updateOrderStatus(order._id, 'preparing');
                              }}
                            >
                              <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition-all shadow-md shadow-green-100">
                                Verify & Start
                              </button>
                            </form>
                            <form
                              action={async () => {
                                'use server';
                                await updateOrderStatus(order._id, 'approved');
                              }}
                            >
                              <button className="border border-red-100 text-red-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all">
                                Invalid TRX
                              </button>
                            </form>
                          </div>
                        )}

                        {order.status === 'preparing' && (
                          <form
                            action={async () => {
                              'use server';
                              await updateOrderStatus(order._id, 'ready');
                            }}
                          >
                            <button className="bg-orange-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-orange-700 transition-all shadow-md shadow-orange-100 flex items-center gap-2">
                              <FaCheck /> Mark Ready
                            </button>
                          </form>
                        )}

                        {order.status === 'ready' && (
                          <form
                            action={async () => {
                              'use server';
                              await updateOrderStatus(order._id, 'completed');
                            }}
                          >
                            <button className="bg-black text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-gray-800 transition-all shadow-md flex items-center gap-2">
                              <FaCheckDouble /> Handed Over
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeOrders.length === 0 && (
            <div className="p-16 text-center text-gray-300 italic font-bold">
              No active plates in the workflow yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
