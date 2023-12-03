import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "შეკვეთის დამატება",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
     <> {children}</>
             
        
 
  );
}
