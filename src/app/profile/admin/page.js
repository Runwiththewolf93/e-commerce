import AdminCheck from "./check";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <AdminCheck session={session} />
    </>
  );
}
