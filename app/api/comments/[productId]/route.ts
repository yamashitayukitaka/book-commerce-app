import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: { productId: string } }) => {
  try {
    await prisma.$connect();
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
    await prisma.$connect();
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
