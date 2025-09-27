'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useLoginModal from '@/app/hooks/useLoginModal'
import useSignupModal from '@/app/hooks/useSignupModal'
import Modal from '@/app/components/modals/Modal'
import Input from '@/app/components/input/Input'
import axios from 'axios'
import * as z from 'zod'

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

export type SignupFormValues = {
  name: string
  email: string
  password: string
}

// サインアップモーダル
const SignupModal = () => {
  const router = useRouter()
  const signupModal = useSignupModal()
  const loginModal = useLoginModal()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    // 初期値
    defaultValues: { name: '', email: '', password: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // ログインモーダルを開く
  const onToggle = useCallback(() => {
    signupModal.onClose()
    loginModal.onOpen()
  }, [signupModal, loginModal])

  // 送信
  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setLoading(true)

    try {
      // サインアップ
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, data)

      if (res.status === 200) {
        toast.success('アカウントを作成しました!')

        // ログイン
        await signIn('credentials', {
          ...data,
          redirect: false,
        })

        signupModal.onClose()
        router.refresh()
      }
    } catch (error) {
      toast.error('エラーが発生しました。' + error)
    } finally {
      setLoading(false)
    }
  }

  // モーダルの内容
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input<SignupFormValues>
        id="name"
        label="名前"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input<SignupFormValues>
        id="email"
        label="メールアドレス"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input<SignupFormValues>
        id="password"
        label="パスワード"
        type="password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  // フッターの内容
  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      {/* Googleログイン */}
      {/* <Button outline label="Googleでログイン" icon={FcGoogle} onClick={() => signIn('google')} /> */}
      {/* signIn() は NextAuth.js のクライアント関数で、ログイン処理を開始するために使用。
      第一引数には、authOptions.providers で定義したプロバイダーID（例: "google", "github" など）を指定する。 */}
      {/* ログインリンク */}
      <div className="mt-4 text-center">
        <div onClick={onToggle} className="cursor-pointer text-sm text-neutral-500 hover:underline">
          ログインする
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={loading}
      isOpen={signupModal.isOpen}
      title="サインアップ"
      primaryLabel="サインアップ"
      onClose={signupModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default SignupModal