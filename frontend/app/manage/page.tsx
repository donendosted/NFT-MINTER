'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useClaimable } from '@/hooks/useRoyalties';
import { useVolumeAnalytics, useTopNfts, useMarketStats } from '@/hooks/useAnalytics';
import { WalletButton } from '@/components/layout/WalletButton';
import { formatLumens } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Tab = 'royalties' | 'analytics';

const creatorSplit = 50;

export default function ManagePage() {
  const { address, isConnected } = useWallet();
  const [tab, setTab] = useState<Tab>('royalties');

  const { data: claimable, isLoading: loadingClaimable } = useClaimable(address || '');

  const { data: volume, isLoading: loadingVolume } = useVolumeAnalytics();
  const { data: topNfts, isLoading: loadingTop } = useTopNfts(10);
  const { data: stats, isLoading: loadingStats } = useMarketStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Manage</h1>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-slate-900 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('royalties')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'royalties'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Royalties
        </button>
        <button
          onClick={() => setTab('analytics')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'analytics'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Royalties Tab */}
      {tab === 'royalties' && (
        <div>
          {!isConnected ? (
            <div className="card p-12 text-center">
              <h2 className="text-xl font-semibold text-white/60 mb-4">Connect Your Wallet</h2>
              <p className="text-white/40 mb-6 text-sm">Connect to view your royalty earnings</p>
              <WalletButton />
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="card p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/50 mb-1">Claimable Balance</p>
                    <div className="flex items-baseline gap-2">
                      {loadingClaimable ? (
                        <div className="h-10 w-40 bg-dark-200 rounded animate-pulse" />
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-accent-500">
                            {formatLumens(claimable?.claimableAmount || '0')}
                          </span>
                          <span className="text-white/40 text-sm">XLM</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-white/30 mt-1">
                      {claimable?.pendingCount || 0} pending earnings
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-white/40">Creator Split</p>
                    <p className="text-lg font-semibold text-white mt-1">
                      {creatorSplit}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Staker Split</p>
                    <p className="text-lg font-semibold text-white mt-1">30%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Treasury Split</p>
                    <p className="text-lg font-semibold text-white mt-1">20%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && (
        <div>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loadingStats ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5 h-28 animate-pulse" />
              ))
            ) : (
              <>
                <div className="card p-5">
                  <p className="text-xs text-white/40 mb-1">Total Volume</p>
                  <p className="text-xl font-bold text-white">
                    {formatLumens(volume?.allTime.volume || '0')}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">All time</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs text-white/40 mb-1">Total Sales</p>
                  <p className="text-xl font-bold text-white">
                    {stats?.totalSales || volume?.allTime.sales || 0}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">Transactions</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs text-white/40 mb-1">Total Royalties</p>
                  <p className="text-xl font-bold text-accent-500">
                    {formatLumens(volume?.allTime.totalRoyalty || '0')}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">Distributed</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs text-white/40 mb-1">Listed NFTs</p>
                  <p className="text-xl font-bold text-white">{stats?.totalListings || 0}</p>
                  <p className="text-xs text-white/30 mt-0.5">Active</p>
                </div>
              </>
            )}
          </div>

          {/* Volume Chart */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-white mb-4">Volume Over Time</h2>
            {loadingVolume ? (
              <div className="h-64 bg-dark-200 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={(volume?.daily as any) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickFormatter={(v) => formatLumens(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(v: number) => [formatLumens(String(v)), 'Volume']}
                  />
                  <Bar dataKey="volume" fill="#5c7cfa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top NFTs */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="font-semibold text-white">Top NFTs</h2>
            </div>
            {loadingTop ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-dark-200 rounded animate-pulse" />
                ))}
              </div>
            ) : topNfts?.data?.length === 0 ? (
              <EmptyState title="No sales yet" />
            ) : (
              <div className="divide-y divide-slate-800">
                {topNfts?.data?.slice(0, 10).map((nft: any, i: number) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-white/40 font-medium">#{i + 1}</span>
                      <div>
                        <p className="text-white font-medium">{nft.name}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {nft.sales} sales
                        </p>
                      </div>
                    </div>
                    <p className="text-accent-500 font-medium">
                      {formatLumens(nft.volume)} XLM
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}