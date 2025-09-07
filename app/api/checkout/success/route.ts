// ✅このファイルの役割
// Stripe自体は 決済の処理や請求情報の管理 は行いますが、ユーザー向けに「購入履歴ページ」を自動生成してくれるわけではない。
// そのため、購入情報を別にデータベースにPOSTしてから、改めてデータベースからGETしてクライアントサイドに表示させる必要がある。
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request, response: Response) {
  // RequestはTypeScriptが用意しているRequestオブジェクトの型定義であり、requestにはRequestオブジェクトが入る

  const { sessionId } = await request.json();
  try {
    // ---------------------------------------------------
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Stripe側で管理されているCheckout Session情報を、sessionIdを指定して取得する
    // Checkout Session情報というのは購入した内容をStripe側でsessionとして保管している情報
    // sessionなのでその購入履歴はexpireしたら消える

    // ✅stripe.checkout.sessions.retrieve(sessionId)で取得できるCheckout Session情報の中身
    //   {
    //   id: "cs_test_a1b2c3d4e5",      // Checkout Session の一意なID
    //   object: "checkout.session",    // オブジェクトタイプ
    //   payment_status: "unpaid",      // 支払い状況 ("paid" / "unpaid" / "no_payment_required")
    //   customer: null,                // Customer ID (作成されていれば)
    //   client_reference_id: "userId123", // create 時に指定した client_reference_id
    //   metadata: {
    //     bookId: "book123",           // create 時に設定した metadata
    //   },
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "jpy",
    //         unit_amount: 1500,       // 金額（円の場合は最小通貨単位で）
    //         product_data: {
    //           name: "商品タイトル",
    //           description: "Your Product Description",
    //           images: ["https://example.com/product-image.png"]
    //         }
    //       },
    //       quantity: 1
    //     }
    //   ],
    //   mode: "payment",               // payment / subscription など
    //   success_url: "http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}",
    //   cancel_url: "http://localhost:3000",
    //   url: "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5", // Stripe が生成する Checkout ページURL
    //   amount_total: 1500,            // 総額（unit_amount × quantity の合計）
    //   currency: "jpy",
    //   created: 1693603200,           // 作成日時（UNIXタイムスタンプ）
    //   expires_at: 1693689600         // セッション有効期限
    // }
    // ---------------------------------------------------


    // ---------------------------------------------------
    //  ✅購入してないときは処理が走らないようにする
    // そのために必要な情報を取得して、取得できないときだけ処理が走るように制御する
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id!,
        bookId: session.metadata?.bookId!,
      }
    })

    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id!,
          bookId: session.metadata?.bookId!,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      return NextResponse.json({ message: 'すでに購入済みです' });
    }
    // ---------------------------------------------------


  } catch (err: any) {
    return NextResponse.json({ message: err.message });
    // Response オブジェクトは .json() を持つが、これは「レスポンスをJSONとして読み取る」ためのもの。
    // サーバーからJSONを返したい場合は Response でも書けるが、
    // Next.js では NextResponse.json() を使う方がシンプルで推奨される。
  }
}