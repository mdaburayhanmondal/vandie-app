import MyItems from '../../../components/MyItems';
import { auth } from '@clerk/nextjs/server';
import { getVandyDetails } from '@/lib/actions/store.actions';
import LiveStatusToggle from '@/components/LiveStatusToggle';

const VandyDashboard = async () => {
  const { userId } = await auth();
  const data = await getVandyDetails(userId as string);

  if (!data || !data.vandy) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-xl font-bold">Store not found.</h1>
      </section>
    );
  }

  const { vandy, items } = data;

  return (
    <section className="py-10 text-center flex flex-col items-center">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
        {vandy.storeName}'s Dashboard
      </h1>
      <LiveStatusToggle
        status={data.vandy.isLive}
        storeId={data.vandy._id.toString()}
      />
      <MyItems items={items} />
    </section>
  );
};

export default VandyDashboard;
