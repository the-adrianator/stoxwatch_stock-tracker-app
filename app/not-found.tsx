import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-200 p-6">
      <div className="max-w-lg w-full text-center space-y-4">
        <h1 className="text-6xl font-bold text-yellow-500">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-md bg-yellow-500 text-yellow-900 font-medium hover:opacity-90 transition-opacity"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
