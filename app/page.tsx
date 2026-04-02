import { redirect } from 'next/navigation';
import { syncUser } from '@/lib/actions/user.actions';

export default async function Home() {
  await syncUser();
  redirect('/cravings');
}
