import Image from "next/image";
import Link from "next/link";
import React from "react";
import { User } from "../types/types";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
// User型をインポート

const Header = async () => {
  // ------------------
  // const { data: session } = useSession();
  // useSession() が返すオブジェクトの中から data プロパティだけを取り出して
  // それを session という名前の変数 に代入しています。

  // 構造例）
  //   {
  //     data: { user: { name: "Taro" } },
  //     status: "authenticated"
  //   }

  // console.log(session);

  // const user = session?.user as User;

  // ✅ヘッダーアイコン画像の表示が遅いので、useSession()ではなく
  // getServerSession()を使ってサーバーサイドでセッション情報を取得するように変更
  // これにより、ヘッダーアイコン画像の表示が速くなる
  // ------------------
  const session = await getServerSession(nextAuthOptions)
  // これは現在NextAuthでログインしている人のユーザー情報（セッション情報）を取得している
  const user = session?.user as User;
  // ------------------





  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Book Commerce
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <Link
            // href={user ? `/profile` : `/api/auth/signin`}
            // 上記NextAuthデフォルトのサインイン画面
            // 下記作成したサインイン画面どちらを使用しても良い
            // vercelにデプロイするときは上記の方が都合が良い
            href={user ? `/profile` : `/login`}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {user ? "プロフィール" : "ログイン"}
          </Link>


          {user ?
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">ログアウト</button> : ""
            // ✅onClickはクライアントコンポーネントでしか使えないので、下記に変更
            // /api/auth/signout" は NextAuth がデフォルトで用意しているサインアウト用エンドポイント
            // <Link href="api/auth/signout" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">ログアウト</Link> : ""
          }
          {/* signOut関数はNextAuthが準備している関数で、ユーザーをログアウトさせるために使用し、callbackUrlオプションを指定することで、ログアウト後に遷移するURLを設定できます。 */}


          <Link href={`/profile`}>
            <Image
              width={50}
              height={50}
              alt="profile_icon"
              src={user?.image || '/default_icon.png'}

            // 論理和は、最初に評価されるtruthyな値を返す
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;