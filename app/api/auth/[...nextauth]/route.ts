import { nextAuthOptions } from "@/app/lib/next-auth/options";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
// この route.ts は Next.js App Router の API Route です。
// GET や POST でこのエンドポイントにアクセスが来ると
// const handler = NextAuth(nextAuthOptions); が動作する



