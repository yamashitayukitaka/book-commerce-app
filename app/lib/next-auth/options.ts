// このファイルは後々NextAuth関数の引数に渡すための外部ファイル化

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
// NextAuthOptions
// これは TypeScript の 型定義（interface） です。
// オプションオブジェクトが正しい構造になっているかtsを適応させてチェックするために使います。
import GithubProvider from "next-auth/providers/github"
import prisma from "../prisma";


export const nextAuthOptions: NextAuthOptions = {
  debug: false,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],
  adapter: PrismaAdapter(
    // Prismaのクライアントをここに渡す必要があります。
    prisma),
  // adapter は NextAuth がユーザー情報やセッション情報をどこに保存・取得するかを指定する仕組み
  // adapter を指定することで、データベースと連携して永続的に情報を保存できます。

  // ✅セッション情報もアカウント情報も同じDBに保存する。
  // 保存されるテーブル（Prisma の場合）
  // PrismaAdapter を使う場合は、通常は以下のテーブルを開発者が作成し、情報を保管する
  // User … ユーザー基本情報（名前、メールアドレスなど）
  // Account … 外部認証プロバイダ情報（GitHub, GoogleなどのIDやトークン）
  // Session … ログイン状態を管理するセッション情報
  // VerificationToken … メールログイン用のワンタイムトークンなど

  // 特徴
  // 同じDBに全部まとめて保存される
  // テーブルごとに情報の種類を分けているだけで、1つのDBの中に存在
  // これにより、ユーザー情報、ログイン情報、OAuth情報を統合管理できる

  callbacks: {
    session: ({ session, user }) => {
      // { session, user } は props ではなく、NextAuth のコールバック関数（例えば callbacks.session）に NextAuth が自動で渡す引数
      // ✅中身構造
      // session = {
      //   user: { name: "Alice", email: "alice@example.com" },
      //   expires: "2025-08-21T12:00:00.000Z"
      // }　　　
      // user = { id: "123", name: "Alice", email: "alice@example.com" }


      return {
        ...session,
        user: {
          ...session.user,
          id: user.id
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};



