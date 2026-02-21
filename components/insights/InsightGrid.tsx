import React from 'react';
import { Insight } from '@/types/insight';
import { InsightCard } from './InsightCard';

interface InsightGridProps {
  insights: Insight[];
}

export const InsightGrid: React.FC<InsightGridProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No insights found</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Check back later for new market research and industry trends.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};
