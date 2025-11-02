"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-black text-gray-200 p-6">
        <div className="max-w-lg w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          {error?.digest ? (
            <p className="text-sm text-gray-500">
              Error digest: {error.digest}
            </p>
          ) : null}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-md bg-yellow-500 text-yellow-900 font-medium hover:opacity-90"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-900"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
