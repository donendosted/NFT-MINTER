'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    href: '/',
    label: 'Market',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    group: [
      { href: '/my-nfts', label: 'My NFTs' },
      { href: '/list-soroban', label: 'List' },
    ],
    label: 'My NFTs',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: '/mint-soroban',
    label: 'Mint',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    accent: true,
  },
  {
    group: [
      { href: '/royalties', label: 'Royalties' },
      { href: '/analytics', label: 'Analytics' },
    ],
    label: 'Manage',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function MobileTab({ item }: { item: typeof navGroups[0] }) {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = item.href
    ? pathname === item.href
    : item.group?.some((l) => pathname === l.href);

  const hasDropdown = !!item.group;

  return (
    <div className="relative">
      <button
        onClick={() => hasDropdown && setShowDropdown((v) => !v)}
        className={cn(
          'relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
          item.accent
            ? isActive
              ? 'text-white'
              : 'text-accent-500/70'
            : isActive
            ? 'text-slate-400'
            : 'text-silver-50/40'
        )}
      >
        {item.accent ? (
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            isActive ? 'bg-slate-700' : 'bg-slate-800'
          )}>
            {item.icon}
          </div>
        ) : (
          item.icon
        )}
        <span className="text-[10px] font-medium">{item.label}</span>
        {isActive && !item.accent && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-slate-700 rounded-full" />
        )}
      </button>

      {hasDropdown && showDropdown && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {item.group?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setShowDropdown(false)}
              className={cn(
                'block px-4 py-2.5 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-silver-900/95 backdrop-blur-xl border-t border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16">
        {navGroups.map((item, i) => (
          <MobileTab key={i} item={item} />
        ))}
      </div>
    </nav>
  );
}