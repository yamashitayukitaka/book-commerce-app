
import { getDetailBooks } from "@/app/lib/microcms/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// HTMLタグを除去する関数
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "");
}

export async function POST(request: Request) {

  const { title, price, bookId, userId } = await request.json();

  try {
    const DetailBook = await getDetailBooks(bookId)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
        bookId: bookId,
      },
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: title,
              description: stripHtml(DetailBook.content),
              images: [DetailBook.thumbnail.url],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/watch/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });
    return NextResponse.json({ checkout_url: session.url });
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
}