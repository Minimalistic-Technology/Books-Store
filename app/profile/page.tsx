
import { Suspense } from "react";
import UserProfile from "./UserProfile";

export default function ProfilePage() {
  
  
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <UserProfile />
    </Suspense>
  );
}
