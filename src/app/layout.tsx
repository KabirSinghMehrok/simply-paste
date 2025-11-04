import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// JetBrains Mono font configuration
const jetbrainsMono = localFont({
  src: [
    {
      path: "../assets/fonts/JetBrainsMono-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/JetBrainsMono-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simply Paste - Simple Text Sharing",
  description: "Share text snippets quickly and anonymously with readable URLs and QR codes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>{children}</body>
    </html>
  );
}
