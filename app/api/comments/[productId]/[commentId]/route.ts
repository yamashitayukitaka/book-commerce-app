import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

// 削除用
export const DELETE = async (
  req: Request,
  { params }: { params: { productId: string; commentId: string } }
) => {
  try {
    // DB接続
    await prisma.$connect();
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
    await prisma.$connect();
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
