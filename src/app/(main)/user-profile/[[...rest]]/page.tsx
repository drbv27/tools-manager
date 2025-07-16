// src/app/(main)/user-profile/page.tsx
import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex justify-center items-center h-full py-8">
      <UserProfile routing="path" path="/user-profile" />
    </div>
  );
}
