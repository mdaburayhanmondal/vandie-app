import { getVandies } from '@/lib/actions/store.actions';
import { IStore } from '@/lib/models/store.model';

const VandiesPage = async () => {
  const vandies = await getVandies();
  return (
    <>
      <h1 className="text-center text-2xl font-semibold italic tracking-widest">
        All Vandies
      </h1>
      {vandies.length > 0 ?
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vandies.map((vandie: IStore) => {
            return (
              <li
                key={vandie._id}
                className="border p-2 flex flex-col gap-y-2 items-start justify-center rounded-2xl"
              >
                <h2 className="text-3xl">{vandie.storeName}</h2>
                <p className="text-sm text-pink-800">{vandie.bio}</p>
                <p>{vandie.location}</p>
              </li>
            );
          })}
        </ul>
      : <div className=""></div>}
    </>
  );
};

export default VandiesPage;
