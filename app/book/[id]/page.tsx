// urlがhttp://localhost:3000/book/oz6t9zj9e5fの場合
// この場合app/book/[id]/page.tsxの[id]の部分にoz6t9zj9e5fが自動的に入り、
// idごとに分けられたpage.tsxが生成される。
// 注意点としてpage.tsx内でidを扱う為にはparamsでidを受け取る必要がある

import { getDetailBooks } from "@/app/lib/microcms/client";
import Image from "next/image";
import React from "react";

const DetailBook = async ({ params }: { params: { id: string } }) => {
  const book = await getDetailBooks(params.id)
  console.log(book);
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
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">公開日:{new Date(book.publishedAt).toLocaleDateString()}</span>
            <span className="text-sm text-gray-500">最終更新:{new Date(book.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBook;