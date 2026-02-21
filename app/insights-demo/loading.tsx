export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mx-auto mt-4 h-6 w-96 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="aspect-video w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
              <div className="p-6">
                <div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mb-3 h-8 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mb-4 h-20 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
