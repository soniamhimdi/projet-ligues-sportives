import { getCurrentUser } from "@/lib/auth";
import Header from "./Header";

export default async function HeaderWrapper() {
  const user = await getCurrentUser();
  return <Header role={user?.role ?? null} />;
}
