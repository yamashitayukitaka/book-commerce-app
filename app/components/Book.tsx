"use client";
import Image from "next/image";
import { BookType } from "../types/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/types";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
}


const Book = ({ book, isPurchased }: BookProps) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  console.log(user?.id);
  console.log(book.id);

  const startCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: book.title,
          price: book.price,
          userId: user?.id,
          bookId: book.id,
        }),
      });
      const responseData = await response.json();
      if (responseData) {
        router.push(responseData.checkout_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const GoToProductDetail = () => {
    router.push(`/watch/${book.id}`);
  }

  const handleCancel = () => {
    setShowModal(false);
  }

  const handlePurchaseConfirm = () => {
    if (!user) {
      setShowModal(false);
      router.push('/login');
    } else {
      startCheckout();
    }
  }

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>


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