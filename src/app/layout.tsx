import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

export const metadata: Metadata = {
  title: "CODYSSEY 25",
  description: "A Spooky competitive coding showdown",
  icons: {
    icon: "/logo.svg", // relative to /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights />
      <body className={`antialiased bg-[#070707] text-white`}>{children}</body>
    </html>
  );
}
