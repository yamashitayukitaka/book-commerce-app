
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
      // これはStripe側にsession情報として購入情報を送るコード
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
            // 値段の設定
          },
          quantity: 1,
          // 購入する数
        },
      ],
      mode: 'payment',
      // さまざまな取引タイプを処理するには、mode パラメーターを調整します。
      // 1 回限りの支払いの場合は payment を使用します。サブスクリプションで
      // 継続支払いを開始するには、mode を subscription に切り替えます。
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      // session_id={CHECKOUT_SESSION_ID}はStripe側が自動的にチェックアウト決済のIDをURLに追加してくれる
      //決済が成功した場合のリダイレクト先（自動的に移動する先）
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}`,
      // 購入キャンセル時のリダイレクト先
    });
    return NextResponse.json({ checkout_url: session.url });
    // session.url は Stripe が自動で生成する「Checkout 決済ページ」の URL
    // success_urlはチェックアウト決済成功時の遷移先なので、session.urlとは別なので注意
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
}