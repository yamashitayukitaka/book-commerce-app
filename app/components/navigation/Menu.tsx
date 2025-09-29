'use client'

import React, { useCallback, useState } from 'react'
import { signOut } from 'next-auth/react'
import { User } from '@prisma/client'

import useLoginModal from '@/app/hooks/useLoginModal'
import useSignupModal from '@/app/hooks/useSignupModal'
import MenuItem from '@/app/components/navigation/MenuItem'
import Link from 'next/link'


type MenuProps = {
  currentUser: User | null
}

const Menu: React.FC<MenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(true)
  const loginModal = useLoginModal()
  const signupModal = useSignupModal()
  const alertLogin = () => {
    alert('ログインしてください')
  }


  return (


    <div className='flex items-center gap-[20px] max-md:gap-[8px]'>
      <div className="cursor-pointer flex gap-[20px] max-md:gap-[8px]">
        {currentUser ? (

          <>
            <MenuItem
              label="ログアウト"
              onClick={() => {
                signOut({ callbackUrl: "/" })
                setIsOpen(false)
              }}
            />
          </>
        ) : (
          <>
            <MenuItem
              label="ログイン"
              onClick={() => {
                loginModal.onOpen()
                // zustandの典型的な実行方法
                setIsOpen(false)
              }}
            />
            <MenuItem
              label="新規登録"
              onClick={() => {
                signupModal.onOpen()
                setIsOpen(false)
              }}
            />
          </>
        )}
      </div>
      <Link
        className='cursor-pointer text-[#fff] hover:opacity-60 max-[768px]:text-[14px]'
        href={currentUser ? "/profile" : "#"}
        onClick={(e) => {
          if (!currentUser) {
            e.preventDefault();
            alert("ログインが必要です");
          }
        }}
      >
        購入履歴
      </Link>
    </div>

  )
}

export default Menu
