'use client'
// ======================================================
import { User } from "@prisma/client"
import Link from "next/link"
import Menu from "@/app/components/navigation/Menu"
import { libreBodoni } from "@/app/font/font";


// npx prisma generateを実行することによって
// 上記のようにimportすれば、prisma shemaで定義したmodelのprismaの型定義
// がTypeScriptの型定義に自動で変換され利用可能になる



// model User {
//   id             String    @id @default(uuid())
//   name           String?
//   email          String?   @unique
//   emailVerified  DateTime?
//   image          String?
//   hashedPassword String?
//   createdAt      DateTime  @default(now())
//   updatedAt      DateTime  @updatedAt
//   accounts       Account[]
// }

// ✅上記modelが下記TypeScriptに変換される

// export type User = {
//   id: string
//   name: string | null
//   email: string | null
//   emailVerified: Date | null
//   image: string | null
//   hashedPassword: string | null
//   createdAt: Date
//   updatedAt: Date
// }

// ✅生成された型は node_modules/@prisma/client/index.d.ts にある。
// ======================================================



type NavigationProps = {
  currentUser: User | null
}


const Navigation: React.FC<NavigationProps> = ({ currentUser }) => {
  return (
    <>
      <header className="h-[100px] flex items-center px-[80px] py-0 bg-[rgb(11,_23,_39)] max-[768px]:px-[20px]">
        <div className="flex justify-between w-full">
          <Link href="/" className={`${libreBodoni.className} text-[24px] text-[#fff] max-[768px]:text-[16px]`}>
            multiplicity
          </Link>

          <div className="flex items-center justify-center space-x-2">
            <Menu currentUser={currentUser} />
          </div>
        </div>
      </header>
    </>
  )
}

export default Navigation
