import type { Metadata } from "next";
import { FavoritesProvider } from "@/context/FavoritesContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Management Platform",
  description:
    "Mobile accessories business management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}