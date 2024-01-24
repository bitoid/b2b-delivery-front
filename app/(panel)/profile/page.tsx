import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return <ProfileForm user={user} />;
}
