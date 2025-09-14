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
      router.push('/login');
      return;
    }
    if (isPurchased) {
      handleAlreadyPurchased();
    } else {
      startCheckout();
    }
  };

  return <button onClick={handleClickControl}> 購入する</button >;
};

export default CheckoutButton;
