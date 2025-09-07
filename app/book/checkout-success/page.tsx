'use client';
// useSearchParams()を使用するときはクライアントコンポーネントでなければならない
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [bookUrl, setBookUrl] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  console.log(sessionId);

  useEffect(() => {
    // useEffectで発火タイミングを制御
    // --------------------------------------------------------
    // クライアントコンポーネントではコンポーネントにasyncをつけることはできない
    // ので以下で代用
    const fetchData = async () => {
      // sessionId がない場合は処理しない
      if (sessionId) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          });

          // console.log(await res.json());
          const data = await res.json();
          setBookUrl(data.purchase.bookId);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchData();
    // async関数は定義しただけでは実行されないので、fetchData()を呼び出す必要がある
    // ----------------------------------------------
  }, [sessionId]); // ← useEffect の依存配列はここで閉じる


  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          購入ありがとうございます！
        </h1>
        <p className="text-center text-gray-600">
          ご購入いただいた内容の詳細は、登録されたメールアドレスに送信されます。
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/book/${bookUrl}`}
            className="text-indigo-600 hover:text-indigo-800 transition duration-300"
          >
            購入した記事を読む
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;