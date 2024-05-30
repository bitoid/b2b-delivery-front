import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  return <ProfileForm user={user} />;
}
