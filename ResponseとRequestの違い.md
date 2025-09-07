✅Requestはクライアントから送られたデータとそれを扱う処理（メソッド）の集まり
✅Responseはサーバーの処理をクライアントに返すデータとそれを扱う処理（メソッド）の集まり

🌐 Request オブジェクトのイメージ
{
  method: "POST",               // HTTPメソッド（GET, POST, PUT, DELETE など）
  url: "https://example.com/api/data", // リクエスト先の URL
  headers: {                    // リクエストヘッダー
    "content-type": "application/json",
    "authorization": "Bearer abc123"
  },
  body: "{ \"name\": \"Alice\", \"age\": 30 }", // 送信されるデータ（文字列やJSON）
  query: { id: "123" },         // URLクエリパラメータ（?id=123 の部分）
  cookies: {                     // 送信されるクッキー情報
    sessionId: "abc123"
  },
  redirected: false,            // リダイレクトされたかどうか
  credentials: "include",       // 認証情報の送信方法（include, same-origin, omit）
  keepalive: false,             // リクエストをバックグラウンドで続行するか

  // ================= メソッド =================
  json: () => ({ name: "Alice", age: 30 }),   // body を JSON に変換
  text: () => "{ \"name\": \"Alice\", \"age\": 30 }", // body を文字列として取得
  getHeader: (name: string) => "value",      // 指定ヘッダーを取得
  getCookie: (name: string) => "abc123"     // 指定クッキーを取得
}


🌐 Response オブジェクトのイメージ
{
  status: 200,                  // HTTPステータスコード（200=成功, 404=見つからない, 500=エラー）
  statusText: "OK",             // ステータスメッセージ
  headers: {                    // ヘッダー情報
    "content-type": "application/json",
    "set-cookie": "sessionId=abc123; Path=/; HttpOnly"
  },
  body: "{ \"message\": \"Success\" }", // 実際の返却データ
  ok: true,                      // 200-299なら true
  redirected: false,             // リダイレクトされたか
  type: "basic",                 // レスポンスの種類（basic, cors, opaque など）
  url: "https://example.com/api/data", // 元のリクエスト URL

  // ================= メソッド =================
  json: () => ({ message: "Success" }), // body を自動で JSON に変換
  text: () => "{ \"message\": \"Success\" }", // body を文字列として取得
  setHeader: (name: string, value: string) => {}, // ヘッダーを設定
  getHeader: (name: string) => "value",          // ヘッダーを取得
  setCookie: (name: string, value: string, options?: any) => {}, // Cookie 設定
  deleteCookie: (name: string) => {},            // Cookie 削除
  redirect: (url: string, status?: number) => {},// リダイレクト
  send: (data: string | object) => {},           // データ送信
}
