import { createStore } from '@/lib/actions/store.action';

const BecomeVandyPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-y-10 max-w-xl mx-auto px-4">
      <h1 className="text-3xl">Become Vandy</h1>
      <form
        action={createStore}
        className="w-full mx-auto flex flex-col items-center gap-y-4"
      >
        <input
          type="text"
          placeholder="Enter shop name..."
          name="storeName"
          required
          className="outline px-2 py-1 rounded-md w-full"
        />
        <textarea
          name="bio"
          placeholder="Enter shop bio..."
          className="outline px-2 py-1 rounded-md w-full h-30 resize-none"
          maxLength={250}
          minLength={20}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Enter shop location..."
          className="outline px-2 py-1 rounded-md w-full"
          required
        />
        <input
          type="file"
          name="shopImage"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-200 file:text-amber-900 hover:file:bg-amber-300 cursor-not-allowed"
          disabled
        />
        <button
          type="submit"
          className="bg-green-300 px-3 py-1 rounded-md hover:bg-green-500 cursor-pointer"
        >
          Apply
        </button>
      </form>
    </section>
  );
};

export default BecomeVandyPage;
