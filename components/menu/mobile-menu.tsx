'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Plus, User } from 'lucide-react';

export default function MobileMenu() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/my-lists', icon: List, label: 'Lists' },
    { href: '/test', icon: Plus, label: 'test' },
    { href: '/my-account', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-[9999] w-full border-t border-border bg-background shadow-lg">
      <div className="flex justify-around py-3">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              pathname === href
                ? 'text-primary'
                : 'text-muted hover:text-primary'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
