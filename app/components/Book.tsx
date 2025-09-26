"use client";
import Image from "next/image";
import { BookType } from "../types/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/types";
// Next.js 13.4 以降は next/navigation を使う
// import { useRouter } from "next/router";(これはPages router)



type BookProps = {
  book: BookType;
  isPurchased: boolean;
}

// eslint-disable-next-line react/display-name
const Book = ({ book, isPurchased }: BookProps) => {
  const { data: session } = useSession();
  // useSessionはnextAuthの関数で セッション情報を返す関数


  const user = session?.user as User;
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  console.log(user?.id);
  console.log(book.id);



  const startCheckout = async () => {
    // ------------------------------------------------
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
      // fetch() の返り値は Response オブジェクト（Promise<Response>）。
      // その Response の中身には、サーバー（= Next.js のルートハンドラー GET / POST など）が return したもの が含まれている。
      // ------------------------------------------------
      const responseData = await response.json();
      if (responseData) {
        router.push(responseData.checkout_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const GoToProductDetail = () => {
    router.push(`/book/${book.id}`);
  }

  const handleCancel = () => {
    setShowModal(false);
  }

  // const handlePurchaseClick = () => {
  //   if (isPurchased) {
  //     alert('その商品は購入済みです');
  //   } else {
  //     setShowModal(true);
  //   }
  // }

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


      <div className="flex w-[calc((1400-30)/4*1px)]">
        <a onClick={GoToProductDetail} className="cursor-pointer block group">
          <div className="[aspect-ratio:4/5] overflow-hidden">
            <Image
              priority
              src={book.thumbnail.url}
              alt={book.title}
              width={450}
              height={350}
              className="transition-all duration-500 transform group-hover:scale-125"
            />
          </div>
          <div className="px-4 py-4 bg-slate-100">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>
      </div>
    </>
  );
};

export default Book;