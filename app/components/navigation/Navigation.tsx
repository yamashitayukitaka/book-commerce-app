'use client'
import { User } from "@prisma/client"
import Link from "next/link"
import Menu from "@/app/components/navigation/Menu"
import { libreBodoni } from "@/app/font/font";

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
