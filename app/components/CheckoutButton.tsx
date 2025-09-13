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
}

const CheckoutButton = ({ bookId, title, price, userId }: CheckoutButtonProps) => {
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

  return <button onClick={startCheckout}>購入する</button>;
};

export default CheckoutButton;
