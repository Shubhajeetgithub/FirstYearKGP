'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm">
      <div role="status" className="flex flex-col items-center">
        <span className="sr-only">Loading...</span>

        <div
          className="relative h-20 w-20 animate-spin rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-1"
        >
          <div className="h-full w-full rounded-full bg-slate-900"></div>
        </div>

        <p className="mt-4 text-lg font-medium tracking-wider text-white animate-pulse">
          LOADING
        </p>
      </div>
    </div>
  );
}