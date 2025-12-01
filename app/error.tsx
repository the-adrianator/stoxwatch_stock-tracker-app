"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-200 p-6">
      <div className="max-w-lg w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-100">
          Something went wrong
        </h1>
        {error?.digest ? (
          <p className="text-sm text-gray-500">Error digest: {error.digest}</p>
        ) : null}
        <p className="text-gray-400">
          An error occurred while loading this page. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-md bg-yellow-500 text-yellow-900 font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-900 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
