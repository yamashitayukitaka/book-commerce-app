import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: { productId: string } }) => {
  try {
    await prisma.$connect();
    const { productId } = params;
    const post = await prisma.comment.findMany({ where: { productId: productId } });
    return NextResponse.json({ message: "Sucsess", post }, { status: 200 })
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
    const { content, userName } = body;
    const { productId } = params;

    const comment = await prisma.comment.create({
      data: { content, productId, userName },
    });

    return NextResponse.json({ message: "Success", comment }, { status: 201 });
  } catch (err) {
    console.error("Prisma Error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
