// app/otp/page.tsx
import { Suspense } from "react";
import OtpForm from "./OtpForm";

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">Loading...</div>}>
      <OtpForm />
    </Suspense>
  );
}