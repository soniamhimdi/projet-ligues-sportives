// src/app/(player)/profile/page.tsx
import { requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Mon profil</h1>
      <p className="text-gray-500 mt-2">{user.email}</p>
    </div>
  );
}