"use client";

import { getProviders, signIn } from "next-auth/react";


// eslint-disable-next-line @next/next/no-async-client-component

// ---------------------------------------------------------------------
async function Login() {


  const providers = await getProviders().then((res) => {
    // getProviders関数は、api/auth/[...nextauth]/route.tsで定義された
    // NextAuth設定(nextAuthOptions)を参照し、登録されている認証プロバイダーの情報を取得する。
    console.log(res);
    return res;
  });


  // getProviders() を呼び出す → Promise が返る
  // .then((res) => { ... }) で Promise が解決されたときの値 res を受け取る
  // return res; により、その値が providers に格納される
  // つまり、providers には getProviders() が返す認証プロバイダーのオブジェクトが入ります。

  // このresはgetProviders関数内のPromiseの処理でresolveの引数に渡さされた値
  // getProviders() は Promise を返す非同期関数。
  // その Promise の resolve に渡された値 が .then((res) => … ) の res に入ってきます。
  // つまり res は getProviders の内部で用意されている「プロバイダー一覧オブジェクト」。



  // NextAuth の公式だと getProviders() が返す res の型はだいたいこんなイメージです：

  // {
  //   google: {
  //     id: "google",
  //     name: "Google",
  //     type: "oauth",
  //     signinUrl: "...",
  //     callbackUrl: "..."
  //   },
  //   github: {
  //     id: "github",
  //     name: "GitHub",
  //     type: "oauth",
  //     signinUrl: "...",
  //     callbackUrl: "..."
  //   },
  //   // ...他に設定しているもの
  // }


  // ----------------------------------------------------------------------


  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers).map((provider) => {
              // Object.values()でひとつの関数とみる
              // Object.values()は引数にオブジェクトを取り、
              // そのオブジェクトの値だけを配列にして返すメソッド。
              // mapは配列の各要素に対して処理を行うメソッドなので、
              // Object.values()でオブジェクトを配列に変換する必要がある。
              return (
                <div key={provider.id} className="text-center">
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    // nextAuthで準備されているsignIn関数第一引数にprovider.id(どのproviderを使用しているか)を渡す第二引数に
                    // ログイン成功後に どのURLへリダイレクトするか を指定
                    className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                    >
                      <title>GitHub icon</title>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.723-4.042-1.608-4.042-1.608-.546-1.386-1.332-1.754-1.332-1.754-1.087-.743.083-.728.083-.728 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.956-.266 1.98-.398 3-.403 1.02.005 2.044.137 3 .403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.768.838 1.234 1.91 1.234 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.824 1.102.824 2.222 0 1.604-.015 2.897-.015 3.29 0 .322.216.697.825.577C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>Githubでログイン</span>
                  </button>
                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
}

export default Login;