'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { WalletButton } from './WalletButton';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Market',
    links: [{ href: '/', label: 'Market' }],
  },
  {
    label: 'My NFTs',
    links: [
      { href: '/my-nfts', label: 'My NFTs' },
      { href: '/list-soroban', label: 'List NFT' },
    ],
  },
  {
    label: 'Mint',
    links: [{ href: '/mint-soroban', label: 'Mint' }],
  },
  {
    label: 'Manage',
    links: [
      { href: '/royalties', label: 'Royalties' },
      { href: '/analytics', label: 'Analytics' },
    ],
  },
];

function DropdownGroup({ group }: { group: typeof navGroups[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = group.links.some((link) => pathname === link.href);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          isActive
            ? 'bg-slate-800 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-900'
        )}
      >
        {group.label}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-4 py-2.5 text-sm font-medium transition-all',
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

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-white hidden sm:block">NFT MINTER</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) => (
            <DropdownGroup key={group.label} group={group} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
