import { getMyItems } from '@/lib/actions/item.actions';
import { IItem } from '@/lib/models/item.model';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

const VandyDashboard = async () => {
  const items = await getMyItems();
  if (items.length <= 0) {
    return (
      <div>
        <h1>No Items!</h1>
      </div>
    );
  }
  return (
    <section className="mx-auto p-4 max-w-7xl flex flex-col justify-center items-center gap-y-8">
      <h1 className="text-3xl">My Items</h1>

      <ul className="w-full mx-auto max-w-3xl flex flex-col gap-y-4">
        {items.map((item: IItem, index: number) => {
          return (
            <li
              key={item._id}
              className="w-full grid grid-cols-[3fr_1fr_1fr_2fr_1fr] justify-items-center cursor-pointer"
            >
              <div className="flex gap-x-4 w-full items-center">
                <small className="border p-1 size-6 rounded text-center">
                  {index + 1}
                </small>
                <h1 className="text-xl italic font-semibold">{item.name}</h1>
              </div>
              <p className="line-clamp-1">{item.category}</p>
              <p className="">{item.price}</p>
              <p>Available: {item.isAvailable === true ? 'Yes' : 'No'}</p>
              <Link href={`/edit-item/${item._id}`}>
                <FaEdit />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default VandyDashboard;
