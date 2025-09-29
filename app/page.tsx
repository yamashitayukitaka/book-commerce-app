import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBook } from "./lib/microcms/client";
import { BookType, User, Purchase } from "./types/types";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import Image from "next/image";
import { redHat } from "@/app/font/font";

export default async function Home() {
  const { contents } = await getAllBook();
  console.log(contents);

  const session = await getServerSession(nextAuthOptions)
  const user = session?.user as User;
  console.log(session);


  let purchasedBookIds: string[] = [];
  if (user) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`, {
      next: { revalidate: 0 }
    });
    const purchasesData = await response.json();
    console.log(purchasesData);
    purchasedBookIds = purchasesData.map((purchaseBook: Purchase) => purchaseBook.bookId);
  }
  return (
    <>
      <main>
        <div className="relative overflow-hidden mb-[48px]">
          <Image
            src="/hero/img01.jpg"
            alt="カバー画像"
            width={1920}        // 画像の元サイズに合わせて大きめに設定
            height={700}
            sizes="100vw"         // 親要素にフィット
            className="object-cover"
          />
          <p className={`${redHat.className} text-[#fff] absolute top-[30%] px-20 py-0 font-bold text-[64px] tracking-[3.2px]
    max-[768px]:text-[32px] max-[768px]:top-[10%]
    max-[520px]:text-[24px] max-[520px]:top-[5%] max-[520px]:px-[20px]`}>
            THE AREA OF DIVERSITY IS COMING.
          </p>
        </div>
        <h2 className={`${redHat.className} text-center tracking-[2px] text-[40px] mb-[40px] [@media(max-width:768px)]:text-[24px]`}>
          COLLECTION
        </h2>
        <div className="flex flex-wrap w-[1400px] m-auto gap-x-[10px] gap-y-[10px] mb-[100px] px-[20px] max-[1400px]:w-full max-[1400px]:gap-x-[4%]">
          {contents.map((book: BookType) => (
            <Book
              key={book.id}
              book={book}
            />
          ))}
        </div>
      </main>
    </>
  );
}

