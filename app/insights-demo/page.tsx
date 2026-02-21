import React from 'react';
import { insightService } from '@/services/insight.service';
import { InsightGrid } from '@/components/insights/InsightGrid';

export const metadata = {
  title: 'Market Insights | Avance Insights',
  description: 'Latest market research and industry trends.',
};

export default async function InsightsDemoPage() {
  try {
    const { data: insights } = await insightService.getAll(1, 6);

    return (
      <main className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Market <span className="text-blue-600">Insights</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Stay ahead of the curve with our latest market research, industry analysis, and strategic perspectives.
            </p>
          </div>

          <InsightGrid insights={insights} />
        </div>
      </main>
    );
  } catch (error) {
    // In a real app, this would be caught by error.tsx, 
    // but we can also handle it locally for specific UI.
    throw error; 
  }
}
