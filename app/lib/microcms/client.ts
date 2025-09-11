import { BookType } from '@/app/types/types';
import { createClient } from 'microcms-js-sdk';
// createClient は microCMS が提供する公式の関数 です。この関数に serviceDomain と apiKey を渡し、使用することで、microCMS の API に接続することができます。

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
  // !（non-null assertion operator） は、TypeScript に「絶対に null や undefined ではない」と伝えるものです。
  // 絶対に値が存在すると言う意味
});

// process.env は 環境変数 をまとめたオブジェクトで、process.env.変数名 でアクセスできます。
// ✅process.env内部構造
// process.env = {
//   PRISMA_DATABASE_URL: "prisma+postgres://...",
//   NEXTAUTH_SECRET: "WFFJ3DkhtW55e2urkOAFZhthTyeTTL74YSQJhi1E3zs=",
//   NEXT_PUBLIC_SERVICE_DOMAIN: "book-commerce-yukitaka",
//   NEXT_PUBLIC_API_KEY: "h9c4jwsrIme9vVsHqb5KJUsjwspiFHGk7Ivr",
//   // Node.js が自動で持っている環境変数も含まれる
// }

export const getAllBook = async () => {
  const allbooks = await client.getList<BookType>({
    // getListはmicrocms独自のcrud関数
    endpoint: 'bookcommerce',
    customRequestInit: {
      cache: "no-store",
      // SSRに
    },
  });
  return allbooks;
};

export const getDetailBooks = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    // client は MicroCMS が提供する独自オブジェクトで、getListDetail などのメソッドを使って API にアクセスします。
    // client がオブジェクトで、その中の getListDetail 関数に 
    // contentId を渡すことで、MicroCMS の特定のエンドポイントから個別データを取得できます。
    endpoint: 'bookcommerce',
    contentId,
    customRequestInit: {
      cache: "no-store",
      // SSRに
    },
  });
  return detailBook;
};

