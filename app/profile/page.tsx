import { getServerSession } from "next-auth";
import { User, Purchase, BookType } from "@/app/types/types";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { getDetailBooks } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";



export default async function ProfilePage() {

  const session = await getServerSession(nextAuthOptions)
  const user = session?.user as User;
  console.log(session);

  let purchaseDetailBooks: BookType[] = [];

  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`, {
      cache: 'no-store', // SSR
    });
    const purchasesData = await response.json();
    console.log(purchasesData);
    purchaseDetailBooks = await Promise.all(
      purchasesData.map((purchase: Purchase) => getDetailBooks(purchase.bookId))
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">購入履歴</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <h2 className="text-lg ml-4 font-semibold">{user.name}</h2>
        </div>
      </div>

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