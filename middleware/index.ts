import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/better-auth/auth";

export async function middleware(request: NextRequest) {
	const auth = await getAuth();
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
	],
};