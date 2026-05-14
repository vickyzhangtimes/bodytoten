import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BodyTotem 身体图腾所",
  description: "把你的小烦恼生成一枚专属图腾，并转成商品订单和工厂生产单。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

