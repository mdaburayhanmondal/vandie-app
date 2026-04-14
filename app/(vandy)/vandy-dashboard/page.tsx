import MyItems from '../../../components/MyItems';
import { auth } from '@clerk/nextjs/server';
import { getVandyDetails } from '@/lib/actions/store.actions';
import { getVandySalesStats } from '@/lib/actions/order.actions';
import LiveStatusToggle from '@/components/LiveStatusToggle';
import { FaWallet, FaChartLine, FaBox } from 'react-icons/fa';

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

        <LiveStatusToggle
          status={data.vandy.isLive}
          storeId={data.vandy._id.toString()}
        />
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

      <div className="w-full border-t border-gray-100 pt-10">
        <MyItems items={items} />
      </div>
    </section>
  );
};

export default VandyDashboard;
