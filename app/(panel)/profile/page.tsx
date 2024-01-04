import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/session";
import { get } from "http";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return <ProfileForm user={user} />;
}
