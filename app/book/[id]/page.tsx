// urlがhttp://localhost:3000/book/oz6t9zj9e5fの場合
// この場合app/book/[id]/page.tsxの[id]の部分にoz6t9zj9e5fが自動的に入り、
// idごとに分けられたpage.tsxが生成される。
// 注意点としてpage.tsx内でidを扱う為にはparamsでidを受け取る必要がある

import { getDetailBooks } from "@/app/lib/microcms/client";
import CheckoutButton from "@/app/components/CheckoutButton"; // クライアントコンポーネント
import Image from "next/image";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";
import { Purchase } from "@/app/types/types";
import CommentCreate from "@/app/components/Comments";


const DetailBook = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(nextAuthOptions)
  // これは現在NextAuthでログインしている人のユーザー情報（セッション情報）を取得している
  const user = session?.user as User;
  const book = await getDetailBooks(params.id)


  let purchaseProductIds: string[] = [];
  let isPurchased: boolean = false;

  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`, {
      cache: 'no-store', // SSR
    });
    const purchasesData: Purchase[] = await response.json();
    purchaseProductIds = purchasesData.map(purchase => purchase.bookId);
    isPurchased = purchaseProductIds.includes(book.id);
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Image
          src={book.thumbnail.url}
          alt="book image"
          className="w-full h-80 object-cover object-center"
          width={700}
          height={700}
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <p>{isPurchased ? '購入済' : '未購入'}</p>
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />
          <CheckoutButton bookId={book.id} title={book.title} price={book.price} userId={user?.id} isPurchased={isPurchased} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">公開日:{new Date(book.publishedAt).toLocaleDateString()}</span>
            <span className="text-sm text-gray-500">最終更新:{new Date(book.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <CommentCreate params={params} />
    </div>
  );
};

export default DetailBook;