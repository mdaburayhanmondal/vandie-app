import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/user.model';
import Store from '@/lib/models/store.model';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default async function VandyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Authenticate with Clerk
  const { userId } = await auth();
  if (!userId) redirect('/');

  // 2. Connect and verify the User Role in MongoDB
  await connectToDatabase();
  const dbUser = await User.findOne({ clerkId: userId });

  // If the user isn't a Vandy or Admin, kick them to the discovery page
  if (!dbUser || (dbUser.role !== 'vandy' && dbUser.role !== 'admin')) {
    redirect('/cravings');
  }

  // 3. Verify the Store Application Status
  const store = await Store.findOne({ ownerId: userId });

  // If they are a 'vandy' but haven't applied or are still pending/rejected,
  // they shouldn't be in the command center yet.
  if (!store || store.applicationStatus !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl text-center">
          <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-4xl flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle size={30} />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-500 text-sm italic font-medium mb-8">
            Your Vandy application is either missing or still awaiting approval
            from the Warden.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/become-vandy"
              className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-orange-600 transition-all"
            >
              Check Application Status
            </Link>
            <Link
              href="/cravings"
              className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              <FaArrowLeft /> Back to Cravings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. If they are an approved Vandy, allow access to the dashboard
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
