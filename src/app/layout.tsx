import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/UI/layout/header";
import { siteConfig } from "@/config/site.config";
import { auth } from "@/auth/auth";
import { SessionProvider } from "next-auth/react";
import { AppLoader } from "@/hoc/app-loader";
import { Title } from "@/components/UI/layout/title";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <SessionProvider session={session}>
          <AppLoader>
            <Header />
            <Title />
            <main
              className={`flex-1 flex flex-col max-w-[1280px] mx-auto w-full px-4`}
            >
              {children}
            </main>
            <footer className="flex h-[80px] justify-center items-center">
              {siteConfig.description}
            </footer>
          </AppLoader>
        </SessionProvider>
      </body>
    </html>
  );
}
