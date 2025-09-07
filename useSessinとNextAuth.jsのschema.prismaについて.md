✅useSessionはnextAuthの関数で セッション情報を返す関数

※以下の形で使用。
const { data: session } = useSession();

※以下の構造でsession情報を返却する
 構造例）
  {
  data: {
    user: {
      name: "Taro",
      email: "taro@example.com",
      image: "https://example.com/avatar.png"
    },
    expires: "2025-09-25T12:34:56.789Z"
    },
    status: "authenticated"
  }
※expires は NextAuth が管理するセッションの有効期限
※dataが空の場合はログインしていないということ


✅NextAuthが公式ドキュメントで指定しているsession情報管理に関するPrisma model
※以下のmodelでテーブルを作成しそこにデータを保存することにより、
NextAuthが柔軟にsessionに関する情報を紐図けているDB(SupabaseやPrisma postgreなど）から取り出す


generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Account {
  id                 String    @id @default(cuid())
  userId             String
  providerType       String
  providerId         String
  providerAccountId  String
  refreshToken       String?
  accessToken        String?
  accessTokenExpires DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  user               User      @relation(fields: [userId], references: [id])

  @@unique([providerId, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  expires      DateTime
  sessionToken String   @unique
  accessToken  String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model VerificationRequest {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, token])
}
