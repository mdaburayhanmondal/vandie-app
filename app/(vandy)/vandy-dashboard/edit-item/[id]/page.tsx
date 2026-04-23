import { getItemById } from '@/lib/actions/item.actions';
import { redirect } from 'next/navigation';
import EditItemForm from '@/components/EditItemForm';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const EditItemPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // 1. Fetch item data on the server
  const item = await getItemById(id);

  // 2. Redirect if item is not found
  if (!item) {
    redirect('/vandy-dashboard');
  }

  return (
    <section className="max-w-4xl mx-auto p-6 pb-20">
      <header className="mb-10">
        <Link
          href="/vandy-dashboard"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors mb-6"
        >
          <FaArrowLeft /> Command Center
        </Link>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
          Edit Plate
        </h1>
        <p className="text-gray-500 font-medium italic">
          Fine-tune your offering for the neighborhood.
        </p>
      </header>

      {/* 3. Pass data to the Client Component */}
      <EditItemForm item={item} />
    </section>
  );
};

export default EditItemPage;
