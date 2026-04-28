import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DEC Learning Hub",
  description: "Practical learning for local and grassroots CSOs.",
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
