import AddUserForm from "@/components/AddUserForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const AddUser = async () => {
  const user = await getCurrentUser();
  if (user?.user_data.user_type !== "admin") {
    redirect("/login");
  }

  return <AddUserForm token={user.token} />;
};

export default AddUser;
