import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
    // prisma.$connect()はDBとの接続を確立するためのメソッドです。
    // GETの場合は不要の場合があるが、POSTやPUTなどのデータを変更する操作を行う場合には、接続を確立しておく必要があります。
    // $connect() は 非同期メソッド であり、Prisma が内部で Promise を返すように作られています。
    // だから await が使えるのです。
  } catch (err) {
    return Error('DB接続に失敗しました')
  }
}

export const GET = async (req: Request, { params }: { params: { productId: string } }) => {
  try {
    await main();
    const { productId } = params;
    console.log("productId:", productId); // productIdが正しく取得できているか確認するためのログ
    const post = await prisma.comment.findMany({ where: { productId: productId } });
    return NextResponse.json({ message: "Sucsess", post }, { status: 200 })
    // 第１引数のオブジェクトになかにGETできたデータ(post)を含め、フロントエンドに渡す。
    // App RouterではNextResponse.json()を使う。
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 })

  } finally {
    await prisma.$disconnect();
  }
}

export const POST = async (req: Request, { params }: { params: { productId: string } }) => {
  try {
    await main();
    const body = await req.json();
    const { content } = body;
    const { productId } = params;

    const comment = await prisma.comment.create({
      data: { content, productId },
    });

    return NextResponse.json({ message: "Success", comment }, { status: 201 });
  } catch (err) {
    console.error("Prisma Error:", err); // <- まずこれでエラー内容を確認
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
