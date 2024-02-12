import Navigation from "@/components/Navigation";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "სამართავი პანელი",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const notifications =
    user?.user_data.user_type == "admin"
      ? await getNotifications(user?.token)
      : [];
  return (
    <html lang="en" className="bg-gray-200">
      <body className={cn(inter.className)}>
        <Navigation currentUser={user} notificationsData={notifications} />

        <main className="mt-10">
          <div className="mx-auto px-4 pb-12 sm:px-6 lg:px-8">{children}</div>
        </main>
      </body>
    </html>
  );
}

async function getNotifications(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/notifications/`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
