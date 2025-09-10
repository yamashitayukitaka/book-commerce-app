import Image from "next/image";
import { getServerSession } from "next-auth";
import { User, Purchase, BookType } from "@/app/types/types";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { getDetailBooks } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";


export default async function ProfilePage() {

  const session = await getServerSession(nextAuthOptions)
  // これは現在NextAuthでログインしている人のユーザー情報（セッション情報）を取得している
  const user = session?.user as User;
  console.log(session);

  let purchaseDetailBooks: BookType[] = [];

  if (user) {
    const response = await fetch(`/api/purchases/${user.id}`, {
      // GET のときは method を書かなくても大丈夫
      // fetch() のデフォルトメソッドは GET
      cache: 'no-store' // SSR
    });

    // ログインしているユーザーごとに購入履歴が違うので、
    // 動的ルーティングで現在NextAuthでログインしている人のユーザーidを
    // fetch先URLに渡して、ユーザーごとの購入履歴が取得できるようにしている

    const purchasesData = await response.json();
    console.log(purchasesData);

    // -----------------------------------------------------
    purchaseDetailBooks = await Promise.all(
      purchasesData.map((purchase: Purchase) => getDetailBooks(purchase.bookId))
    );
    // promise allは通常のawait 非同期処理の位置にawait Promise.all 非同期処理と書くことで、 
    // await Promise.allの直後に記述した非同期処理を同時実行させられる

    // ✅下記は冗長になり余分なreturnが入るので上記が推奨される
    // const purchaseDetailBooks = await Promise.all(
    //   purchasesData.map(async (purchase: Purchase) => {
    //     return await getDetailBooks(purchase.bookId);
    //   })
    // );
    // -----------------------------------------------------
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || '/default_icon.png'}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {purchaseDetailBooks.map((purchaseDetailBook: BookType) => (
          <PurchaseDetailBook
            key={purchaseDetailBook.id}
            purchaseDetailBook={purchaseDetailBook}
          />
        ))}
      </div>
    </div>
  );
}