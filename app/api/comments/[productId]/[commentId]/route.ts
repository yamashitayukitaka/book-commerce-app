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

// 削除用
export const DELETE = async (
  req: Request,
  { params }: { params: { productId: string; commentId: string } }
) => {
  try {
    // DB接続
    await main();
    // commentId を使って削除
    const comment = await prisma.comment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json(
      { message: "Success", comment },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: "Error", err },
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
};

// 編集用
export const PUT = async (
  req: Request,
  { params }: { params: { productId: string; commentId: string } }
) => {
  try {
    await main();
    const { content } = await req.json();

    const comment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content },
    });

    return NextResponse.json(
      { message: "Success", comment },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: "Error", err },
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
};
