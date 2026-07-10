import React from 'react';
import { useRecords } from 'twenty-sdk/ui';

export const LmeDashboardWidget = () => {
  const { records: lmeTrackers, loading } = useRecords({
    objectName: 'lmeTrackers',
    orderBy: { rateDate: 'Desc' },
    limit: 5
  });

  if (loading) return <div className="p-4 text-gray-500">Loading LME Rates...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 m-4 w-full max-w-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Today's LME Rates</h2>
      <div className="space-y-3">
        {lmeTrackers?.map((rate) => (
          <div key={rate.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                {rate.metalType}
              </span>
              <span className="font-medium text-gray-700">{new Date(rate.rateDate).toLocaleDateString()}</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${rate.rateUSD.toLocaleString()} / MT
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">Data provided by internal integrations</span>
      </div>
    </div>
  );
};
