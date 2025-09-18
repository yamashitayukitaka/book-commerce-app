✅ npx prisma migrate dev
データベースのスキーマを変更する
実際にテーブルやカラムがDBに作られる／変更される

✅ prisma generate
TypeScript用のPrisma Clientを最新スキーマに合わせて再生成する
これをやらないと、TypeScript上で新しいフィールドや関係が反映されない
その結果、prisma.comment.create({ data: { productId: ... } }) が型エラーやDB操作失敗になる

✅ VS Code再起動（またはTSサーバー再起動）
型補完やエラー表示が変になる場合にのみ必要
再起動後、npm run dev で開発サーバーを起動すると最新状態で反映される