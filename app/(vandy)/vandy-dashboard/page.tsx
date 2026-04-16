import MyItems from '../../../components/MyItems';
import { auth } from '@clerk/nextjs/server';
import { getVandyDetails } from '@/lib/actions/store.actions';
import { getVandySalesStats } from '@/lib/actions/order.actions';
import LiveStatusToggle from '@/components/LiveStatusToggle';
import {
  FaWallet,
  FaChartLine,
  FaBox,
  FaArrowRight,
  FaHistory,
} from 'react-icons/fa';
import Link from 'next/link';

const VandyDashboard = async () => {
  const { userId } = await auth();
  const data = await getVandyDetails(userId as string);
  const stats = await getVandySalesStats();

  if (!data || !data.vandy) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-xl font-bold">Store not found.</h1>
      </section>
    );
  }

  const { vandy, items } = data;

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
            Manage Orders <FaArrowRight />
          </Link>
        </div>
      </header>

      {/* SALES ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        {/* Today's Sales */}
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

        {/* Total Sales */}
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

        {/* Total Orders */}
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

      {/* QUICK LINKS SECTION */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Link
          href="/vandy-dashboard/orders"
          className="flex items-center justify-between p-6 bg-orange-50 rounded-3xl border border-orange-100 group hover:bg-orange-600 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
              <FaHistory size={20} />
            </div>
            <div>
              <h3 className="font-black uppercase italic text-gray-900 group-hover:text-white transition-colors">
                Order History
              </h3>
              <p className="text-[10px] font-bold text-orange-400 group-hover:text-orange-100 uppercase tracking-widest">
                View past transactions
              </p>
            </div>
          </div>
          <FaChevronRight className="text-orange-200 group-hover:text-white" />
        </Link>

        <Link
          href="/vandy-dashboard/add-item"
          className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:bg-black transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-gray-900 group-hover:scale-110 transition-transform">
              <FaBox size={20} />
            </div>
            <div>
              <h3 className="font-black uppercase italic text-gray-900 group-hover:text-white transition-colors">
                Expand Menu
              </h3>
              <p className="text-[10px] font-bold text-gray-400 group-hover:text-gray-500 uppercase tracking-widest">
                Add new cravings
              </p>
            </div>
          </div>
          <FaChevronRight className="text-gray-200 group-hover:text-white" />
        </Link>
      </div>

      <div className="w-full border-t border-gray-100 pt-10">
        <MyItems items={items} />
      </div>
    </section>
  );
};

// Internal icon for the quick links
const FaChevronRight = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 320 512"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
  </svg>
);

export default VandyDashboard;
