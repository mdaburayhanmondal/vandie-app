'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

interface ActiveLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

export const ActiveLink = ({
  children,
  className,
  activeClassName = 'bg-blue-500 text-white',
  ...props
}: ActiveLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <Link
      {...props}
      className={`${className} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </Link>
  );
};
