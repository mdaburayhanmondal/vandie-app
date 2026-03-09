import { createStore } from '@/lib/actions/store.actions';
import { connectToDatabase } from '@/lib/db';
import Store from '@/lib/models/store.model';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const BecomeVandyPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect('/');

  await connectToDatabase();
  const store = await Store.findOne({ ownerId: userId }).lean();

  if (store?.applicationStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h1 className="text-2xl font-medium">
          Your request is currently pending review...
        </h1>
      </div>
    );
  }

  if (store?.applicationStatus === 'approved') {
    redirect('/vandy-dashboard');
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-y-8 max-w-xl mx-auto px-4 py-10">
      {/* Conditional Rejection Message */}
      {store?.applicationStatus === 'rejected' && (
        <div className="w-full bg-red-50 border border-red-200 text-red-800 p-4 rounded-md text-center">
          <p className="font-bold">Application Rejected</p>
          <p className="text-sm">
            Please update your information with correct details. Attempts left:
            2
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold">
        {store?.applicationStatus === 'rejected' ?
          'Re-apply to become Vandy'
        : 'Become a Vandy'}
      </h1>

      <form action={createStore} className="w-full flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-medium">Shop Name</label>
          <input
            type="text"
            placeholder="Enter shop name..."
            name="storeName"
            defaultValue={store?.storeName || ''}
            required
            className="outline focus:outline-2 px-3 py-2 rounded-md w-full border border-gray-200"
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-medium">Shop Bio</label>
          <textarea
            name="bio"
            placeholder="Tell us about your cart..."
            defaultValue={store?.bio || ''}
            className="outline focus:outline-2 px-3 py-2 rounded-md w-full h-32 resize-none border border-gray-200"
            maxLength={250}
            minLength={20}
            required
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Dhanmondi 27, Near KB Plaza"
            defaultValue={store?.location || ''}
            required
            className="outline focus:outline-2 px-3 py-2 rounded-md w-full border border-gray-200"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium text-gray-500">
            Shop Image (Coming Soon)
          </label>
          <input
            type="file"
            name="shopImage"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-900 cursor-not-allowed opacity-60"
            disabled
          />
        </div>

        <button
          type="submit"
          className="bg-green-400 font-bold py-3 rounded-md hover:bg-green-500 transition-colors cursor-pointer mt-2"
        >
          {store?.applicationStatus === 'rejected' ?
            'Update & Re-Apply'
          : 'Submit Application'}
        </button>
      </form>
    </section>
  );
};

export default BecomeVandyPage;
