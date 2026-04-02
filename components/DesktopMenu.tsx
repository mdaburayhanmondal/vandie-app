import React from 'react';
import { ActiveLink } from './ActiveLink';
import { IUser } from '@/lib/models/user.model';

const DesktopMenu = ({ dbUser }: { dbUser: IUser | null }) => {
  return (
    <>
      {dbUser?.role === 'foodie' ?
        <ul className="md:flex items-center justify-center md:gap-x-4 lg:gap-x-8 hidden">
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
              href="/vandies"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Cravings
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
        <ul className="md:flex items-center justify-center md:gap-x-4 lg:gap-x-8 hidden">
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
              href="/orders"
              className="p-2"
              activeClassName="text-blue-600 font-semibold"
            >
              Orders
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
        <ul className="md:flex items-center justify-center md:gap-x-4 lg:gap-x-8 hidden">
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
      : <h1 className="mx-auto hidden md:block text-xl text-red-700 italic font-extralight text-center">
          Please Sign In / Sign Up
        </h1>
      }
    </>
  );
};

export default DesktopMenu;
