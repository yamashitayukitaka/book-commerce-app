

import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBook } from "./lib/microcms/client";
import { BookType, User, Purchase } from "./types/types";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import Image from "next/image";
import { redHat } from "@/app/font/font";

export default async function Home() {

  const { contents } = await getAllBook();
  // 分割代入
  // getAllBook() が返すオブジェクトの中から contents プロパティだけを取り出して変数に代入
  // ✅getAllBook()の返り値例
  //   {
  //   contents: [
  //     { id: '1', title: 'Book A', ... },
  //     { id: '2', title: 'Book B', ... },
  //   ],
  //   totalCount: 2,
  //   offset: 0,
  //   limit: 10
  // }

  // ✅totalCount など他のプロパティも同時に取り出す場合
  // 　const { contents, totalCount } = await getAllBook();
  console.log(contents);

  const session = await getServerSession(nextAuthOptions)
  // これは現在NextAuthでログインしている人のユーザー情報（セッション情報）を取得している
  const user = session?.user as User;
  console.log(session);


  let purchasedBookIds: string[] = [];
  // jsxでPropsとして渡すために、ifスコープ外で使用する必要があるのでここで定義

  if (user) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`, {
      // GET のときは method を書かなくても大丈夫
      // fetch() のデフォルトメソッドは GET
      // cache: 'no-store', // SSR
      next: { revalidate: 0 } // Vercel環境でのキャッシュを確実に無効化
    });

    // ログインしているユーザーごとに購入履歴が違うので、
    // 動的ルーティングで現在NextAuthでログインしている人のユーザーidを
    // fetch先URLに渡して、ユーザーごとの購入履歴が取得できるようにしている

    const purchasesData = await response.json();
    console.log(purchasesData);

    purchasedBookIds = purchasesData.map((purchaseBook: Purchase) => purchaseBook.bookId);
  }
  return (
    <>
      <main>
        <div className="relative h-screen overflow-hidden mb-[48px]">
          <Image
            src="/hero/img01.jpg"
            alt="カバー画像"
            width={1920}        // 画像の元サイズに合わせて大きめに設定
            height={700}
            sizes="100vw"         // 親要素にフィット
            className="object-cover"
          />
          <p className={`${redHat.className} text-xl text-[#fff] absolute top-[30%] left-[50px] font-bold text-[64px] tracking-[3.2px]`}>
            THE AREA OF DIVERSITY IS COMING.
          </p>
        </div>
        <h2 className={`${redHat.className} text-center tracking-[2px] text-[40px] mb-[40px]`}>
          COLLECTION
        </h2>
        <div className="flex flex-wrap w-[1400px] m-auto gap-[10px] mb-[100px]">
          {contents.map((book: BookType) => (
            <Book
              key={book.id}
              book={book}
              isPurchased={purchasedBookIds.includes(book.id)
                // includesメソッドは、配列が指定された値を含んでいるかどうかをチェックし、含んでいればtrue、含んでいなければfalseを返します。
              }
            />
          ))}
        </div>
      </main>
    </>
  );
}

