/** @type {import('next').NextConfig} */

// Next.js の Image コンポーネントで外部ドメインの画像を表示するには、remotePatterns または domains を設定する必要があります。
// ここでは GitHub のアバター画像 (https://avatars.githubusercontent.com) を許可しています

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← verrcelデプロイ時にESlintエラーがあっても無視してデプロイさせる。
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

// ✅マイクロCMSは「外部ドメイン」扱い
// WordPress（通常のCMS）では、フロントエンドとバックエンドが同じサーバー内にあり、画像 URL も自サーバー上です。
// マイクロCMS（ヘッドレスCMS）は、フロントエンド（Next.js）とマイクロCMSのAPIサーバーは別サーバーです。
// → 画像も https://images.microcms-assets.io/... という 別ドメイン から配信されます。だからnextConfigで設定する必要がある。


// ✅例えばwordpressの場合、DBのデータを取り出す場合外部という認識にはならない これが、ヘッドレスCMSでフロントとDBが別であるという概念を示している




