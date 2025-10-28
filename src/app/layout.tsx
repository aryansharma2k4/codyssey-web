import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CODYSSEY 25",
  description: "A Spooky competitive coding showdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-[#070707] text-white`}>{children}</body>
    </html>
  );
}
