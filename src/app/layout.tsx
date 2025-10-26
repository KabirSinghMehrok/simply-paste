import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickShare - Simple Text Sharing",
  description: "Share text snippets quickly and anonymously with readable URLs and QR codes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
