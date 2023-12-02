import Navigation from "@/components/Navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B Delivery",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="bg-gray-100">
      <body className={inter.className}>
        <Navigation />

        {children}
      </body>
    </html>
  );
}
