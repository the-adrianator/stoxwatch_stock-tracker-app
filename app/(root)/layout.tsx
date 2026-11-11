import React from "react";
import Header from "@/components/Header";
import { getAuth } from "@/lib/better-auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Reads the session on every request, so it must never be prerendered at build time.
export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const user: User = {
    id: session?.user?.id,
    name: session?.user?.name,
    email: session?.user?.email,
    image: session?.user?.image ?? undefined,
  };
  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
