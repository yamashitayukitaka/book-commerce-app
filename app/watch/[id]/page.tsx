import { getDetailBooks } from "@/app/lib/microcms/client";
import CheckoutButton from "@/app/components/CheckoutButton";
import Image from "next/image";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";
import { Purchase } from "@/app/types/types";
import CommentCreate from "@/app/components/Comments";


const DetailBook = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(nextAuthOptions)
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
    <div>
      <div className="flex w-full max-[768px]:flex-col">
        <Image
          src={book.thumbnail.url}
          alt="book image"
          width={700}
          height={700}
          className="object-cover w-1/2 max-[768px]:w-full"
        />
        <div className="p-[100px] bg-[rgba(0,_0,_0,_0.7)] w-1/2 max-[768px]:p-[20px] max-[768px]:w-full">
          <h2 className="text-2xl font-bold text-[rgba(255,_255,_255,_0.7)] text-[40px] mb-[50px] leading-[1.3] max-[768px]:text-[24px]">{book.title}</h2>
          {/* <p>{isPurchased ? '購入済' : '未購入'}</p> */}
          <div className="mb-[50px]">
            <div
              className="text-[rgba(255,_255,_255)] text-[16px] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: book.content }}
            />
          </div>
          <CheckoutButton bookId={book.id} title={book.title} price={book.price} userId={user?.id} isPurchased={isPurchased} />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-[rgba(255,_255,_255,_0.7)]">公開日:{new Date(book.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="bg-[rgb(11,_23,_39,_0.9)] px-[100px] py-[50px] max-[1400px]:px-[20px]">
        <CommentCreate params={params} user={user} />
      </div>
    </div>
  );
};

export default DetailBook;