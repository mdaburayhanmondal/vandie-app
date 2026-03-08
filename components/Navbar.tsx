'use server';
import { syncUser } from '@/lib/actions/user.actions';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

const Navbar = async () => {
  const dbUser = await syncUser();

  return (
    <nav className="w-full mx-auto flex items-center justify-between p-4">
      <Link href={'/'} className="text-2xl font-semibold italic">
        Vandie
      </Link>

      {/* desktop menus */}
      <DesktopMenu dbUser={dbUser} />

      {/* mobile menus */}
      <MobileMenu dbUser={dbUser} />

      <div className="flex gap-x-2">
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#5732eb] hover:bg-[#2f09c6] text-white rounded-md font-medium text-sm sm:text-base px-3 py-1 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
