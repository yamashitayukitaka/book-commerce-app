// このファイルの概要
// 主に開発時（ホットリロードを使う環境）のためのコード
// 本番環境では必要ない

// PrismaClientはクラスなので、new演算子をつけて利用可能な状態にする(インスタンス化)
// ホットリロードのときに何回もnew PrismaClient();が実行されないようにするためのコード

// new PrismaClient() が実行されると、Prisma がデータベースへの接続を確立します。
// 接続数が増えすぎる、メモリやリソースを無駄に消費、予期せぬ挙動の原因などになる可能性がある



import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// ------------------------------------
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
// prismaがインスタンス化されていない場合のみインスタンス化する
// ------------------------------------

prisma = globalForPrisma.prisma;

export default prisma;