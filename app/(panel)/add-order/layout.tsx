import type { Metadata } from "next";

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
