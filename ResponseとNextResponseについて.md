🌐 Response オブジェクトのイメージ
{
  status: 200, // ステータスコード（200=成功, 404=見つからない, 500=エラー）
  statusText: "OK", // ステータスメッセージ（200なら OK）

  headers: { // 応答ヘッダー
    "content-type": "application/json",
    "set-cookie": "sessionId=abc123; Path=/; HttpOnly"
  },

  body: "{ \"message\": \"Hello World\" }", // 実際に送られるデータ（文字列）
  ok: true,  // ステータスコードが 200-299 の場合 true
  redirected: false, // リダイレクトされたかどうか
  type: "basic", // レスポンスの種類（basic, cors, opaque など）
  url: "https://example.com/api/data" // どのURLから来たか
}


=================================================================

🌟 NextResponse のイメージ（オブジェクト形式）
{
  status: 200,              // HTTPステータスコード
  statusText: "OK",         // ステータスメッセージ

  headers: {                // ヘッダー情報
    "content-type": "application/json",
    "set-cookie": "sessionId=abc123; Path=/; HttpOnly"
  },

  body: "{ \"message\": \"Hello World\" }", // 実際の返却データ
  ok: true,                // 200-299なら true
  redirected: false,       // リダイレクトされたか
  type: "basic",           // レスポンスの種類
  url: "https://example.com/api/data", // レスポンス元の URL

  // ================= NextResponse 独自の追加機能 =================
  cookies: {               // Cookie を簡単に操作できるオブジェクト
    get: (name: string) => "abc123",   // 名前指定で取得
    getAll: () => [{ name: "sessionId", value: "abc123", Path: "/" }],
    set: (name: string, value: string, options?: any) => {}, // 設定
    delete: (name: string) => {}      // 削除
  },

  json: () => ({ message: "Hello World" }), // body を自動で JSON に変換

  redirect: (url: string, status?: number) => { /* 指定URLへリダイレクト */ },
  rewrite: (url: string) => { /* URLを書き換え（プロキシ的） */ },
  next: () => { /* ミドルウェア用：次の処理に進める */ }
}
