import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();


export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;
  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId
      }
    });
    return NextResponse.json(purchases);
  } catch (err: any) {
    return NextResponse.json(err);
  }
}