import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/session";
import { get } from "http";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  console.log(user?.user_data.profile);
  return <ProfileForm user={user?.user_data.profile} />;
}
