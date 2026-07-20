import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}