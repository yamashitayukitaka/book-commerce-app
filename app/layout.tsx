import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import AuthContext from "./context/AuthContext";
import getCurrentUser from "./actions/getCurrentUser";
import Navigation from "./components/navigation/Navigation";
import SignupModal from "./components/modals/SignupModal";
import LoginModal from "./components/modals/LoginModal";
import ToasterContext from "@/app/context/ToasterContext";


const notSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "multiplicity",
  description: "架空の腕時計ブランドのECサイトです。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();


  return (
    <html lang="ja">
      <body
        className={`${notSansJP.className} overflow-x-hidden`}
      >
        <AuthContext>
          <ToasterContext />
          <SignupModal />
          <LoginModal />
          <Navigation currentUser={currentUser} />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </AuthContext>
      </body>
    </html>
  );
}
