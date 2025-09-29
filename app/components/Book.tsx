"use client";
import Image from "next/image";
import { BookType } from "../types/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/types";

type BookProps = {
  book: BookType;
}

const Book = ({ book }: BookProps) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  console.log(user?.id);
  console.log(book.id);

  const GoToProductDetail = () => {
    router.push(`/watch/${book.id}`);
  }

  return (
    <>
      <div className="flex w-[calc((1339px-30px)/4)] max-[1400px]:w-[48%]">
        <a onClick={GoToProductDetail} className="cursor-pointer block group w-full">
          <div className="[aspect-ratio:4/5] overflow-hidden">
            <Image
              priority
              src={book.thumbnail.url}
              alt={book.title}
              width={450}
              height={350}
              className="transition-all duration-500 transform group-hover:scale-125 w-full"
            />
          </div>
          <div className="px-4 py-4 bg-slate-100 w-full">
            <h2 className="text-[16px] max-[520px]:text-[14px]">{book.title}</h2>
            <p className="mt-2 text-md text-slate-700">{book.price}円</p>
          </div>
        </a>
      </div>
    </>
  );
};

export default Book;