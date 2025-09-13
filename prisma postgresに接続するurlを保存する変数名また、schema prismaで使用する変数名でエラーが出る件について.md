✅ローカル環境 → Prisma は PRISMA_DATABASE_URL でしか動かない
(DATABASE_URL にすると Prisma がエラーを出す)
本番環境（Vercelなど） → PRISMA_DATABASE_URL でも DATABASE_URL でも接続できる

つまり 本番環境ではどちらでも問題ないが、ローカルでは Prisma が PRISMA_DATABASE_URL を期待している