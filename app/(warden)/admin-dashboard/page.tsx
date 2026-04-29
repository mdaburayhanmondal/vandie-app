import {
  approveApplication,
  fetchVandyApplications,
  rejectApplication,
} from '@/lib/actions/store.actions';
import { syncUser } from '@/lib/actions/user.actions';
import { IStore } from '@/lib/models/store.model';
import { redirect } from 'next/navigation';
import VandyApplicationCard from '@/components/VandyApplicationCard';
import { FaUserShield, FaClipboardList, FaCheckCircle } from 'react-icons/fa';

const AdminDashboardPage = async () => {
  const dbUser = await syncUser();

  // 1. Security Guard
  if (!dbUser || dbUser.role !== 'admin') {
    redirect('/');
  }

  // 2. Data Fetching
  const vandyApplications = await fetchVandyApplications();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <header className="bg-black text-white py-12 px-6 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FaUserShield size={120} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
              The Warden
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            Vandy Verification
          </h1>
          <p className="text-gray-400 font-medium italic mt-2">
            Reviewing {vandyApplications.length} pending applications for the
            movement.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-900 border border-gray-100">
            <FaClipboardList size={18} />
          </div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-gray-900">
            Pending Requests
          </h2>
        </div>

        {vandyApplications.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vandyApplications.map((application: IStore) => (
              <VandyApplicationCard
                key={application._id?.toString()}
                application={application}
                approveAction={approveApplication}
                rejectAction={rejectApplication}
              />
            ))}
          </div>
        : <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
              <FaCheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-300">
              Clear Skies
            </h3>
            <p className="text-gray-400 font-medium italic mt-1">
              All applications have been processed. No pending requests.
            </p>
          </div>
        }
      </section>
    </main>
  );
};

export default AdminDashboardPage;
