import UserList from "@/components/UserList";
import { getClients, getCouriers } from "@/lib/getUsers";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getCurrentUser();
  const couriers = await getCouriers(user?.token);
  const clients = await getClients(user?.token);

  if (!user) {
    redirect("/login");
  }
  return <UserList couriers={couriers} clients={clients} token={user?.token} />;
}
