"use client"; // クライアントコンポーネントにする
// 親がサーバーコンポーネント内であってもuseRouter（useRouterはサーバーコンポーネントでは使えない）を使うために
// CheckoutButton自体をクライアントコンポーネントにする
// 子コンポーネントをクライアントコンポーネントにすることで、親がサーバーコンポーネントであっても
// 子コンポーネント内でuseRouterを使用できるようになる



import { useRouter } from "next/navigation";
import React from "react";

interface CheckoutButtonProps {
  bookId: string;
  title: string;
  price: number;
  userId?: string;
  isPurchased?: boolean;
}

const CheckoutButton = ({ bookId, title, price, userId, isPurchased }: CheckoutButtonProps) => {
  const router = useRouter();
  console.log(userId);

  const startCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, title, price, userId }),
      });
      const data = await response.json();
      router.push(data.checkout_url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAlreadyPurchased = () => {
    alert("この商品はすでに購入済みです。");
  }

  const handleClickControl = () => {
    if (!userId) {
      alert('ログインしてください')
      return;
    }
    if (isPurchased) {
      handleAlreadyPurchased();
    } else {
      startCheckout();
    }
  };

  return <button
    className="text-[rgba(255,255,255,0.9)] px-[20px] py-[10px] border border-[rgba(255,255,255,0.7)] hover:opacity-70 mb-[15px]"
    onClick={handleClickControl}> 購入する →</button >;
};

export default CheckoutButton;
