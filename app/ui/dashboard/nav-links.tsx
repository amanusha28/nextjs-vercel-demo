'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentCurrencyDollarIcon,
  CreditCardIcon,
  KeyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Main navigation links
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'User', href: '/dashboard/user', icon: UserIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Customer Status', href: '/dashboard/customer-status', icon: UserGroupIcon },
  { name: 'Loan', href: '/dashboard/loan', icon: DocumentCurrencyDollarIcon },
  { name: 'Payment', href: '/dashboard/payment', icon: CreditCardIcon },
];

// Separate Change Password link
const changePasswordLink = { name: 'Change Password', href: '/dashboard/change-password', icon: KeyIcon };

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto">
        <Link
          href={changePasswordLink.href}
          className={clsx(
            'flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-sky-100 text-blue-600': pathname === changePasswordLink.href,
            },
          )}
        >
          <changePasswordLink.icon className="w-6" />
          <p className="hidden md:block">{changePasswordLink.name}</p>
        </Link>
      </div>
    </div>
  );
}
