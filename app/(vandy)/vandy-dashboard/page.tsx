import MyItems from '../../../components/MyItems';
import { auth } from '@clerk/nextjs/server';
import { getVandyDetails } from '@/lib/actions/store.actions';
import {
  getVandySalesStats,
  getVandyOrders,
} from '@/lib/actions/order.actions';
import LiveStatusToggle from '@/components/LiveStatusToggle';
import {
  FaWallet,
  FaChartLine,
  FaBox,
  FaArrowRight,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaCog,
  FaChevronRight,
} from 'react-icons/fa';
import Link from 'next/link';

const VandyDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) => {
  const { userId } = await auth();

  // search parameters
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || '';

  const data = await getVandyDetails(userId as string);
  const stats = await getVandySalesStats();
  const allOrders = await getVandyOrders();

  if (!data || !data.vandy) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-xl font-bold">Store not found.</h1>
      </section>
    );
  }

  const { vandy, items } = data;

  // history (Completed and Rejected orders) + Search Logic
  const historyOrders = allOrders.filter((o: any) => {
    const isHistory = ['completed', 'rejected'].includes(o.status);
    const matchesSearch =
      searchQuery === '' ||
      o._id.toLowerCase().includes(searchQuery.toLowerCase());

    return isHistory && matchesSearch;
  });

  return (
    <section className="py-10 flex flex-col items-center max-w-6xl mx-auto px-6">
      <header className="w-full mb-10 text-center flex flex-col items-center">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
          {vandy.storeName}'s Command Center
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <LiveStatusToggle
            status={data.vandy.isLive}
            storeId={data.vandy._id.toString()}
          />
          <Link
            href="/vandy-dashboard/orders"
            className="flex items-center gap-2 bg-white border-2 border-gray-100 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
          >
            Manage Live Orders <FaArrowRight />
          </Link>
          <Link
            href="/vandy-dashboard/settings"
            className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:bg-black transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl text-gray-900 group-hover:scale-110 transition-transform">
                <FaCog size={20} />
              </div>
              <div>
                <h3 className="font-black uppercase italic text-gray-900 group-hover:text-white transition-colors">
                  Branding
                </h3>
                <p className="text-[10px] font-bold text-gray-400 group-hover:text-gray-500 uppercase tracking-widest">
                  Customize profile
                </p>
              </div>
            </div>
            <FaChevronRight className="text-gray-200 group-hover:text-white" />
          </Link>
        </div>
      </header>

      {/* SALES ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <FaChartLine size={80} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">
            Today's Revenue
          </p>
          <h2 className="text-4xl font-black italic">{stats.todayRevenue}৳</h2>
          <p className="text-xs text-gray-400 mt-2 font-bold">
            {stats.todayOrdersCount} Orders Today
          </p>
        </div>

        <div className="bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-gray-50 group-hover:scale-110 transition-transform">
            <FaWallet size={80} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
            Total Earnings
          </p>
          <h2 className="text-4xl font-black italic text-gray-900">
            {stats.totalRevenue}৳
          </h2>
          <p className="text-xs text-orange-600 mt-2 font-black uppercase italic">
            All-time Performance
          </p>
        </div>

        <div className="bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-gray-50 group-hover:scale-110 transition-transform">
            <FaBox size={80} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
            Items Served
          </p>
          <h2 className="text-4xl font-black italic text-gray-900">
            {stats.totalOrders}
          </h2>
          <p className="text-xs text-blue-600 mt-2 font-black uppercase italic">
            Completed Plates
          </p>
        </div>
      </div>

      {/* full history */}
      <div className="w-full mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <FaHistory size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                Order History
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Full audit trail of your transactions
              </p>
            </div>
          </div>

          {/* order id search filter */}
          <form
            method="GET"
            className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-orange-200 transition-all"
          >
            <FaSearch className="text-gray-300" size={14} />
            <input
              type="text"
              name="search"
              placeholder="Filter by Order ID..."
              defaultValue={searchQuery}
              className="bg-transparent text-xs font-bold outline-none placeholder:text-gray-300 w-48 md:w-64"
            />
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Date & Time</th>
                  <th className="px-8 py-5">Items Summary</th>
                  <th className="px-8 py-5 text-right">Revenue</th>
                  <th className="px-8 py-5 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historyOrders.length > 0 ?
                  historyOrders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 text-sm">
                            {order.pickupDate}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {order.pickupTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col max-w-xs">
                          <span className="text-xs font-bold text-gray-700 truncate">
                            {order.items.map((i: any) => i.name).join(', ')}
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">
                            {order.items.reduce(
                              (acc: number, i: any) => acc + i.quantity,
                              0,
                            )}{' '}
                            Items Total
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">
                            {order.grandTotal}৳
                          </span>
                          <span className="text-[9px] text-green-600 font-black uppercase tracking-tighter">
                            Trx: {order.paymentDetails?.trxId || 'CASH'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {order.status === 'completed' ?
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                              <FaCheckCircle size={10} /> Fulfilled
                            </div>
                          : <div className="flex items-center gap-1.5 bg-red-50 text-red-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">
                              <FaTimesCircle size={10} /> Rejected
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  ))
                : <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <FaHistory size={40} className="mb-4" />
                        <p className="font-black italic uppercase tracking-tighter text-xl">
                          {searchQuery ?
                            'No matching orders'
                          : 'No finished plates found'}
                        </p>
                        <p className="text-xs font-bold mt-2">
                          {searchQuery ?
                            `We couldn't find any orders matching "${searchQuery}"`
                          : 'Completed orders will appear here automatically.'}
                        </p>
                        {searchQuery && (
                          <Link
                            href="/vandy-dashboard"
                            className="text-orange-600 text-[10px] font-black uppercase mt-4 hover:underline tracking-widest"
                          >
                            Clear Filter
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-100 pt-10">
        <MyItems items={items} />
      </div>
    </section>
  );
};

export default VandyDashboard;
