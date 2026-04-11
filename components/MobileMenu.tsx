'use client';
import { IUser } from '@/lib/models/user.model';
import { ActiveLink } from './ActiveLink';
import { BiArrowFromBottom, BiArrowFromTop } from 'react-icons/bi';
import { useState } from 'react';

const MobileMenu = ({ dbUser }: { dbUser: IUser | null }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="relative md:hidden">
        {menuOpen ?
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col items-center justify-center"
          >
            <BiArrowFromBottom className="size-6" />
            <small className="font-bold text-xs">Hide Menu</small>
          </button>
        : <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col items-center justify-center"
          >
            <small className="font-bold text-xs">Show Menu</small>
            <BiArrowFromTop className="size-6" />
          </button>
        }
      </div>
      {dbUser?.role === 'foodie' ?
        <ul
          onClick={() => setMenuOpen(false)}
          className={`md:hidden ${menuOpen ? 'flex' : 'hidden'} flex-col items-center justify-center gap-y-4 absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-amber-200/30 backdrop-blur-3xl rounded-lg shadow-lg border border-amber-200 z-50`}
        >
          <li>
            <ActiveLink
              href="/"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Home
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/cart"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Cart
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/vandies"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              All Vandies
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/become-vandy"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Become Vandy
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/contact-us"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Contact Us
            </ActiveLink>
          </li>
        </ul>
      : dbUser?.role === 'vandy' ?
        <ul
          onClick={() => setMenuOpen(false)}
          className={`md:hidden ${menuOpen ? 'flex' : 'hidden'} flex-col items-center justify-center gap-y-4 absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-amber-200/30 backdrop-blur-3xl rounded-lg shadow-lg border border-amber-200 z-50`}
        >
          <li>
            <ActiveLink
              href="/vandy-dashboard"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Dashboard
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/vandy-dashboard/orders"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Orders
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/cart"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Cart
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/become-vandy"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Sponsor
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/contact-us"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Contact Vandie
            </ActiveLink>
          </li>
        </ul>
      : dbUser?.role === 'admin' ?
        <ul
          onClick={() => setMenuOpen(false)}
          className={`md:hidden ${menuOpen ? 'flex' : 'hidden'} flex-col items-center justify-center gap-y-4 absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-amber-200/30 backdrop-blur-3xl rounded-lg shadow-lg border border-amber-200 z-50`}
        >
          <li>
            <ActiveLink
              href="/admin-dashboard"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Dashboard
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/vandies"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              All Vandies
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/become-vandy"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Applications
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/contact-us"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Sponsorships
            </ActiveLink>
          </li>
        </ul>
      : <h1
          className={`md:hidden ${menuOpen ? 'block' : 'hidden'} absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-amber-200/30 backdrop-blur-3xl rounded-lg shadow-lg border border-amber-200 z-50`}
        >
          Please Sign In / Sign Up
        </h1>
      }
    </>
  );
};

export default MobileMenu;
