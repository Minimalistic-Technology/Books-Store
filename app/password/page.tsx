// app/password/page.tsx
import { Suspense } from "react";
import PasswordSetupForm from "./PasswordSetupForm";

export default function PasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>}>
      <PasswordSetupForm />
    </Suspense>
  );
}