import type { Metadata } from "next";
import "./globals.css";
import { Shantell_Sans } from "next/font/google";

const shantellSans = Shantell_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Name Scrmblr",
  description: "Assigning you and your friends names",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${shantellSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
