import React, { useState, useEffect } from 'react';
import { useRecords } from 'twenty-sdk/react';
import { VERIFIED_PRICE_OBJECT_IDENTIFIER } from '../constants/universal-identifiers';
import { IconCheckCircle, IconEdit, IconLock, IconPlus } from '@tabler/icons-react';

export default function VerifiedPriceDashboard() {
  const { records: prices, loading } = useRecords({
    objectName: 'verifiedPrice',
    orderBy: [{ field: 'material', direction: 'asc' }],
  });

  if (loading) {
    return <div className="p-8 text-slate-500 font-sans animate-pulse">Loading verified prices...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <IconCheckCircle className="text-emerald-600" size={28} />
              Master Price Ledger
            </h1>
            <p className="text-sm text-slate-500 mt-1">Official verified pricing for quotations and contracts.</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <IconPlus size={18} />
            Draft New Price
          </button>
        </div>

        {/* Ledger Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Material / Item</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prices?.map((price) => (
                <tr key={price.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{price.material}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{price.notes}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">
                    {price.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{price.currency}</td>
                  <td className="px-6 py-4">
                    {price.status === 'VERIFIED' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Verified
                      </span>
                    )}
                    {price.status === 'DRAFT' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        Draft
                      </span>
                    )}
                    {price.status === 'REJECTED' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="Edit">
                      <IconEdit size={18} />
                    </button>
                    {price.status === 'VERIFIED' && (
                      <button className="text-emerald-500 ml-2 p-1" title="Locked by HOD">
                        <IconLock size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {(!prices || prices.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No prices listed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
