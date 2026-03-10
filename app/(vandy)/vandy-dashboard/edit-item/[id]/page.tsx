import { getItemById } from '@/lib/actions/item.actions';
import { redirect } from 'next/navigation';
import EditItemForm from '@/components/EditItemForm';

const EditItemPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const item = await getItemById(id);

  if (!item) {
    redirect('/vandy-dashboard');
  }

  return (
    <section className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold italic mb-8 text-blue-700">
        Edit Menu Item
      </h1>
      <EditItemForm item={item} />
    </section>
  );
};

export default EditItemPage;
