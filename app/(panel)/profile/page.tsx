import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  console.log(user);
  return <ProfileForm user={user} />;
}
