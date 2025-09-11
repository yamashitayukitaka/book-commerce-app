

import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBook } from "./lib/microcms/client";
import { BookType, User, Purchase } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";


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
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            isPurchased={purchasedBookIds.includes(book.id)
              // includesメソッドは、配列が指定された値を含んでいるかどうかをチェックし、含んでいればtrue、含んでいなければfalseを返します。
            }
          />
        ))}
      </main>
    </>
  );
}

