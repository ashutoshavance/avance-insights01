import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Insight } from '@/types/insight';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={insight.imageUrl}
          alt={insight.imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-full bg-blue-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {insight.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          {new Date(insight.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        
        <h3 className="mb-3 text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          <Link href={`/insights/${insight.slug}`}>
            {insight.title}
          </Link>
        </h3>
        
        <p className="mb-4 line-clamp-3 flex-1 text-slate-600 dark:text-slate-300">
          {insight.excerpt}
        </p>
        
        <div className="mt-auto">
          <Link
            href={`/insights/${insight.slug}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read Article
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};
