import Navbar from '@/components/Navbar';
import {
  approveApplication,
  fetchVandyApplications,
  rejectApplication,
} from '@/lib/actions/store.actions';
import { syncUser } from '@/lib/actions/user.actions';
import { IStore } from '@/lib/models/store.model';
import { redirect } from 'next/navigation';

const AdminDashboardPage = async () => {
  const vandyApplications = await fetchVandyApplications();
  const dbUser = await syncUser();

  if (dbUser.role !== 'admin') {
    redirect('/');
  }
  return (
    <>
      <main className="min-h-screen max-w-7xl mx-auto">
        <section className="flex flex-col gap-y-6 py-8">
          <h1 className="text-2xl text-center font-semibold">Vandy Requests</h1>
          {vandyApplications.length > 0 ?
            /* applications container */
            <ul className="px-4">
              {vandyApplications?.map((application: IStore) => {
                const approveWithId = approveApplication.bind(
                  null,
                  application._id as string,
                );
                const rejectWithId = rejectApplication.bind(
                  null,
                  application._id as string,
                );
                return (
                  <li
                    key={application._id}
                    className="flex flex-col gap-y-2 items-start border p-2 rounded-md"
                  >
                    <small className="underline underline-offset-4 decoration-gray-400">
                      Store id: {application._id}
                    </small>
                    <h1 className="text-xl">
                      Store name:{' '}
                      <span className="text-green-600 font-bold tracking-wider italic">
                        {application.storeName}
                      </span>
                    </h1>
                    <p className="text-xl">
                      Location:{' '}
                      <span className="font-semibold">
                        {application.location}
                      </span>
                    </p>
                    <div className="">
                      <p className="text-xl">Bio:</p>
                      <p className="text-md">{application.bio}</p>
                    </div>
                    <div className="pt-4 flex justify-between w-full [&>form>button]:border [&>form>button]:px-3 [&>form>button]:py-1 [&>form>button]:rounded-md [&>form>button]:cursor-pointer">
                      <form action={approveWithId}>
                        <button className="bg-green-400 border-green-300 hover:bg-green-600 hover:text-white hover:border-green-500 duration-200 ease-in">
                          Approve
                        </button>
                      </form>
                      <form action={rejectWithId}>
                        <button className="bg-red-400 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-500 duration-200 ease-in">
                          Reject
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          : <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl">No applications</h1>
            </div>
          }
        </section>
      </main>
    </>
  );
};

export default AdminDashboardPage;
